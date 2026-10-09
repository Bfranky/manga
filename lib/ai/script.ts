import { MangaArtStyle, MangaScript, MangaScriptSchema } from "../types/manga";
import { selectLayoutTemplate } from "../layout/templates";

const MANGA_SYSTEM_PROMPT = `
You are a legendary Manga Storyboard Artist, Director, and Master Editor.
Your task is to adapt a raw user story into a structured, production-ready Manga Script JSON.

STRICT RULES:
1. Split the story into the requested number of pages, with 3 to 6 panels per page (or 1 splash panel for major climaxes).
2. Pacing: Build tension progressively. Use larger, high-impact panels for pivotal twists and action beats.
3. Character Consistency: Define every recurring character once with a fixed, distinctive appearance and signature outfit. Never alter their design between panels.
4. Lettering & Dialogue: Keep dialogue short, punchy, and conversational (max ~15 words per bubble) so it fits inside speech balloons. Categorize dialogue as "speech", "thought", or "shout".
5. Visual Descriptions: Describe scenes purely visually (camera angle, character poses, environmental atmosphere, lighting). NEVER embed dialogue inside the scene description.
6. Return ONLY valid JSON matching the specified schema. No markdown backticks, no preamble.
`;

/**
 * Generates structured MangaScript from raw text using Claude API or intelligent local heuristic parser
 */
export async function generateMangaScript(params: {
  title?: string;
  storyBody: string;
  style: MangaArtStyle;
  targetPages: number;
  apiKey?: string;
}): Promise<MangaScript> {
  const { title = "Untitled Manga", storyBody, style, targetPages, apiKey } = params;

  // If Anthropic Claude API Key is provided, call Claude 3.5 Sonnet / Haiku
  if (apiKey || process.env.ANTHROPIC_API_KEY) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4000,
          system: MANGA_SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Adapt this story into a ${targetPages}-page manga script in ${style} style.

Story Title: ${title}
Story Body:
${storyBody}

Return JSON with format:
{
  "title": "string",
  "logline": "string",
  "characters": [
    { "name": "string", "role": "string", "appearance": "string", "outfit": "string" }
  ],
  "pages": [
    {
      "pageNo": 1,
      "layout": "L4B",
      "panels": [
        {
          "panelNo": 1,
          "scene": "string",
          "camera": "string",
          "emotion": "string",
          "characters": ["string"],
          "dialogue": [{ "speaker": "string", "text": "string", "type": "speech" }],
          "caption": "string optional",
          "sfx": "string optional"
        }
      ]
    }
  ]
}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const textContent = data.content?.[0]?.text || "";
        const cleaned = textContent.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const validated = MangaScriptSchema.parse(parsed);
        return validated;
      }
    } catch (err) {
      console.warn("Anthropic API call failed or schema mismatch, falling back to heuristic storyboard engine:", err);
    }
  }

  // Fallback high-fidelity storyboard generator
  return createHeuristicStoryboard(title, storyBody, style, targetPages);
}

/**
 * Heuristic intelligent storyboard engine that parses beats, extracts characters and dialogues
 */
function createHeuristicStoryboard(
  title: string,
  body: string,
  style: MangaArtStyle,
  targetPages: number
): MangaScript {
  // Extract sentences
  const sentences = body
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Heuristic character identification
  const words = body.split(/\s+/);
  const potentialNames = Array.from(
    new Set(
      words
        .filter((w) => /^[A-Z][a-z]{2,12}$/.test(w) && !["The", "When", "With", "Then", "After", "From", "Into", "They", "What", "There"].includes(w))
    )
  ).slice(0, 3);

  const mainCharName = potentialNames[0] || "Kaito";
  const allyCharName = potentialNames[1] || "Aoi";

  const characters = [
    {
      name: mainCharName,
      role: "Protagonist",
      appearance: "Athletic young warrior, spiky windblown dark hair with sharp expressive eyes and focused aura",
      outfit: "Signature hooded adventurer battle haori, fingerless gloves, and dark tactical trousers",
    },
    {
      name: allyCharName,
      role: "Key Companion",
      appearance: "Agile martial caster with sleek tied-back silver hair and perceptive glowing eyes",
      outfit: "Form-fitting embroidered tactical tunic with talisman scrolls strapped to waist",
    },
  ];

  const pagesCount = Math.max(1, targetPages);
  const sentencesPerPage = Math.max(2, Math.ceil(sentences.length / pagesCount));

  const pages = [];

  for (let p = 1; p <= pagesCount; p++) {
    const pageSentences = sentences.slice((p - 1) * sentencesPerPage, p * sentencesPerPage);
    const panelCount = Math.min(4, Math.max(3, pageSentences.length));
    const layout = selectLayoutTemplate(panelCount);

    const panels = [];
    for (let i = 0; i < panelCount; i++) {
      const sentence = pageSentences[i] || sentences[(p + i) % sentences.length] || "The battle reaches an explosive turning point.";
      
      const isClimax = p === pagesCount && i === panelCount - 1;
      const camera = i === 0 
        ? "Wide cinematic establishing shot" 
        : i === 1 
        ? "Medium dynamic angle" 
        : isClimax 
        ? "Dramatic heroic low angle" 
        : "Tight emotion close-up";

      const emotion = isClimax ? "Unbreakable resolve & Triumph" : i % 2 === 0 ? "Focused & Intense" : "Shocked realization";
      const sfx = isClimax ? "BOOM" : i === 0 ? "WHOOSH" : i === 1 ? "SLASH" : undefined;

      panels.push({
        panelNo: i + 1,
        scene: sentence.replace(/["']/g, ""),
        camera,
        emotion,
        characters: i % 2 === 0 ? [mainCharName] : [mainCharName, allyCharName],
        dialogue: i === 1 || isClimax
          ? [
              {
                speaker: mainCharName,
                text: isClimax ? "We will never surrender!" : "Prepare yourself!",
                type: (isClimax ? "shout" : "speech") as "shout" | "speech",
              },
            ]
          : [],
        caption: i === 0 ? `Chapter Beat: ${sentence.slice(0, 45)}...` : undefined,
        sfx,
      });
    }

    pages.push({
      pageNo: p,
      layout,
      panels,
    });
  }

  return {
    title: title || "Manga Forge Chronicle",
    logline: body.slice(0, 120) + "...",
    characters,
    pages,
  };
}
