import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { generateMangaScript } from "@/lib/ai/script";
import { generateCharacterReferenceSheet, generatePanelImage } from "@/lib/ai/images";
import { calculateStoryCreditCost } from "@/lib/credits";
import { StoryData, CharacterData, PageData, PanelData } from "@/lib/types/manga";
import { selectLayoutTemplate } from "@/lib/layout/templates";

// GET /api/stories - List all stories
export async function GET(req: NextRequest) {
  try {
    const stories = await dbService.getAllStories();
    return NextResponse.json({ success: true, stories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/stories - Create and start generating manga
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title = "Untitled Manga",
      body: storyText,
      style = "shonen",
      colorMode = "bw",
      readingDirection = "rtl",
      targetPages = 2,
      userId = "user-demo",
      skipApproval = false,
    } = body;

    if (!storyText || typeof storyText !== "string" || storyText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Story text narrative is required." },
        { status: 400 }
      );
    }

    // Check & reserve credits
    const creditCost = calculateStoryCreditCost(targetPages);
    const profile = await dbService.getProfile(userId);

    if (profile.credits < creditCost) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. Required: ${creditCost}, available: ${profile.credits}.`,
        },
        { status: 402 }
      );
    }

    // Reserve credits
    await dbService.updateCredits(userId, -creditCost, `Reserved for story: ${title}`);

    const storyId = `story-${Date.now()}`;
    const initialStory: StoryData = {
      id: storyId,
      userId,
      title,
      body: storyText,
      style,
      colorMode,
      readingDirection,
      targetPages,
      status: "scripting",
      progress: 15,
      createdAt: new Date().toISOString(),
      characters: [],
      pages: [],
    };

    await dbService.saveStory(initialStory);

    // Asynchronous background generation simulation
    // In production this enqueues an Inngest or Trigger.dev durable job
    runMangaGenerationPipeline(storyId, {
      title,
      body: storyText,
      style,
      colorMode,
      readingDirection,
      targetPages,
      skipApproval,
      userId,
    }).catch(async (err) => {
      console.error("Pipeline failure:", err);
      const failed = await dbService.getStory(storyId);
      if (failed) {
        failed.status = "failed";
        failed.error = err.message || "Generation error";
        await dbService.saveStory(failed);
        // Refund credits on failure
        await dbService.updateCredits(userId, creditCost, `Refund: generation failure for ${title}`, storyId);
      }
    });

    return NextResponse.json({
      success: true,
      storyId,
      status: "scripting",
      progress: 15,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Executes the multi-stage generation pipeline
 */
async function runMangaGenerationPipeline(
  storyId: string,
  params: {
    title: string;
    body: string;
    style: any;
    colorMode: any;
    readingDirection: any;
    targetPages: number;
    skipApproval?: boolean;
    userId: string;
  }
) {
  const story = (await dbService.getStory(storyId))!;

  // 1. Scripting Stage (LLM)
  story.status = "scripting";
  story.progress = 20;
  await dbService.saveStory(story);

  const script = await generateMangaScript({
    title: params.title,
    storyBody: params.body,
    style: params.style,
    targetPages: params.targetPages,
  });

  story.logline = script.logline;

  // 2. Designing Characters Stage
  story.status = "designing_characters";
  story.progress = 40;
  await dbService.saveStory(story);

  const characterList: CharacterData[] = [];
  for (const charScript of script.characters) {
    const charId = `char-${Math.random().toString(36).substring(2, 9)}`;
    const tempChar: CharacterData = {
      id: charId,
      storyId,
      name: charScript.name,
      role: charScript.role,
      appearance: charScript.appearance,
      outfit: charScript.outfit,
      isApproved: true,
    };

    const refUrl = await generateCharacterReferenceSheet({
      character: tempChar,
      style: params.style,
      colorMode: params.colorMode,
    });

    tempChar.refImageUrl = refUrl;
    characterList.push(tempChar);
  }

  story.characters = characterList;
  story.progress = 60;
  await dbService.saveStory(story);

  // 3. Drawing Panels Stage
  story.status = "drawing";
  story.progress = 70;
  await dbService.saveStory(story);

  const pageList: PageData[] = [];

  for (const pageScript of script.pages) {
    const pageId = `page-${Math.random().toString(36).substring(2, 9)}`;
    const layout = pageScript.layout || selectLayoutTemplate(pageScript.panels.length);

    const panelList: PanelData[] = [];

    for (const p of pageScript.panels) {
      const panelId = `panel-${Math.random().toString(36).substring(2, 9)}`;
      const activeChars = characterList.filter((c) => p.characters.includes(c.name));

      const imageUrl = await generatePanelImage({
        scene: p.scene,
        camera: p.camera,
        emotion: p.emotion,
        charactersPresent: activeChars.length > 0 ? activeChars : [characterList[0]],
        style: params.style,
        colorMode: params.colorMode,
        aspectRatio: p.aspectRatio,
        panelNo: p.panelNo,
      });

      panelList.push({
        id: panelId,
        pageId,
        panelNo: p.panelNo,
        scene: p.scene,
        camera: p.camera,
        emotion: p.emotion,
        characters: p.characters,
        dialogue: p.dialogue as any,
        caption: p.caption,
        sfx: p.sfx,
        imagePrompt: p.scene,
        imageUrl,
        status: "completed",
        aspectRatio: p.aspectRatio,
      });
    }

    pageList.push({
      id: pageId,
      storyId,
      pageNo: pageScript.pageNo,
      layout,
      panels: panelList,
    });
  }

  story.pages = pageList;

  // 4. Lettering & SVG Assembly Stage
  story.status = "lettering";
  story.progress = 90;
  await dbService.saveStory(story);

  // Small async delay to simulate finishing lettering pass
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 5. Finalize Done Stage
  story.status = "done";
  story.progress = 100;
  await dbService.saveStory(story);
}
