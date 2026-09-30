"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./borewell.module.css";
import {
  SVG_SIZE,
  SHAPES,
  bestPoint,
  clamp,
  clonePoints,
  colorForScore,
  directionForAngle,
  guidance,
  maxCornerDistance,
  normalizeAngle,
  pointInPolygon,
  pointsAttribute,
  polarPoint,
  polygonCentroid,
  scoreForAngle,
  scoreMeta,
  screenBearing,
  type Point,
} from "./planner";

type ShapeName = keyof typeof SHAPES;
type Result = ReturnType<typeof buildResult>;
const STORAGE_KEY = "vastucheck_borewell_access_v1";
const PRODUCT = "borewell-planner";
const RAZORPAY_BUTTON_URL = "https://razorpay.com/payment-button/pl_ThxnHHwlYa74Jy/view";

function hasLocalAccess() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Boolean(value?.unlocked && value?.product === PRODUCT);
  } catch {
    return false;
  }
}

function grantLocalAccess() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    unlocked: true,
    product: PRODUCT,
    unlockedAt: new Date().toISOString(),
  }));
}

function buildResult(center: Point, borewell: Point, points: Point[], north: number) {
  const bearing = screenBearing(center, borewell);
  const angle = normalizeAngle(bearing - north);
  const direction = directionForAngle(angle);
  const ratio = Math.hypot(borewell.x - center.x, borewell.y - center.y) / maxCornerDistance(center, points);
  const score = scoreForAngle(angle, ratio);
  return { angle, direction, ratio, score, meta: scoreMeta(score), guidance: guidance(direction.code, direction.name, score) };
}

function svgCoordinates(event: React.PointerEvent<SVGSVGElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * SVG_SIZE,
    y: ((event.clientY - rect.top) / rect.height) * SVG_SIZE,
  };
}

function BasePlot({ points, imageUrl, children }: { points: Point[]; imageUrl: string | null; children?: React.ReactNode }) {
  return (
    <>
      <defs>
        <pattern id="borewell-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#d9d6ca" strokeWidth="1" />
        </pattern>
        <clipPath id="borewell-plot-clip"><polygon points={pointsAttribute(points)} /></clipPath>
      </defs>
      <rect width="360" height="360" fill="url(#borewell-grid)" />
      {imageUrl && <image href={imageUrl} x="20" y="20" width="320" height="320" preserveAspectRatio="xMidYMid meet" opacity=".55" clipPath="url(#borewell-plot-clip)" />}
      <polygon points={pointsAttribute(points)} fill={imageUrl ? "rgba(255,255,255,.18)" : "rgba(16,91,72,.055)"} stroke="#173e37" strokeWidth="3" strokeLinejoin="round" />
      {children}
    </>
  );
}

function PlotEditor({ points, imageUrl, onPointsChange }: { points: Point[]; imageUrl: string | null; onPointsChange: (points: Point[]) => void }) {
  const [dragging, setDragging] = useState<number | null>(null);
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const point = svgCoordinates(event);
    const next = clonePoints(points);
    next[dragging] = { x: clamp(point.x, 24, 336), y: clamp(point.y, 24, 336) };
    onPointsChange(next);
  };
  return (
    <svg className={styles.plotSvg} viewBox="0 0 360 360" aria-label="Editable plot outline" onPointerMove={move} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
      <BasePlot points={points} imageUrl={imageUrl} />
      {points.map((point, index) => (
        <g key={index} className={styles.dragHandle} role="button" aria-label={`Plot corner ${index + 1}`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(index); }}>
          <circle cx={point.x} cy={point.y} r="18" fill="rgba(25,169,116,.16)" />
          <circle cx={point.x} cy={point.y} r="8" fill="white" stroke="#19a974" strokeWidth="4" />
        </g>
      ))}
    </svg>
  );
}

