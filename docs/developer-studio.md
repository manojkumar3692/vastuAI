# Development Studio — AI_plot

Open `/developer-studio` or the home header’s Products menu. Free local workspace; existing Vastu, report and payment routes remain available.

## Rebuilt workflow

1. **Your site:** PDF and image rendering privately in browser memory, PDF page selection, total-area scaling (square feet/acres/square metres) and editable boundary mapping. KML / metre-coordinate JSON imports, rectangular dimensions and manual drawing. Reference bytes are not uploaded or persisted; reattach after reload.
2. **Development brief:** a three-section requirements screen for preferred plot sizes, minimum/maximum road widths, irregular-plot allowance and price discount, continuous park, clubhouse count/size, additional amenity and placement. Land purchase inputs support total/per-acre/per-square-foot prices, selling price and target margin. Advanced controls cover exclusions, EWS and development costs.
3. **Layout options:** five generated concepts on a zoomable/pannable SVG drawing. Numbered plots, road annotations, park, commercial/EWS/public use, dimensions layer, plot inspector, footprint locking, comparison and supported conversational edits with undo.
4. **Business case:** live revenue/cost/margin, sensitivity, reconciled site allocation, planning checks, infrastructure quantities, assumed earthwork, residual land budget and a target solver exploring up to 54 combinations.
5. **Team handoff:** immutable internally approved versions, department-specific JSON packs, layered metre-unit DXF, inventory and financial CSV, A3 browser print/save PDF. Inventory statuses and filters use the approved snapshot. Held/sold plots prevent replacing that version.

The five options are Balanced neighbourhood, Higher plot yield, Premium addresses, Lower road cost and Green neighbourhood. The sample parcel is independent demo geometry, not an extraction of any supplied approval drawing.

## Architecture

- `planning.ts`: typed schema-v2 project, polygon-clipping Boolean geometry, road/plot packing, finance, checks, prompt parser, target solver and backup validation. Coordinates are normalized to six decimals before Boolean operations; polyclip-ts retries numerical degeneracies with bounded 1e-8–1e-5 m tolerance. Failures are surfaced, not converted to guessed geometry.
- `regulations.ts`: versioned official Tamil Nadu baseline, road-length widths and net-of-road reservations.
- `AccessCanvas.tsx`: multiple entrances, inferred road frontage, optional surveyed external widths and north rotation.
- `DevelopmentBrief.tsx`: responsive developer requirements and cost basis conversion.
- `PlanCanvas.tsx`: technical SVG drawing, layer controls, selection, zoom/pan, corner dragging/insertion/deletion and area-based mapping.
- `survey.ts`: browser PDF.js/image rendering; no upload endpoint. `scripts/sync-studio-worker.mjs` synchronizes the matching worker before dev/build.
- `deliverables.ts`: CSV, DXF and browser downloads.
- `Studio.tsx`: workflow, local persistence, frozen revisions, inventory and exports.
- `studio.css`: isolated `.ws-*` styles, responsive layouts, reduced motion and A3 printing.
- Earlier `engine.ts`, `storage.ts` and `exports.ts` remain for compatibility/regression reference, including earlier provider/entitlement contracts. The new workspace uses its v2 modules and a separate storage key; old saved projects are not overwritten.

## Integration boundaries and limitations

This is a working local concept-planning tool, not approval-grade CAD or a guaranteed optimum.

- Valid simple irregular polygons are supported. Packing screens 16 spine/offset combinations, fully evaluates four distinct offsets per option and ranks valid outcomes by saleable area with a regular-shape preference. Each road-served block is divided using nearby plot counts and adjusted widths, then adjacent plots absorb usable residual strips. Optional slanted boundary plots retain actual polygon footprints. Minimum area, frontage and compactness filters reject small slivers. Actual polygons feed areas, pricing and exports. Continuous park, separate amenities, protected zones and unallocated residual polygons are accounted for independently. It does not design arbitrary curved roads, cul-de-sacs, exact weighted size mixtures, drainage engineering or legal access. Failed conflicts block internal approval; professional-review checks remain unresolved.
- PDF/image geometry uses local contour suggestions that require confirmation, with manual correction and scaling from declared total area. KML projection is approximate. Native DWG/DXF import is unsupported and reports this explicitly; DXF export is implemented.
- CMDA/DTCP use a sourced TNCDBR 2019 Rule 47 + G.O.16 (2020) baseline, linked in the interface. This is not a consolidated current code: later amendments, OSR dimensions, junction splays, street classifications and local conditions require consultant review. Main and secondary streets can differ within the brief range. Conservative span proxies govern main streets; secondary length can terminate at the wider spine only when it is actually wider, following the 2020 junction-length note. Engineered junction classifications, splays and turning heads still need review. Karnataka remains illustrative. Current GIS, amendment consolidation and authority certification require live integrations.
- Conversational editing is a deterministic local command parser. Live LLM/provider integration must run through a server-side service and validate every resulting geometry change. Unknown commands return help.
- Terrain is a slope/earthwork allowance, not DEM ingestion or an engineering cut/fill model. Financing, taxes, transaction charges and cash-flow timing are excluded from the current simplified pro forma.
- Project records are browser-local with JSON backup/restore; uploaded reference bytes are memory-only. Team collaboration, authentication, server storage and future paid entitlements remain integration work. All current controls remain free.
- Root analytics initialization is skipped on direct studio entry; the homepage Products entry performs full navigation. No supplied reference files are placed in public assets.

