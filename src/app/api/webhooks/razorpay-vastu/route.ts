import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { normalizeIndianPhone } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type RazorpayPayment = {
  id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  contact?: string;
  email?: string;
  notes?: { phone?: string; mobile?: string };
};

type RazorpayEvent = {
  event?: string;
  payload?: { payment?: { entity?: RazorpayPayment } };
};

function validSignature(rawBody: string, received: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(received || "", "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_VASTU_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_VASTU_WEBHOOK_SECRET is missing");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  if (!validSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: RazorpayEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event?.event === "payment.failed") {
    return NextResponse.json({ received: true });
  }
  if (event?.event !== "payment.captured") {
    return NextResponse.json({ received: true, ignored: true });
  }

  const payment = event?.payload?.payment?.entity;
  const contactInput = payment?.contact || payment?.notes?.phone || payment?.notes?.mobile || "";
  const contact = normalizeIndianPhone(String(contactInput));
  if (!payment?.id || payment?.status !== "captured" || !contact) {
    console.error("Malformed captured payment payload", { paymentId: payment?.id, contact: contactInput });
    return NextResponse.json({ error: "Malformed payment" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin().rpc("activate_vastu_pro_purchase", {
    p_payment_id: payment.id,
    p_event_id: req.headers.get("x-razorpay-event-id") || "",
    p_amount: Number(payment.amount),
    p_currency: String(payment.currency || ""),
    p_contact: contact,
    p_email: String(payment.email || "").trim().toLowerCase(),
    p_payload: event,
  });
  if (error) {
    console.error("Could not process Vastu payment", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  console.info("Vastu payment processed", { paymentId: payment.id, result: data?.[0]?.result });
  return NextResponse.json({ received: true, result: data?.[0]?.result || "processed" });
}
