import { CharacterData, ColorMode, MangaArtStyle } from "../types/manga";
import { buildCharacterSheetPrompt, buildPanelPrompt } from "./prompts";
import { generateMangaArtSVG } from "../sample-data";

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: "square" | "wide" | "tall" | "splash";
  refImageUrls?: string[];
  seed?: number;
  apiKey?: string;
  provider?: "fal" | "replicate" | "flux" | "simulation";
}

/**
 * Generates reference character sheet image
 */
export async function generateCharacterReferenceSheet(params: {
  character: CharacterData;
  style: MangaArtStyle;
  colorMode: ColorMode;
  apiKey?: string;
}): Promise<string> {
  const { character, style, colorMode, apiKey } = params;
  const prompt = buildCharacterSheetPrompt(character, style, colorMode);

  // If Fal.ai or Replicate API key provided
  if (apiKey || process.env.IMAGE_PROVIDER_API_KEY) {
    try {
      const url = await callExternalImageProvider({
        prompt,
        aspectRatio: "tall",
        apiKey: apiKey || process.env.IMAGE_PROVIDER_API_KEY,
      });
      if (url) return url;
    } catch (err) {
      console.warn("External image provider failed for character sheet, generating fallback SVG:", err);
    }
  }

  // High-fidelity fallback SVG model sheet
  return generateMangaArtSVG({
    title: `${character.name} - Official Character Sheet`,
    scene: `Full body front-view model sheet for ${character.name}. ${character.appearance}. Outfit: ${character.outfit}`,
    style,
    isBw: colorMode === "bw",
    camera: "Front Concept Model Sheet",
    emotion: "Neutral Focused",
    charName: character.name,
  });
}

/**
 * Generates an individual manga panel with locked conditioning and aspect ratio
 */
export async function generatePanelImage(params: {
  scene: string;
  camera: string;
  emotion: string;
  charactersPresent: CharacterData[];
  style: MangaArtStyle;
  colorMode: ColorMode;
  aspectRatio?: "square" | "wide" | "tall" | "splash";
  panelNo: number;
  apiKey?: string;
}): Promise<string> {
  const { scene, camera, emotion, charactersPresent, style, colorMode, aspectRatio = "square", panelNo, apiKey } = params;
  const prompt = buildPanelPrompt({
    scene,
    camera,
    emotion,
    charactersPresent,
    style,
    colorMode,
    aspectRatio,
  });

  const refImageUrls = charactersPresent
    .map((c) => c.refImageUrl)
    .filter((url): url is string => Boolean(url && !url.startsWith("data:image/svg+xml")));

  if (apiKey || process.env.IMAGE_PROVIDER_API_KEY) {
    try {
      const url = await callExternalImageProvider({
        prompt,
        aspectRatio,
        refImageUrls,
        apiKey: apiKey || process.env.IMAGE_PROVIDER_API_KEY,
      });
      if (url) return url;
    } catch (err) {
      console.warn(`External image provider failed for panel ${panelNo}, generating fallback SVG:`, err);
    }
  }

  return generateMangaArtSVG({
    title: `Panel #${panelNo}`,
    scene,
    style,
    isBw: colorMode === "bw",
    camera,
    emotion,
    charName: charactersPresent[0]?.name,
    panelNo,
    aspectRatio,
  });
}

/**
 * External provider connector (Fal.ai / Replicate Flux Kontext)
 */
async function callExternalImageProvider(options: ImageGenerationOptions): Promise<string | null> {
  const { prompt, aspectRatio = "square", refImageUrls = [], apiKey } = options;

  // Fal.ai Flux reference image call
  if (apiKey?.startsWith("fal_") || process.env.FAL_KEY) {
    const key = apiKey || process.env.FAL_KEY;
    const size = aspectRatio === "wide" ? "landscape_16_9" : aspectRatio === "tall" ? "portrait_16_9" : "square_hd";
    
    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: size,
        num_inference_steps: 4,
        enable_safety_checker: true,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.images?.[0]?.url || null;
    }
  }

  return null;
}
