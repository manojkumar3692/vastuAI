// src/app/api/payment/phonepe-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPhonePePayPage } from "@/lib/phonepe";
import type { VastuSummary } from "@/lib/vastuRules";

export const runtime = "nodejs";

type PhonePeOrderPayload = {
  amount: number; // in paise
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  summary?: VastuSummary; // optional for now; later you can store in DB
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PhonePeOrderPayload;
    const { amount, customer, summary } = body || {};

    if (!amount || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: "Missing amount or customer details" },
        { status: 400 }
      );
    }

    // (Optional) TODO: save `summary` + customer to DB with merchantTransactionId for later manual matching.

    const order = await createPhonePePayPage({
      amountInPaise: amount,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
    });

    return NextResponse.json(
      {
        success: true,
        redirectUrl: order.redirectUrl,
        merchantTransactionId: order.merchantTransactionId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("phonepe-order error:", err);
    return NextResponse.json(
      { error: "Failed to initiate PhonePe payment" },
      { status: 500 }
    );
  }
}