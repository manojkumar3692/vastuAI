import { NextResponse } from "next/server";
import { clearProSession } from "@/lib/proAuth";

export async function POST() {
  await clearProSession();
  return NextResponse.json({ success: true });
}

