import { StoryData } from "./types/manga";

export function generateMangaArtSVG(options: {
  title: string;
  scene: string;
  style: string;
  isBw: boolean;
  camera: string;
  emotion: string;
  charName?: string;
  panelNo?: number;
}): string {
  const { title, scene, style, isBw, camera, emotion, charName, panelNo } = options;
  
  const bgGradStart = isBw ? "#1a1a1a" : style === "cyberpunk" ? "#0f051d" : style === "shojo" ? "#2d122e" : "#0d1b2a";
  const bgGradEnd = isBw ? "#050505" : style === "cyberpunk" ? "#051622" : style === "shojo" ? "#14081c" : "#1b263b";
  const accentColor = isBw ? "#ffffff" : style === "cyberpunk" ? "#00f0ff" : style === "shojo" ? "#ff77e9" : "#ff9e00";
  const speedLineColor = isBw ? "rgba(255,255,255,0.12)" : "rgba(0, 240, 255, 0.2)";

  // Render stylized manga silhouette art SVG with speed lines, screentone dots, and dramatic composition
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradStart}" />
        <stop offset="100%" stop-color="${bgGradEnd}" />
      </linearGradient>
      <pattern id="screentone" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1.5" fill="${isBw ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}" />
      </pattern>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="800" height="600" fill="url(#bgGrad)" />
    <rect width="800" height="600" fill="url(#screentone)" />

    <!-- Action Speed Lines Radiating from focal center -->
    <g stroke="${speedLineColor}" stroke-width="1.5">
      <line x1="400" y1="300" x2="0" y2="0" />
      <line x1="400" y1="300" x2="200" y2="0" />
      <line x1="400" y1="300" x2="400" y2="0" />
      <line x1="400" y1="300" x2="600" y2="0" />
      <line x1="400" y1="300" x2="800" y2="0" />
      <line x1="400" y1="300" x2="800" y2="200" />
      <line x1="400" y1="300" x2="800" y2="400" />
      <line x1="400" y1="300" x2="800" y2="600" />
      <line x1="400" y1="300" x2="600" y2="600" />
      <line x1="400" y1="300" x2="400" y2="600" />
      <line x1="400" y1="300" x2="200" y2="600" />
      <line x1="400" y1="300" x2="0" y2="600" />
      <line x1="400" y1="300" x2="0" y2="400" />
      <line x1="400" y1="300" x2="0" y2="200" />
    </g>

    <!-- Dynamic Manga Silhouette & Aura -->
    <g transform="translate(400, 310)">
      <!-- Aura Glow -->
      <circle cx="0" cy="0" r="140" fill="${accentColor}" opacity="0.12" filter="url(#glow)" />
      
      <!-- Anime Character Silhouette / Keyframe -->
      <path d="M-40,80 Q-60,-20 -25,-60 Q-15,-90 0,-110 Q15,-90 25,-60 Q60,-20 40,80 Z" fill="${isBw ? '#000000' : '#080811'}" stroke="${accentColor}" stroke-width="2.5" />
      
      <!-- Spiky Anime Hair / Headdress -->
      <path d="M-35,-80 L-60,-120 L-25,-105 L-10,-145 L10,-105 L35,-135 L25,-85 Z" fill="${accentColor}" opacity="0.9" />

      <!-- Glowing Anime Eyes -->
      <ellipse cx="-14" cy="-55" rx="7" ry="3.5" fill="${accentColor}" transform="rotate(-10 -14 -55)" />
      <ellipse cx="14" cy="-55" rx="7" ry="3.5" fill="${accentColor}" transform="rotate(10 14 -55)" />

      <!-- Katana / Energy Blade slash -->
      <line x1="-160" y1="120" x2="180" y2="-130" stroke="${accentColor}" stroke-width="4" filter="url(#glow)" />
      <path d="M-120,90 Q0,-40 140,-100" fill="none" stroke="#ffffff" stroke-width="2" />
    </g>

    <!-- Panel HUD Overlay -->
    <rect x="20" y="20" width="760" height="560" fill="none" stroke="${isBw ? '#ffffff' : accentColor}" stroke-width="2" opacity="0.3" />
    
    <!-- Meta tag badge in panel corner -->
    <g transform="translate(35, 45)">
      <rect width="180" height="28" rx="6" fill="#000000" opacity="0.75" />
      <text x="10" y="19" fill="${accentColor}" font-family="monospace" font-size="12" font-weight="bold">
        ${camera.toUpperCase().slice(0, 22)}
      </text>
    </g>

    <!-- Scene hint at bottom of panel -->
    <g transform="translate(35, 545)">
      <rect width="730" height="32" rx="6" fill="#000000" opacity="0.8" />
      <text x="12" y="21" fill="#e2e8f0" font-family="sans-serif" font-size="12">
        ⚡ ${scene.slice(0, 95)}...
      </text>
    </g>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_STORIES: StoryData[] = [
  {
    id: "demo-story-01",
    userId: "user-demo",
    title: "Shadow Blade: The Crimson Rift",
    logline: "A lone swordsman defends the boundary between the realm of spirits and humanity when ancient seals fracture.",
    body: "Ren stood atop the ruined Torii gate as the crimson moon pierced through torrential rain. Below, shadowy specters poured out of the cracked obsidian seal. His cursed katana, Muramasa, thrummed with a deadly resonance. 'If the gods have forsaken this shrine,' Ren whispered, tightening his grip on the hilt, 'then my blade will carve our salvation.' With a blinding flash of silver ink, he descended into the horde.",
    style: "shonen",
    colorMode: "bw",
    readingDirection: "rtl",
    targetPages: 2,
    status: "done",
    progress: 100,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    characters: [
      {
        id: "char-01",
        storyId: "demo-story-01",
        name: "Ren Kurogane",
        role: "Protagonist / Wandering Swordsman",
        appearance: "Tall lean athletic build, spiky jet-black hair with silver front bangs, piercing crimson eyes, scar across right cheek.",
        outfit: "Tattered high-collared dark ronin haori with silver cloud embroidery, armored forearm bracers, bandages on left hand.",
        refImageUrl: generateMangaArtSVG({
          title: "Ren Kurogane - Model Sheet",
          scene: "Front facing full body concept sheet of swordsman Ren Kurogane",
          style: "shonen",
          isBw: true,
          camera: "Character Reference Model Sheet",
          emotion: "Determined & Stoic",
          charName: "Ren Kurogane"
        }),
        isApproved: true
      },
      {
        id: "char-02",
        storyId: "demo-story-01",
        name: "Yuki the Shrine Maiden",
        role: "Ally / Spiritual Guardian",
        appearance: "Petite, long sleek white hair tied in traditional red ribbon, golden hazel eyes, calm mystical aura.",
        outfit: "Traditional red and white shrine maiden miko robes with talisman talons and sacred bell staff.",
        refImageUrl: generateMangaArtSVG({
          title: "Yuki - Model Sheet",
          scene: "Full body concept sheet of shrine maiden Yuki holding sacred bell staff",
          style: "shonen",
          isBw: true,
          camera: "Character Reference Model Sheet",
          emotion: "Serene & Focused",
          charName: "Yuki"
        }),
        isApproved: true
      }
    ],
    pages: [
      {
        id: "page-01",
        storyId: "demo-story-01",
        pageNo: 1,
        layout: "L4B",
        panels: [
          {
            id: "p1-panel-1",
            pageId: "page-01",
            panelNo: 1,
            scene: "Wide cinematic view of the crumbling Torii gate against a colossal bleeding crimson moon in storm.",
            camera: "Wide establishing angle",
            emotion: "Ominous & Apocalyptic",
            characters: ["Ren Kurogane"],
            aspectRatio: "wide",
            dialogue: [],
            caption: "At the stroke of midnight, the eight-hundred-year seal finally shattered.",
            sfx: "RUMBLE",
            imagePrompt: "Torii gate on mountain cliff under blood moon with swirling shadows",
            imageUrl: generateMangaArtSVG({
              title: "The Crimson Moon Shatters",
              scene: "Wide angle showing the shattered ancient seal and dark portal opening under the moon",
              style: "shonen",
              isBw: true,
              camera: "Extreme Wide Establishing Shot",
              emotion: "Ominous Dread",
              panelNo: 1
            }),
            status: "completed"
          },
          {
            id: "p1-panel-2",
            pageId: "page-01",
            panelNo: 2,
            scene: "Close-up of Ren's hand grasping the tsuba of the cursed blade as silver lightning sparks.",
            camera: "Tight macro close-up",
            emotion: "Intense Focus",
            characters: ["Ren Kurogane"],
            aspectRatio: "tall",
            dialogue: [
              { speaker: "Ren Kurogane", text: "It begins.", type: "speech" }
            ],
            sfx: "CLINK",
            imagePrompt: "Hand drawing katana hilt with energy crackling",
            imageUrl: generateMangaArtSVG({
              title: "Blade Drawn",
              scene: "Close-up of katana hilt glowing with electrical ink sparks",
              style: "shonen",
              isBw: true,
              camera: "Macro Close-Up",
              emotion: "Focused Tension",
              panelNo: 2
            }),
            status: "completed"
          },
          {
            id: "p1-panel-3",
            pageId: "page-01",
            panelNo: 3,
            scene: "Yuki raising her sacred bell staff, summoning golden barrier seals against shadow beasts.",
            camera: "Medium dynamic low angle",
            emotion: "Chanting determination",
            characters: ["Yuki the Shrine Maiden"],
            aspectRatio: "tall",
            dialogue: [
              { speaker: "Yuki", text: "Ren, hold the line! The barrier will break!", type: "shout" }
            ],
            sfx: "SHIIING",
            imagePrompt: "Shrine maiden chanting mystical golden talisman ward",
            imageUrl: generateMangaArtSVG({
              title: "Yuki's Barrier",
              scene: "Shrine maiden raising barrier staff as magical talismans swirl",
              style: "shonen",
              isBw: true,
              camera: "Dynamic Low Angle",
              emotion: "Mystical Resolve",
              panelNo: 3
            }),
            status: "completed"
          },
          {
            id: "p1-panel-4",
            pageId: "page-01",
            panelNo: 4,
            scene: "Ren leaping off the shrine rooftop into the horde with a supersonic silver streak.",
            camera: "Dynamic foreshortened action angle",
            emotion: "Fierce combat focus",
            characters: ["Ren Kurogane"],
            aspectRatio: "tall",
            dialogue: [
              { speaker: "Ren Kurogane", text: "First Form: Crescent Shadow!", type: "shout" }
            ],
            sfx: "SLASH",
            imagePrompt: "Swordsman diving downward with crescent sword arc cutting shadowy monsters",
            imageUrl: generateMangaArtSVG({
              title: "Crescent Shadow Strike",
              scene: "Foreshortened aerial dive strike slicing through shadow specters",
              style: "shonen",
              isBw: true,
              camera: "Foreshortened Action Dive",
              emotion: "Combat Fury",
              panelNo: 4
            }),
            status: "completed"
          }
        ]
      },
      {
        id: "page-02",
        storyId: "demo-story-01",
        pageNo: 2,
        layout: "L3A",
        panels: [
          {
            id: "p2-panel-1",
            pageId: "page-02",
            panelNo: 1,
            scene: "The shadow monsters exploding into ink droplets as Ren lands with blade sheathed.",
            camera: "Wide ground level panoramic",
            emotion: "Cool aftermath silence",
            characters: ["Ren Kurogane"],
            aspectRatio: "wide",
            dialogue: [],
            sfx: "CLICK",
            imagePrompt: "Swordsman standing victorious as smoke clears",
            imageUrl: generateMangaArtSVG({
              title: "Aftermath",
              scene: "Swordsman standing amidst dissipated ink smoke with katana clicked into sheath",
              style: "shonen",
              isBw: true,
              camera: "Wide Ground Panoramic",
              emotion: "Cool Relief",
              panelNo: 1
            }),
            status: "completed"
          },
          {
            id: "p2-panel-2",
            pageId: "page-02",
            panelNo: 2,
            scene: "Yuki running forward, breath catching as she inspects the glowing rift in the earth.",
            camera: "Medium shot",
            emotion: "Grave concern",
            characters: ["Yuki the Shrine Maiden", "Ren Kurogane"],
            aspectRatio: "wide",
            dialogue: [
              { speaker: "Yuki", text: "This was only the vanguard. The Lord of Shadows is awakening.", type: "speech" }
            ],
            caption: "The peace they fought for was only the eye of the storm.",
            imagePrompt: "Shrine maiden and swordsman standing over glowing crack in earth",
            imageUrl: generateMangaArtSVG({
              title: "Grave Discovery",
              scene: "Two heroes looking down into ominous pulsing chasm",
              style: "shonen",
              isBw: true,
              camera: "Medium Two-Shot",
              emotion: "Grave Anticipation",
              panelNo: 2
            }),
            status: "completed"
          },
          {
            id: "p2-panel-3",
            pageId: "page-02",
            panelNo: 3,
            scene: "Ren looking up towards the mountain peak with an unyielding smirk.",
            camera: "Heroic close up",
            emotion: "Unyielding courage",
            characters: ["Ren Kurogane"],
            aspectRatio: "wide",
            dialogue: [
              { speaker: "Ren Kurogane", text: "Let him come. We won't back down.", type: "speech" }
            ],
            sfx: "THUMP",
            imagePrompt: "Protagonist close-up with heroic determined smile looking ahead",
            imageUrl: generateMangaArtSVG({
              title: "The Battle Ahead",
              scene: "Heroic close-up of Ren looking toward future battles with wind in hair",
              style: "shonen",
              isBw: true,
              camera: "Heroic Low Angle Close-up",
              emotion: "Heroic Defiance",
              panelNo: 3
            }),
            status: "completed"
          }
        ]
      }
    ]
  }
];