function CentreEditor({ points, imageUrl, center, onCenterChange }: { points: Point[]; imageUrl: string | null; center: Point; onCenterChange: (point: Point) => void }) {
  const [dragging, setDragging] = useState(false);
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const point = svgCoordinates(event);
    if (pointInPolygon(point, points)) onCenterChange(point);
  };
  return (
    <svg className={styles.plotSvg} viewBox="0 0 360 360" aria-label="Adjustable plot centre" onPointerMove={move} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}>
      <BasePlot points={points} imageUrl={imageUrl} />
      <g className={styles.dragHandle} role="button" aria-label="Plot centre" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }}>
        <circle cx={center.x} cy={center.y} r="24" fill="rgba(79,70,229,.14)" />
        <circle cx={center.x} cy={center.y} r="10" fill="#4f46e5" stroke="white" strokeWidth="4" />
        <path d={`M${center.x - 18} ${center.y}h36M${center.x} ${center.y - 18}v36`} stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function HeatMap({ points, imageUrl, center, borewell, north, onBorewellChange }: { points: Point[]; imageUrl: string | null; center: Point; borewell: Point; north: number; onBorewellChange: (point: Point) => void }) {
  const [dragging, setDragging] = useState(false);
  const update = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging && event.type === "pointermove") return;
    const point = svgCoordinates(event);
    if (pointInPolygon(point, points)) onBorewellChange(point);
  };
  const wedges = Array.from({ length: 32 }, (_, index) => {
    const start = index * 11.25;
    const end = start + 11.25;
    const relative = normalizeAngle(start + 5.625 - north);
    const a = polarPoint(center, start, 520);
    const b = polarPoint(center, end, 520);
    return { path: `M${center.x} ${center.y}L${a.x} ${a.y}A520 520 0 0 1 ${b.x} ${b.y}Z`, fill: colorForScore(scoreForAngle(relative, 0.6)) };
  });
  const angle = Math.round(normalizeAngle(screenBearing(center, borewell) - north));
  const label = polarPoint(center, screenBearing(center, borewell), Math.min(58, Math.hypot(borewell.x - center.x, borewell.y - center.y) / 2));
  return (
    <svg className={`${styles.plotSvg} ${styles.heatMap}`} viewBox="0 0 360 360" role="application" aria-label="Interactive Vastu suitability map" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); update(event); }} onPointerMove={update} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}>
      <defs>
        <clipPath id="heat-clip"><polygon points={pointsAttribute(points)} /></clipPath>
        <pattern id="heat-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" /></pattern>
      </defs>
      <rect width="360" height="360" fill="#efeee8" />
      <g clipPath="url(#heat-clip)">
        {wedges.map((wedge, index) => <path key={index} d={wedge.path} fill={wedge.fill} stroke="rgba(255,255,255,.16)" strokeWidth="1" />)}
        <rect width="360" height="360" fill="url(#heat-grid)" />
        {imageUrl && <image href={imageUrl} x="20" y="20" width="320" height="320" preserveAspectRatio="xMidYMid meet" opacity=".2" />}
      </g>
      <polygon points={pointsAttribute(points)} fill="none" stroke="#173e37" strokeWidth="4" strokeLinejoin="round" />
      <line x1={center.x} y1={center.y} x2={borewell.x} y2={borewell.y} stroke="rgba(15,30,28,.68)" strokeWidth="2" strokeDasharray="5 7" />
      <circle cx={center.x} cy={center.y} r="14" fill="rgba(255,255,255,.76)" />
      <circle cx={center.x} cy={center.y} r="5" fill="#172d29" />
      <path d={`M${center.x - 18} ${center.y}h36M${center.x} ${center.y - 18}v36`} stroke="#172d29" strokeWidth="1.5" />
      <rect x={label.x - 23} y={label.y - 13} width="46" height="25" rx="12.5" fill="#172d29" />
      <text x={label.x} y={label.y + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{angle}°</text>
      <circle cx={borewell.x} cy={borewell.y} r="27" fill="rgba(67,86,210,.2)" />
      <circle cx={borewell.x} cy={borewell.y} r="18" fill="#4057cf" stroke="white" strokeWidth="4" />
      <path d={`M${borewell.x - 7} ${borewell.y}h14M${borewell.x} ${borewell.y - 7}v14`} stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
}

