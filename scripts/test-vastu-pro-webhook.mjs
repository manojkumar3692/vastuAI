import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

async function readLocalEnv() {
  try {
    const source = await readFile(new URL("../.env.local", import.meta.url), "utf8");
    return Object.fromEntries(
      source
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const separator = line.indexOf("=");
          const key = line.slice(0, separator).trim();
          const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
          return [key, value];
        }),
    );
  } catch {
    return {};
  }
}

function normalizePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

const localEnv = await readLocalEnv();
const phone = normalizePhone(process.argv[2]);
const email = String(process.argv[3] || "").trim().toLowerCase();
const secret = process.env.RAZORPAY_VASTU_WEBHOOK_SECRET || localEnv.RAZORPAY_VASTU_WEBHOOK_SECRET;
const baseUrl = process.env.VASTU_TEST_BASE_URL || "http://localhost:3000";

if (!phone || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error("Usage: npm run test:pro-payment -- 9876543210 account@example.com");
  process.exit(1);
}
if (!secret || secret === "your_new_secret" || secret.includes("REPLACE")) {
  console.error("Set a real RAZORPAY_VASTU_WEBHOOK_SECRET in .env.local first.");
  process.exit(1);
}

const now = Date.now();
const paymentId = `pay_vastu_local_${now}`;
const eventId = `evt_vastu_local_${now}`;
const payload = {
  entity: "event",
  account_id: "acc_local_test",
  event: "payment.captured",
  contains: ["payment"],
  payload: {
    payment: {
      entity: {
        id: paymentId,
        entity: "payment",
        amount: 79900,
        currency: "INR",
        status: "captured",
        captured: true,
        method: "upi",
        email,
        contact: phone,
        notes: { plan: "vastu_pro_10" },
        created_at: Math.floor(now / 1000),
      },
    },
  },
  created_at: Math.floor(now / 1000),
};

const rawBody = JSON.stringify(payload);
const signature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
const response = await fetch(`${baseUrl}/api/webhooks/razorpay-vastu`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-razorpay-signature": signature,
    "x-razorpay-event-id": eventId,
  },
  body: rawBody,
});
const result = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error(`Webhook simulation failed (${response.status}):`, result);
  process.exit(1);
}

const maskedPhone = `${phone.slice(0, 3)}******${phone.slice(-3)}`;
console.log(`Simulated captured payment ${paymentId} for ${maskedPhone}.`);
console.log(result);