## Validation

`npm run test:plot-studio` runs the earlier 13 regression groups plus v2 coverage: 240 geometry configurations, containment/non-overlap/area conservation, locked footprints, exclusions, command units, solver reproducibility, frozen backup validation and CSV/DXF output. Use Node 22+ (validated with Node 24). Production build and focused lint pass. Browser checks include private PDF import, comparison, target search, conversational editing, approval/inventory and 390px mobile layout.

The workspace now starts empty. New project does not download a backup automatically. Enter total area, mark outside corners, drag to correct or use midpoint + controls to add vertices, then confirm. Uploaded references stay visible during mapping. Area-based scaling preserves shape proportions but does not correct image distortion or verify cadastral dimensions. Automatic local raster contour extraction suggests up to six closed outlines. Crop to parcel and retry on complex drawings. Candidates are unverified and require user review; blank/open/low-quality outlines may require manual mapping. No drawing is sent to an external AI service.

After boundary confirmation, users tap boundary positions to add multiple entrances. Road-facing edges are inferred; external road widths are optional and unknown widths remain review items. North defaults to unknown and can be rotated from survey evidence; the app does not infer compass direction from entrances. Generation connects entrances to the internal road network and reports disconnected routes. Existing road paths reserve conservative bounding corridors. Exact turning radii, diagonal road offsets and legal access require professional review. These inputs persist in backups and concept snapshots.

The current tests additionally cover multiple entrances, unknown/rotated north, road ranges, clubhouse count and area, separate amenities, irregular-plot pricing and caps, land price units, regulatory threshold calculations and actual polygon exports. Saved polygon validation checks footprint area and prevents malformed restored geometry.