export default function BorewellPlanner() {
  const [unlocked, setUnlocked] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [accessChecking, setAccessChecking] = useState(true);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [shape, setShape] = useState<ShapeName>("rectangle");
  const [points, setPoints] = useState<Point[]>(() => clonePoints(SHAPES.rectangle));
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [north, setNorth] = useState(0);
  const [center, setCenter] = useState<Point>(() => polygonCentroid(SHAPES.rectangle));
  const [borewell, setBorewell] = useState<Point>(() => bestPoint(polygonCentroid(SHAPES.rectangle), SHAPES.rectangle, 0));
  const [toast, setToast] = useState("");

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("rzp_return") === "1") {
        grantLocalAccess();
        setUnlocked(true);
        setPlannerOpen(true);
        showToast("Payment received — planner unlocked");
        params.delete("rzp_return");
        params.delete("razorpay_payment_id");
        const query = params.toString();
        window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
      } else {
        setUnlocked(hasLocalAccess());
      }
      setAccessChecking(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const result = useMemo<Result>(() => buildResult(center, borewell, points, north), [center, borewell, points, north]);

  const chooseShape = (nextShape: ShapeName) => {
    const next = clonePoints(SHAPES[nextShape]);
    setShape(nextShape);
    setPoints(next);
    setCenter(polygonCentroid(next));
  };

  const changeMode = (nextMode: "draw" | "upload") => {
    setMode(nextMode);
    if (nextMode === "draw") {
      setImageUrl(null);
      setFileName("");
      chooseShape(shape);
    }
  };

  const uploadPlan = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageUrl(URL.createObjectURL(file));
    setFileName(file.name);
    const next = clonePoints(SHAPES.rectangle);
    setPoints(next);
    setCenter(polygonCentroid(next));
  };

  const openProduct = () => {
    if (unlocked) {
      setPlannerOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else setPaymentOpen(true);
  };

  const advance = () => {
    if (step === 1 && mode === "upload" && !imageUrl) {
      showToast("Choose a plan image, or select Draw plot");
      return;
    }
    if (step === 1) setCenter(polygonCentroid(points));
    if (step < 3) setStep(step + 1);
    else {
      const next = bestPoint(center, points, north);
      setBorewell(next);
      setStep(4);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    const next = clonePoints(SHAPES.rectangle);
    const nextCenter = polygonCentroid(next);
    setStep(1); setMode("draw"); setShape("rectangle"); setPoints(next); setCenter(nextCenter);
    setNorth(0); setBorewell(bestPoint(nextCenter, next, 0)); setImageUrl(null); setFileName("");
    showToast("Planner reset");
  };

  const share = async () => {
    const summary = `VastuCheck Borewell Reference\n${result.direction.name} (${Math.round(result.angle)}° from North)\nVastu suitability: ${result.score}/100\nPosition: ${Math.round((borewell.x / SVG_SIZE) * 100)}% right, ${Math.round((borewell.y / SVG_SIZE) * 100)}% down\n\nVastu guidance only — confirm groundwater and site feasibility with qualified professionals.`;
    try {
      if (navigator.share) await navigator.share({ title: "My borewell Vastu reference", text: summary });
      else { await navigator.clipboard.writeText(summary); showToast("Result copied to clipboard"); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) showToast("Could not share the result");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.auraOne} /><div className={styles.auraTwo} />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="VastuCheck home"><span>ॐ</span><div><b>VASTUCHECK.IN</b><small>Traditional Vastu • Tech-enabled</small></div></Link>
        <span className={styles.accessPill}>{accessChecking ? "Checking access…" : unlocked ? "✓ Planner unlocked" : "🔒 ₹99 one-time access"}</span>
      </header>

      {!plannerOpen ? (
        <div className={styles.landing}>
          <section className={styles.heroCopy}>
            <span className={styles.eyebrow}><i /> New planning tool</span>
            <h1>Find your borewell location <em>as per Vastu.</em></h1>
            <p>Compare Vastu-preferred positions on your plot. Set North, move the marker and get a clear rule-based suitability score.</p>
            <div className={styles.featureRow}><span>✓ Live colour map</span><span>✓ Exact direction & angle</span><span>✓ Works on mobile</span></div>
            <button className={styles.primaryButton} onClick={openProduct}><span>{unlocked ? "Open my planner" : "Plan my borewell"}</span><b>{unlocked ? "Unlocked" : "₹99"}</b><Arrow /></button>
            <small className={styles.paymentNote}>🔒 One-time payment · No subscription</small>
          </section>

          <section className={styles.preview} aria-label="Borewell planner preview">
            <div className={styles.previewCard}>
              <div className={styles.previewTop}><span>Vastu suitability map</span><b>● LIVE</b></div>
              <div className={styles.previewMap}><span className={styles.previewNorth}>N ↑</span><i className={styles.previewCentre} /><i className={styles.previewLine} /><i className={styles.previewPin}>+</i><b className={styles.bestLabel}>BEST ZONE</b><b className={styles.avoidLabel}>AVOID</b></div>
              <div className={styles.previewResult}><strong>94<small>/100</small></strong><span><small>North-East · 45°</small><b>Excellent position</b></span><i>↑</i></div>
            </div>
          </section>

          <section className={styles.stepsStrip}>
            <div><b>01</b><span><strong>Add your plot</strong><small>Upload a plan or draw its outline</small></span></div>
            <i>→</i><div><b>02</b><span><strong>Set North</strong><small>Align the compass with your plot</small></span></div>
            <i>→</i><div><b>03</b><span><strong>Explore the map</strong><small>Drag to compare preferred points</small></span></div>
          </section>

          <aside className={styles.disclaimer}><b>ⓘ Important:</b> This planner recommends placement using traditional Vastu preferences. It does not detect groundwater or replace a hydrogeological survey, local permits, structural review or professional site advice.</aside>
        </div>
      ) : (
        <section className={styles.plannerShell}>
          <div className={styles.plannerHead}>
            <button aria-label="Go back" onClick={() => step > 1 ? setStep(step - 1) : setPlannerOpen(false)}>‹</button>
            <div><b>Borewell Vastu Planner</b><small>{["Set up your plot", "Align the compass", "Confirm the centre", "Explore the suitability map"][step - 1]}</small></div>
            <button aria-label="Restart planner" onClick={restart}>↻</button>
          </div>
          <div className={styles.progress}><i style={{ width: `${((step - 1) / 3) * 100}%` }} /><div>{["Plot", "North", "Centre", "Explore"].map((label, index) => <span className={index < step ? styles.active : ""} key={label}>{label}</span>)}</div></div>

          {step === 1 && <div className={styles.setup}>
            <div className={styles.stepHeading}><span>STEP 1 OF 3</span><h2>Add your plot</h2><p>Choose a shape, or upload your plan as a visual guide and adjust the corners.</p></div>
            <div className={styles.modeGrid}>
              <button className={mode === "draw" ? styles.selected : ""} onClick={() => changeMode("draw")}><i>✎</i><span><b>Draw plot</b><small>Start with a shape</small></span><em>✓</em></button>
              <button className={mode === "upload" ? styles.selected : ""} onClick={() => changeMode("upload")}><i>↑</i><span><b>Upload plan</b><small>JPG, PNG or WEBP</small></span><em>✓</em></button>
            </div>
            {mode === "upload" ? <label className={styles.uploadZone}><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadPlan(event.target.files?.[0])} /><i>{fileName ? "✓" : "↑"}</i><b>{fileName || "Choose your plot plan"}</b><small>{fileName ? "Tap to choose a different image" : "Your image stays in this browser"}</small></label> : <div className={styles.shapePicker}>{(["rectangle", "wide", "irregular"] as ShapeName[]).map((name) => <button key={name} className={shape === name ? styles.selected : ""} onClick={() => chooseShape(name)}><i data-shape={name} />{name[0].toUpperCase() + name.slice(1)}</button>)}</div>}
            <div className={styles.editorCard}><div><span><i /> Drag corner dots to match your plot</span><button onClick={() => chooseShape(mode === "upload" ? "rectangle" : shape)}>Reset</button></div><PlotEditor points={points} imageUrl={imageUrl} onPointsChange={setPoints} /></div>
            <button className={styles.fullButton} onClick={advance}>Set North <Arrow /></button>
          </div>}

          {step === 2 && <div className={styles.setup}>
            <div className={styles.stepHeading}><span>STEP 2 OF 3</span><h2>Which way is North?</h2><p>Rotate the compass so its arrow points to North on your plan.</p></div>
            <div className={styles.compassCard}>
              <div className={styles.compass}><span>N</span><span>E</span><span>S</span><span>W</span><div style={{ transform: `translate(-50%, -50%) rotate(${north}deg)` }}><b>N</b><i /></div><em /></div>
              <div className={styles.degree}><small>North angle</small><strong>{north}°</strong><span>{north < 12 || north >= 348 ? "Top of plan" : north < 102 ? "Right side of plan" : north < 192 ? "Bottom of plan" : north < 282 ? "Left side of plan" : "Upper-left of plan"}</span></div>
              <input className={styles.range} type="range" min="0" max="359" value={north} onChange={(event) => setNorth(Number(event.target.value))} aria-label="North angle in degrees" />
            </div>
            <div className={styles.tip}><b>Tip</b> If your plan has a compass symbol, point the red arrow in the same direction.</div>
            <button className={styles.fullButton} onClick={advance}>Confirm North <Arrow /></button>
          </div>}

          {step === 3 && <div className={styles.setup}>
            <div className={styles.stepHeading}><span>STEP 3 OF 3</span><h2>Confirm the plot centre</h2><p>We found the geometric centre. Adjust it only if your reference point is different.</p></div>
            <div className={styles.editorCard}><div><span><i className={styles.indigoDot} /> Drag the centre marker if needed</span><button onClick={() => setCenter(polygonCentroid(points))}>Auto-centre</button></div><CentreEditor points={points} imageUrl={imageUrl} center={center} onCenterChange={setCenter} /></div>
            <div className={styles.centreWhy}><b>⌖</b><span><strong>Why the centre matters</strong><small>Every direction and angle is measured from this point.</small></span></div>
            <button className={styles.fullButton} onClick={advance}>Show suitability map <Arrow /></button>
          </div>}

          {step === 4 && <div className={styles.explore}>
            <div className={styles.exploreHead}><div><span>LIVE VASTU MAP</span><h2>Move the borewell marker</h2><p>Drag or tap anywhere inside your plot to compare.</p></div><button onClick={() => setStep(1)}>✎ Edit setup</button></div>
            <div className={styles.exploreGrid}>
              <div className={styles.mapCard}>
                <div className={styles.mapToolbar}><span style={{ transform: `rotate(${north}deg)` }}>↑<b>N</b></span><small>● Drag marker to compare</small><button onClick={() => { setBorewell(bestPoint(center, points, north)); showToast("Moved to the strongest north-east zone"); }}>Best zone</button></div>
                <HeatMap points={points} imageUrl={imageUrl} center={center} borewell={borewell} north={north} onBorewellChange={setBorewell} />
                <div className={styles.legend}><span><i className={styles.excellent} />Best</span><span><i className={styles.good} />Good</span><span><i className={styles.fair} />Fair</span><span><i className={styles.avoid} />Avoid</span></div>
              </div>
              <aside className={styles.scoreCard}>
                <div className={styles.scoreTop}><div className={styles.scoreRing} style={{ background: `radial-gradient(closest-side, white 76%, transparent 78% 99%), conic-gradient(${result.meta.color} ${result.score}%, #e8e6dd 0)` }}><strong>{result.score}</strong><small>/100</small></div><div><span>VASTU SUITABILITY</span><h3>{result.meta.status}</h3><p>{result.meta.caption}</p></div></div>
                <div className={styles.metrics}><div><span>Direction</span><b>{result.direction.name}</b></div><div><span>Angle</span><b>{Math.round(result.angle)}°</b></div><div><span>Zone</span><b>{result.direction.code}</b></div><div><span>From centre</span><b>{Math.round(result.ratio * 100)}%</b></div></div>
                <div className={styles.guidance}><i>✦</i><span><b>{result.guidance.title}</b><small>{result.guidance.copy}</small></span></div>
                <button className={styles.darkButton} onClick={() => setResultOpen(true)}>Select this point <Arrow /></button>
              </aside>
            </div>
            <p className={styles.mapDisclaimer}>ⓘ Vastu guidance only — groundwater availability and drilling feasibility must be confirmed by qualified professionals.</p>
          </div>}
        </section>
      )}

      {paymentOpen && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setPaymentOpen(false); }}><section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="payment-title"><button className={styles.close} onClick={() => setPaymentOpen(false)} aria-label="Close payment">×</button><span className={styles.sheetIcon}>ॐ</span><small>ONE-TIME ACCESS</small><h2 id="payment-title">Unlock Borewell Planner</h2><p>Make a one-time ₹99 payment to plan your plot, compare unlimited positions and save a shareable borewell reference.</p><div className={styles.checkoutRow}><span><b>Borewell Vastu Planner</b><small>Full interactive access</small></span><strong>₹99</strong></div><div className={styles.razorpay}><a className={styles.razorpayLink} href={RAZORPAY_BUTTON_URL}><span>₹99</span><b>Continue with Razorpay</b><i>›</i></a></div><div className={styles.secure}>🔒 Secure checkout powered by Razorpay</div><div className={styles.paymentProcess}><b>How access works</b><ol><li>Pay ₹99 securely through Razorpay.</li><li>After successful payment, you return here automatically.</li><li>The planner unlocks in this browser.</li></ol></div></section></div>}

      {resultOpen && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setResultOpen(false); }}><section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="result-title"><button className={styles.close} onClick={() => setResultOpen(false)} aria-label="Close result">×</button><span className={styles.success}>✓</span><small>POINT SELECTED</small><h2 id="result-title">Your borewell reference</h2><p>Share this with your site team, then confirm feasibility with groundwater and construction professionals.</p><div className={styles.ticket}><div><b>VastuCheck</b><small>Borewell Planner</small></div><strong>{result.score}<small>/100 suitability</small></strong><dl><div><dt>Direction</dt><dd>{result.direction.name}</dd></div><div><dt>Angle</dt><dd>{Math.round(result.angle)}° from North</dd></div><div><dt>Position</dt><dd>{Math.round((borewell.x / SVG_SIZE) * 100)}% right · {Math.round((borewell.y / SVG_SIZE) * 100)}% down</dd></div><div><dt>Reference</dt><dd>Plot centre</dd></div></dl><p>Vastu-based placement reference — not a groundwater detection result.</p></div><button className={styles.fullButton} onClick={share}>Share result</button><button className={styles.quietButton} onClick={() => setResultOpen(false)}>Keep exploring</button></section></div>}

      {toast && <div className={styles.toast} role="status">✓ {toast}</div>}
    </main>
  );
}
