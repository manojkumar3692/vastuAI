import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COOKIE_NAME = "vc_borewell_access";
const ACCESS_MAX_AGE = 60 * 60 * 24 * 365;
const PRODUCT_AMOUNT = 9900;
const PRODUCT_CURRENCY = "INR";

type AccessPayload = {
  product: "borewell-planner";
  paymentId: string;
  issuedAt: number;
};

type RazorpayPayment = {
  id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  captured?: boolean;
};

function signingSecret() {
  return process.env.RAZORPAY_KEY_SECRET || "";
}

function sign(value: string) {
  return crypto.createHmac("sha256", signingSecret()).update(value).digest("base64url");
}

function createAccessToken(paymentId: string) {
  const payload: AccessPayload = {
    product: "borewell-planner",
    paymentId,
    issuedAt: Date.now(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function isValidAccessToken(token?: string) {
  if (!token || !signingSecret()) return false;
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return false;

  const expectedSignature = sign(encoded);
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AccessPayload;
    return payload.product === "borewell-planner"
      && /^pay_[A-Za-z0-9]+$/.test(payload.paymentId)
      && Number.isFinite(payload.issuedAt);
  } catch {
    return false;
  }
}

function responseWithAccess(paymentId: string) {
  const response = NextResponse.json({ unlocked: true });
  response.cookies.set(COOKIE_NAME, createAccessToken(paymentId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  return response;
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    unlocked: isValidAccessToken(request.cookies.get(COOKIE_NAME)?.value),
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    paymentId?: string;
  };

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const paymentId = body.paymentId?.trim();

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment verification is not configured" }, { status: 503 });
  }
  if (!paymentId || !/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
    return NextResponse.json({ error: "A valid payment reference is required" }, { status: 400 });
  }

  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const razorpayResponse = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: { Authorization: `Basic ${authorization}` },
      cache: "no-store",
    }
  );

  if (!razorpayResponse.ok) {
    return NextResponse.json({ error: "We could not verify this payment" }, { status: 402 });
  }

  const payment = (await razorpayResponse.json()) as RazorpayPayment;
  const isCorrectPayment =
    payment.id === paymentId &&
    payment.amount === PRODUCT_AMOUNT &&
    payment.currency === PRODUCT_CURRENCY &&
    payment.status === "captured" &&
    payment.captured === true;

  if (!isCorrectPayment) {
    return NextResponse.json({ error: "Payment is not completed for this planner" }, { status: 402 });
  }

  return responseWithAccess(paymentId);
}
