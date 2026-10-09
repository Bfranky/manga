import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET /api/credits
export async function GET(req: NextRequest) {
  try {
    const profile = await dbService.getProfile();
    const ledger = await dbService.getLedger();

    return NextResponse.json({
      success: true,
      credits: profile.credits,
      plan: profile.plan,
      ledger,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/credits - Top up credits
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount = 10, reason = "Top Up Credits", userId = "user-demo" } = body;

    const newCredits = await dbService.updateCredits(userId, Number(amount), reason);

    return NextResponse.json({
      success: true,
      credits: newCredits,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
