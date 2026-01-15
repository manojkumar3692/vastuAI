import { NextRequest, NextResponse } from "next/server";
import qs from "querystring";

const BASE_URL = process.env.PHONEPE_BASE_URL!;
const CLIENT_ID = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION!;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

// Step 1: Get OAuth token
async function getAccessToken() {
  const url = `${BASE_URL}/apis/identity-manager/v1/oauth/token`;
  const body = qs.stringify({
    client_id: CLIENT_ID,
    client_version: CLIENT_VERSION,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error("PhonePe token fetch failed");

  return res.json();
}

// POST /api/payment/phonepe-order
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();  // amount in paise (e.g. 49900)

    const tokenResponse = await getAccessToken();

    const paymentPayload = {
      merchantId: MERCHANT_ID,
      transactionId: "TXN-" + Date.now(),
      amount: amount,
      merchantUserId: "customer-" + Date.now(),
      redirectUrl: `${SITE_URL}/payment-success`,
      callbackUrl: `${SITE_URL}/payment-success`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const res = await fetch(
      `${BASE_URL}/apis/hermes/pg/v1/pay`,
      {
        method: "POST",
        headers: {
          Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      }
    );

    const json = await res.json();
    if (json.code !== "PAYMENT_INITIATED") {
      console.error("PhonePe error", json);
      return NextResponse.json({ error: "PhonePe payment failed", details: json }, { status: 400 });
    }

    return NextResponse.json({
      redirectUrl: json.data.redirectUrl,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}