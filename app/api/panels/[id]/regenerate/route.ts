import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { generatePanelImage } from "@/lib/ai/images";

// POST /api/panels/:id/regenerate - Redraw single panel
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: panelId } = await params;
    const stories = await dbService.getAllStories();

    for (const story of stories) {
      if (story.pages) {
        for (const page of story.pages) {
          const panel = page.panels.find((p) => p.id === panelId);
          if (panel) {
            const activeChars = (story.characters || []).filter((c) =>
              panel.characters.includes(c.name)
            );

            const newUrl = await generatePanelImage({
              scene: panel.scene,
              camera: panel.camera || "Medium shot",
              emotion: panel.emotion || "Intense",
              charactersPresent: activeChars.length > 0 ? activeChars : (story.characters || []),
              style: story.style,
              colorMode: story.colorMode,
              aspectRatio: panel.aspectRatio,
              panelNo: panel.panelNo,
            });

            panel.imageUrl = newUrl;
            panel.status = "completed";
            await dbService.saveStory(story);

            return NextResponse.json({ success: true, panel });
          }
        }
      }
    }

    return NextResponse.json({ success: false, error: "Panel not found." }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
