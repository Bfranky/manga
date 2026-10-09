import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { exportMangaPDF } from "@/lib/pdf/exporter";

// POST /api/export
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storyId } = body;

    const story = await dbService.getStory(storyId);
    if (!story) {
      return NextResponse.json({ success: false, error: "Story not found." }, { status: 404 });
    }

    const pdfUrl = await exportMangaPDF(story);
    story.pdfUrl = pdfUrl;
    await dbService.saveStory(story);

    return NextResponse.json({
      success: true,
      pdfUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