export const PRESET_STORY_TEMPLATES = [
  {
    title: "The Cyber Ronin Protocol",
    style: "cyberpunk" as const,
    colorMode: "color" as const,
    readingDirection: "rtl" as const,
    targetPages: 2,
    body: "In Neo-Shinjuku 2099, neon rain drenched the cybernetic alleyways. Cipher, an augmented mercenary with a neural monomolecular katana, received an encrypted distress pulse from Sector 7. The megacorp Zaibatsu AI core had gone rogue, dispatching chrome hunter-drones. With a digital overdrive surge in his ocular HUD, Cipher sliced through the mainframe barrier."
  },
  {
    title: "The Starlight Alchemist",
    style: "dark-fantasy" as const,
    colorMode: "bw" as const,
    readingDirection: "rtl" as const,
    targetPages: 2,
    body: "Deep within the Forbidden Celestial Archives, young alchemist Lyra discovered the forbidden Star-Glass Grimoire. When dark inquisitors breached the sanctuary gates, Lyra combined forbidden moon-dust and mercury to forge an ethereal star-golem to defend the ancient knowledge."
  },
  {
    title: "Chibi Academy Shenanigans",
    style: "chibi" as const,
    colorMode: "color" as const,
    readingDirection: "ltr" as const,
    targetPages: 2,
    body: "It was sports festival day at Ninja Academy! Koko overslept and rushed to school with toast in mouth, only to discover the supreme prize was the legendary Golden Dumpling. Her rival Taro challenged her to an epic obstacle course showdown involving banana peels and smoke bombs."
  }
];
