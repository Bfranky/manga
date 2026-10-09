import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// PATCH /api/panels/:id - Update dialogue, caption, sfx
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: panelId } = await params;
    const body = await req.json();
    const { dialogue, caption, sfx } = body;

    const stories = await dbService.getAllStories();
    let updated = false;

    for (const story of stories) {
      if (story.pages) {
        for (const page of story.pages) {
          const panel = page.panels.find((p) => p.id === panelId);
          if (panel) {
            if (dialogue !== undefined) panel.dialogue = dialogue;
            if (caption !== undefined) panel.caption = caption;
            if (sfx !== undefined) panel.sfx = sfx;
            await dbService.saveStory(story);
            updated = true;
            return NextResponse.json({ success: true, panel });
          }
        }
      }
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Panel not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
