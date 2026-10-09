import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET /api/stories/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await dbService.getStory(id);

    if (!story) {
      return NextResponse.json({ success: false, error: "Story not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/stories/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await dbService.deleteStory(id);

    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
