// src/app/api/payment/razorpay-order/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const KEY_ID = process.env.RAZORPAY_KEY_ID!;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: NextRequest) {
  try {
    if (!KEY_ID || !KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay keys not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const amount = body?.amount ?? 49900; // in paise => ₹499
    const currency = body?.currency ?? "INR";

    const basicAuth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

    const rpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `vastu_${Date.now()}`,
        payment_capture: 1, // auto-capture
      }),
    });

    if (!rpRes.ok) {
      const text = await rpRes.text();
      console.error("Razorpay order error:", text);
      return NextResponse.json(
        { error: "Failed to create Razorpay order" },
        { status: 500 }
      );
    }

    const data = await rpRes.json();

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: KEY_ID,
    });
  } catch (err) {
    console.error("razorpay-order error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}