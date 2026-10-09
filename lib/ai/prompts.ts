import { CharacterData, ColorMode, MangaArtStyle } from "../types/manga";

export const STYLE_PROMPTS: Record<MangaArtStyle, { name: string; bwPrefix: string; colorPrefix: string; description: string }> = {
  shonen: {
    name: "Shonen Action",
    bwPrefix: "Masterpiece Japanese shonen action manga panel, clean crisp ink linework, fine screentone dots, speed lines, intense perspective, high contrast black and white, dynamic composition, cel shaded inking, strictly no speech bubbles, no text, no captions, no watermark",
    colorPrefix: "Masterpiece modern shonen anime comic panel, vibrant high-energy cinematic color, intense rim lighting, dynamic action keyframe, crisp digital ink, atmospheric effects, strictly no speech bubbles, no text, no watermark",
    description: "High-energy ink strokes, dramatic speed lines, and cinematic combat angles typical of legendary action manga."
  },
  seinen: {
    name: "Seinen Dark / Detailed",
    bwPrefix: "Ultra-detailed gritty seinen manga art, intricate cross-hatching, realistic anatomical proportions, deep dramatic shadows, rich screentone textures, cinematic noir composition, Kentaro Miura / Takehiko Inoue aesthetic, no text, no speech bubbles, no watermark",
    colorPrefix: "Cinematic dark seinen graphic novel panel, muted atmospheric tones, painterly textures, intense psychological mood, photorealistic lighting cues, no text, no speech bubbles, no watermark",
    description: "Meticulous cross-hatching, nuanced facial expressions, and atmospheric tone for mature storytelling."
  },
  shojo: {
    name: "Shojo Romance & Elegance",
    bwPrefix: "Delicate shojo manga panel, ethereal soft ink lines, sparkling screentones, floral atmospheric effects, expressive emotive eyes, elegant aesthetic, emotional close-up, no text, no speech bubbles, no watermark",
    colorPrefix: "Pastel watercolor shojo anime illustration, glowing ambient lighting, dreamy soft gradient palette, romantic aesthetic, high key illumination, no text, no speech bubbles, no watermark",
    description: "Flowing hair, glowing screentones, and intense emotional nuance perfect for drama and romance."
  },
  chibi: {
    name: "Chibi & Comedy (4-Koma)",
    bwPrefix: "Cute comedic chibi manga panel, bold clean outlines, simplified cute 2-head-tall proportions, exaggerated comedic expressions, fun screentone patterns, no text, no speech bubbles, no watermark",
    colorPrefix: "Vibrant cute chibi anime comic illustration, playful pastel colors, bold cheerful strokes, humorous facial expressions, pop aesthetic, no text, no speech bubbles, no watermark",
    description: "Super-deformed miniature characters with exaggerated comedic expressions."
  },
  cyberpunk: {
    name: "Cyberpunk Mecha",
    bwPrefix: "Technical cyberpunk sci-fi manga panel, intricate mechanical details, holographic screentones, neon rim lighting translated to ink, gritty high-tech urban backdrop, Tsutomu Nihei / Katsuhiro Otomo vibe, no text, no speech bubbles, no watermark",
    colorPrefix: "Neo-Tokyo cyberpunk anime keyframe, saturated magenta and cyan neon luminescence, volumetric rain and fog, reflections on chrome, futuristic aesthetic, no text, no speech bubbles, no watermark",
    description: "Dense mechanical greebles, futuristic architecture, and high-tech weaponry."
  },
  "dark-fantasy": {
    name: "Dark Fantasy Epic",
    bwPrefix: "Gothic dark fantasy manga panel, heavy black inking, ominous screentones, ornate armor and cloth textures, eldritch atmosphere, dramatic chiaroscuro lighting, no text, no speech bubbles, no watermark",
    colorPrefix: "Epic dark fantasy illustration, blood-red and golden mystical lighting, grim atmosphere, detailed fantasy weaponry and beast textures, no text, no speech bubbles, no watermark",
    description: "Grim castles, ominous aura, intricate armor engravings, and mythical atmosphere."
  },
  "retro-90s": {
    name: "Classic 90s Vintage",
    bwPrefix: "Vintage 1990s retro anime manga panel, classic cel-ink linework, nostalgic halftone patterns, Rumiko Takahashi / Akira Toriyama 90s aesthetic, hand-drawn ink quality, no text, no speech bubbles",
    colorPrefix: "Retro 90s cel-animated OVA still, vintage color palette, grain filter, nostalgic anime lighting, hand-painted aesthetic, no text, no speech bubbles",
    description: "Nostalgic 90s hand-inked aesthetic with retro character geometry."
  },
  webtoon: {
    name: "Modern Webtoon",
    bwPrefix: "Sleek contemporary Korean manhwa panel, ultra-clean digital ink, soft digital screentones, fashionable character design, sharp focus, no text, no speech bubbles",
    colorPrefix: "High-end Korean webtoon manhwa illustration, glossy digital coloring, glowing magical highlights, smooth gradient lighting, polished studio quality, no text, no speech bubbles",
    description: "Crisp digital line art and glossy highlights signature of modern top-tier manhwa."
  }
};

export const NEGATIVE_PROMPT = 
  "speech bubbles, text, dialog, word balloons, letters, signature, watermark, subtitles, low quality, blurry, deformed limbs, extra fingers, garbled face, bad anatomy, modern photograph, 3d render";

/**
 * Builds the conditioned character sheet prompt for consistent reference generation
 */
export function buildCharacterSheetPrompt(
  character: Pick<CharacterData, "name" | "role" | "appearance" | "outfit">,
  style: MangaArtStyle,
  colorMode: ColorMode
): string {
  const styleConfig = STYLE_PROMPTS[style] || STYLE_PROMPTS.shonen;
  const prefix = colorMode === "bw" ? styleConfig.bwPrefix : styleConfig.colorPrefix;

  return `${prefix}. Character model sheet / turn-around reference for [${character.name}], role: ${character.role}. 
Standing in neutral full-body pose, front view, plain solid studio background with no clutter.
Physical Appearance: ${character.appearance}.
Signature Outfit: ${character.outfit}.
Ultra-consistent character design, clean visible facial features, crisp details, highly reproducible concept art, no text, no speech bubbles.`;
}

/**
 * Builds the locked panel prompt combining style, camera, scene, and character consistency descriptions
 */
export function buildPanelPrompt(params: {
  scene: string;
  camera: string;
  emotion: string;
  charactersPresent: CharacterData[];
  style: MangaArtStyle;
  colorMode: ColorMode;
  aspectRatio?: string;
}): string {
  const { scene, camera, emotion, charactersPresent, style, colorMode } = params;
  const styleConfig = STYLE_PROMPTS[style] || STYLE_PROMPTS.shonen;
  const prefix = colorMode === "bw" ? styleConfig.bwPrefix : styleConfig.colorPrefix;

  let characterConstraints = "";
  if (charactersPresent.length > 0) {
    characterConstraints = charactersPresent
      .map(
        (char) =>
          `Character [${char.name}]: (${char.appearance}), wearing signature outfit: (${char.outfit})`
      )
      .join("; ");
  }

  return `${prefix}. Shot: ${camera}. Scene & Action: ${scene}.
Mood & Facial Emotion: ${emotion}.
${characterConstraints ? `Characters in frame with locked designs: ${characterConstraints}.` : ""}
Rendered as an immersive manga panel with dynamic storytelling perspective. Absolutely no text, no subtitles, no speech balloons, no dialogue in image.`;
}
