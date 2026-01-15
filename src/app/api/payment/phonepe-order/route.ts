// src/app/api/payment/phonepe-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL!;
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tropicglow.in";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!PHONEPE_BASE_URL || !PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY) {
      console.error("[phonepe-order] Missing env", {
        PHONEPE_BASE_URL: !!PHONEPE_BASE_URL,
        PHONEPE_MERCHANT_ID: !!PHONEPE_MERCHANT_ID,
        PHONEPE_SALT_KEY: !!PHONEPE_SALT_KEY,
      });
      return NextResponse.json(
        { error: "PhonePe env not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { amount, customer } = body || {};

    if (!amount || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: "Invalid payload: amount / customer missing" },
        { status: 400 }
      );
    }

    // 👇 amount must be in paise. 499 rupees = 49900
    const amountInPaise = Number(amount); // assume you already send paise

    const merchantTransactionId = `TG${Date.now()}`;

    const payLoad = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      amount: amountInPaise,
      redirectUrl: `${SITE_URL}/payment/phonepe-return?tx=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${SITE_URL}/payment/phonepe-return?tx=${merchantTransactionId}`,
      mobileNumber: customer.phone || "",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payloadStr = JSON.stringify(payLoad);
    const base64Payload = Buffer.from(payloadStr).toString("base64");

    const apiPath = "/pg/v1/pay";
    const stringToSign = base64Payload + apiPath + PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(stringToSign).digest("hex");
    const checksum = `${sha256}###${PHONEPE_SALT_INDEX}`;

    const phonepeRes = await fetch(`${PHONEPE_BASE_URL}${apiPath}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    // Try to parse JSON; if fails, capture raw text
    const rawText = await phonepeRes.text();
    let phonepeJson: any = null;
    try {
      phonepeJson = rawText ? JSON.parse(rawText) : null;
    } catch {
      phonepeJson = { raw: rawText };
    }

    if (!phonepeRes.ok || phonepeJson?.success === false) {
      console.error("[phonepe-order] PhonePe error", {
        status: phonepeRes.status,
        body: phonepeJson,
      });

      // 🔴 IMPORTANT: send details back so you can see it in Postman
      return NextResponse.json(
        {
          error: "Failed to create payment",
          phonepeStatus: phonepeRes.status,
          phonepeBody: phonepeJson,
        },
        { status: 500 }
      );
    }

    const redirectUrl =
      phonepeJson?.data?.instrumentResponse?.redirectInfo?.url ||
      phonepeJson?.data?.redirectUrl;

    if (!redirectUrl) {
      console.error("[phonepe-order] No redirectUrl in response", phonepeJson);
      return NextResponse.json(
        { error: "Missing redirect URL from PhonePe", phonepeBody: phonepeJson },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        redirectUrl,
        merchantTransactionId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[phonepe-order] Handler error", err);
    return NextResponse.json(
      { error: "Failed to create payment (exception)" },
      { status: 500 }
    );
  }
}