Official baseline sources: [TNCDBR 2019](https://cmdachennai.gov.in/pdfs/TNCDBR-2019.pdf), [G.O.16 (2020) amendments](https://www.cmdachennai.gov.in/pdfs/TNCDBR-2019-Amendments.pdf). Review date: 30 September 2026. Review date is not a claim that every intervening amendment has been incorporated.

## Adaptive utilization update

Preferred dimensions are targets, not fixed inventory dimensions: actual plot widths/depths vary to fit blocks. New lots require at least 72 m² and 6 m of measured road frontage. Irregular lots also pass compactness and a 6 × 8 m rectangular-envelope test; these are concept quality filters, not certified setbacks/buildability. The user’s irregular-count limit and discount are preserved. Locked lots never grow. Large odd remnants are not labelled saleable simply to raise efficiency. Remaining land stays visible and is excluded from revenue.

Generated main and secondary road widths are shown separately. Equal minimum/maximum requests uniform roads. Existing road corridors remain separately reserved. Road cost uses actual union area; pipe/light quantities remain concept length estimates. The candidate search is bounded and does not claim a global optimum. Scenario switching reuses calculated geometry; changing the development brief regenerates it.

## Mixed rows

`Brief.mixedRows` defaults to true and migrates older saved briefs. The development brief can disable it. Each road-facing row repeats a preferred or common frontage; row ends take the remainder. A uniformly adjusted row is also evaluated when exact standard widths waste land. Opposing rows can use different standard depths, keeping a straight shared rear boundary. Regular interior plots are excluded from individual residual-growth edits; only row ends and existing irregular boundary lots can grow. The configured irregular-count cap still applies.

Plots carry row identifiers, nominal row width/depth and an end flag. The collapsible row schedule shows repeated dimensions and adjusted counts; inventory CSV includes the same row metadata. Frozen versions preserve it, and older snapshots without row metadata still load. Mixed sizes are planning targets, not a promise that every plot matches a catalogue size or that all parcels achieve 95% allocation.

Regression coverage checks row consistency on a rectangular site, mixed-size schedules on a synthetic sloping parcel, allocation with a 25% irregular limit, frozen metadata and legacy settings. No uploaded survey is included as a test asset.


### Direct allocation and road options
- Grey residual polygons are keyboard/click selectable. Assign the entire pocket to utility/transformer use or a checked residential/commercial plot. Service uses carry a provisional ₹10,000/m² facility allowance; equipment and clearances need design. Roads, OSR and protected land cannot be relabelled this way.
- Manual assignments are per concept, include polygon holes, update quantities/pro-forma, persist in backup/frozen handoff, and can be removed. A geometry signature invalidates assignments when the generated base changes; inactive assignments are excluded from all totals.
- Sale conversions require ≥72 m², ≤2,400 sq ft, continuous 6 m road frontage, usable envelope/shape and the irregular cap. Larger pockets need subdivision (not yet a direct editing operation).
- Entrance `width` remains external road width for backup compatibility; `entranceWidth` separately represents the opening and sizes the approach corridor. Angled approach/gate geometry and splays require professional review.
- Standard presets cover 600, 800, 1,000, 1,200, 1,500, 1,800 and 2,400 sq ft. Mixed rows test additional standard widths/depths. Sub-72 m² generated sites are tagged EWS, only with affordable mode enabled; approval is not asserted.
- Straight, roundabout and comparison modes are available. Roundabouts are actual polygonal road rings with separately accounted traffic islands, not OSR. Auto compares four straight candidates with one roundabout candidate; this is a bounded heuristic, not a global network optimizer. Junction swept paths, drainage and authority-specific geometries remain engineering work.


### Input responsiveness
Geometry generation and reverse solving run in a module Web Worker, never in React render. Geometry changes are coalesced for 300 ms; superseded workers are terminated and obsolete results ignored. Identity, financial and target changes do not invalidate geometry; a cheap arithmetic projection recalculates all five pro-formas. Draft geometry remains visibly pending and cannot be approved or assigned until current results arrive. Numeric brief/finance/entrance-opening fields preserve incomplete typed text and commit on blur or Enter, with Escape restoring the prior value. Generated layouts remain heuristic and may still take seconds; typing and navigation remain available during that computation.


### Entrance reachability
The planner extracts complete-width street strips from actual clipped road polygons, builds width-compatible junctions and traverses them from mapped entrances. Point contacts and narrow overlaps are not routes. Before reserving parks/facilities, a bounded repair search adds short orthogonal full-width links inside the parcel, avoiding locks/exclusions. Plots require 6 m frontage on a reachable street; newly generated unreachable cells stay unallocated. Existing locked plots fail review if disconnected. Facilities require 3 m reachable-road contact. Manual sale assignments use the same reachable surface. The access overlay exposes verified streets and uncertified road surfaces. This is a conservative geometric access check, not swept-path, emergency vehicle, evacuation-time or statutory road certification.


## Selected mix and auditable optimization

The shared plot selector supports standard/custom dimensions, per-size minimum counts and optional count-share targets (sum <= 100%). Additional dimensions, including irregular edge plots, require the separate extra-sizes permission. Strict mode excludes newly generated off-size plots; locks and manual assignments remain explicit exceptions in the report. Sizes use frontage/depth, not area alone. Regular selected dimensions receive packing preference. End reclamation preserves minimum selected-size counts; the mix objective also protects matching plot dimensions. Minimum-count shortfalls are shown as failed developer requirements.

The four objectives rank bounded candidate searches after design failures and minimum-count shortfalls: saleable area, mix share deviation, infrastructure cost or estimated profit. Automatic park mode compares physical free blocks and slice orientations across two promising street arrangements and repacks facilities/plots for each. The output reports its actual search count, actual mix and remaining failures. This is a heuristic search, not a globally optimal or approval-ready subdivision. Counts and percentage preferences may remain unmet.

Road widths use measured full-width clipped runs instead of parcel bounding dimensions. The search also compares wider main streets that can unlock narrower branches. Secondary runs split only at a wider main street; same-width intersections do not shorten the baseline length. Extendable-road classification is explicit. Per-run schedules include requested, applied and baseline widths. Some connectors can still fail the width check: these are exposed, not certified. Junction splays, turning, continuous street classification and later rule amendments require consultant verification.

Cost/profit objectives invalidate the background search when financial inputs affect ranking. Area/mix objectives retain cheap repricing. The worker remains cancelable and numeric fields commit on blur/Enter. Blank projects default to automatic park placement; saved explicit park preferences are preserved.

Validation: `scripts/test-studio-optimization.mjs` exercises selected sizes, strict mode, minimum counts, automatic candidate search, short-street widths, objective ranking and backup validation. Financial/cache tests cover cost-objective invalidation.
