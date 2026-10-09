import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// POST /api/stories/:id/approve - Approve character sheet and continue to drawing
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await dbService.getStory(id);

    if (!story) {
      return NextResponse.json({ success: false, error: "Story not found." }, { status: 404 });
    }

    if (story.characters) {
      story.characters = story.characters.map((c) => ({ ...c, isApproved: true }));
    }

    story.status = "drawing";
    story.progress = 70;
    await dbService.saveStory(story);

    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
