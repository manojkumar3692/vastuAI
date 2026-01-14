// src/lib/phonepe.ts
import crypto from "crypto";

const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL!;
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
const PHONEPE_MERCHANT_USER_ID = process.env.PHONEPE_MERCHANT_USER_ID || "VastuUser";
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";

// PhonePe requires: sha256(base64Payload + apiPath + saltKey) + "###" + saltIndex
function buildXVerify(base64Payload: string, apiPath: string) {
  const toSign = base64Payload + apiPath + PHONEPE_SALT_KEY;
  const sha = crypto.createHash("sha256").update(toSign).digest("hex");
  return `${sha}###${PHONEPE_SALT_INDEX}`;
}

export type PhonePeOrderResponse = {
  redirectUrl: string;
  merchantTransactionId: string;
};

export async function createPhonePePayPage(params: {
  amountInPaise: number; // 49900 = ₹499
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}) {
  const { amountInPaise, customerName, customerEmail, customerPhone } = params;

  const merchantTransactionId = `VASTU-${Date.now()}`;

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/phonepe-return`;
  const callbackUrl = redirectUrl; // (we won't use webhook, but PhonePe needs something)

  const apiPath = "/pg/v1/pay";

  const payload = {
    merchantId: PHONEPE_MERCHANT_ID,
    merchantTransactionId,
    merchantUserId: PHONEPE_MERCHANT_USER_ID,
    amount: amountInPaise,
    redirectUrl,
    callbackUrl,
    redirectMode: "POST",
    mobileNumber: customerPhone || undefined,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const xVerify = buildXVerify(payloadBase64, apiPath);

  const res = await fetch(`${PHONEPE_BASE_URL}${apiPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
    },
    body: JSON.stringify({ request: payloadBase64 }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("PhonePe pay error:", text);
    throw new Error("Failed to create PhonePe payment");
  }

  const data = await res.json();
  // PhonePe usually: data.data.instrumentResponse.redirectInfo.url
  const redirectUrlFromApi =
    data?.data?.instrumentResponse?.redirectInfo?.url ?? "";

  if (!redirectUrlFromApi) {
    console.error("PhonePe invalid response:", data);
    throw new Error("PhonePe did not return a redirect URL");
  }

  const out: PhonePeOrderResponse = {
    redirectUrl: redirectUrlFromApi,
    merchantTransactionId,
  };

  return out;
}