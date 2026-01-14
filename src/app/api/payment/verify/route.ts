// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import type { VastuSummary } from "@/lib/vastuRules";
import { buildVastuReportPdf } from "@/lib/reportPdf";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

type VerifyPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
  };
  summary: VastuSummary;
};

export async function POST(req: NextRequest) {
  try {
    if (!KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay secret not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as VerifyPayload;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      summary,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !summary
    ) {
      return NextResponse.json(
        { error: "Missing verification fields" },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch", {
        expected: expectedSignature,
        got: razorpay_signature,
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // ✅ Payment verified at this point

    // Generate PDF (you can attach this in an email)
    const pdfBytes = await buildVastuReportPdf(
      summary,
      customer?.name || undefined
    );

    // TODO: send `pdfBytes` via email to customer?.email using Nodemailer / Resend / etc.
    const transporter = nodemailer.createTransport({
        host: "...",
        port: 587,
        auth: { user: "...", pass: "..." },
      });
      
      await transporter.sendMail({
        from: '"Vastu Report" <no-reply@yourdomain.com>',
        to: customer?.email,
        subject: "Your Vastu Layout Report",
        text: "Please find your Vastu report attached.",
        attachments: [
          {
            filename: "vastu-report.pdf",
            content: Buffer.from(pdfBytes),
          },
        ],
      });

    // For now, just respond success + (optionally) base64 for debugging (NOT for prod)
    // We'll omit base64 to keep response small.
    return NextResponse.json({
      success: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error("verify payment error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}