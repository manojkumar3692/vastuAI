// src/app/api/payment/phonepe-order/route.ts
import { NextRequest, NextResponse } from "next/server";

const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID!;
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;
const PHONEPE_CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";
const PHONEPE_ENV = process.env.PHONEPE_ENV || "sandbox"; // "sandbox" | "production"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tropicglow.in";

export const runtime = "nodejs";

// ───────────────────────── helpers: URLs ─────────────────────────

function getAuthUrl() {
  // From docs:
  // Sandbox:   https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token
  // Production:https://api.phonepe.com/apis/identity-manager/v1/oauth/token
  if (PHONEPE_ENV === "production") {
    return "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
  }
  return "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
}

function getCheckoutUrl() {
  // From docs:
  // Sandbox:   https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay
  // Production:https://api.phonepe.com/apis/pg/checkout/v2/pay
  if (PHONEPE_ENV === "production") {
    return "https://api.phonepe.com/apis/pg/checkout/v2/pay";
  }
  return "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";
}

// ─────────────────── helper: get merchant auth token ─────────────

async function getMerchantAuthToken() {
  if (!PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
    throw new Error("PhonePe OAuth env not configured");
  }

  const res = await fetch(getAuthUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_version: PHONEPE_CLIENT_VERSION,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  const json: any = await res.json().catch(() => null);

  // DOCS: field is "access_token"
  const token =
    json?.access_token ||
    json?.accessToken ||
    json?.encrypted_access_token ||
    null;

  if (!res.ok || !token) {
    console.error("[phonepe-order] auth error", res.status, json);
    throw new Error("PhonePe auth failed");
  }

  return token as string;
}

// ────────────────────────── main handler ─────────────────────────

export async function POST(req: NextRequest) {
  try {
    if (!PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "PhonePe env not configured" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { amount, customer } = body || {};

    if (!amount || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: "Invalid payload: amount / customer missing" },
        { status: 400 },
      );
    }

    // You’re already sending paise (e.g. 100 for ₹1, 49900 for ₹499)
    const amountInPaise = Number(amount);
    if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be >= 100 paise" },
        { status: 400 },
      );
    }

    const merchantOrderId = `TG${Date.now()}`;

    // 1) Get OAuth token (O-Bearer)
    const token = await getMerchantAuthToken();

    // 2) Create checkout session
    const checkoutPayload = {
      merchantOrderId,
      amount: amountInPaise,
      // Optional metadata – echoed back in status/callbacks
      metaInfo: {
        udf1: customer.name,
        udf2: customer.email,
        udf3: customer.phone || "",
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Vastu report payment",
        merchantUrls: {
          redirectUrl: `${SITE_URL}/payment/phonepe-return?tx=${merchantOrderId}`,
        },
        // paymentModeConfig: { ... } // optional if you want to control instruments
      },
      // disablePaymentRetry: true, // optional
    };

    const checkoutRes = await fetch(getCheckoutUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // IMPORTANT: token_type is "O-Bearer"
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    const rawText = await checkoutRes.text();
    let checkoutJson: any = null;
    try {
      checkoutJson = rawText ? JSON.parse(rawText) : null;
    } catch {
      checkoutJson = { raw: rawText };
    }

    if (!checkoutRes.ok || checkoutJson?.code || checkoutJson?.success === false) {
      console.error(
        "[phonepe-order] create payment error",
        checkoutRes.status,
        checkoutJson,
      );
      return NextResponse.json(
        {
          error: "Failed to create payment",
          phonepeStatus: checkoutRes.status,
          phonepeBody: checkoutJson,
        },
        { status: 500 },
      );
    }

    const redirectUrl = checkoutJson?.redirectUrl || checkoutJson?.data?.redirectUrl;
    if (!redirectUrl) {
      console.error("[phonepe-order] missing redirectUrl", checkoutJson);
      return NextResponse.json(
        {
          error: "Missing redirect URL from PhonePe",
          phonepeBody: checkoutJson,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        redirectUrl,
        merchantOrderId,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[phonepe-order] Handler error", err);
    return NextResponse.json(
      { error: "Failed to create payment (exception)" },
      { status: 500 },
    );
  }
}