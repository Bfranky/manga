import { StoryData } from "./types/manga";

export interface SvgArtOptions {
  title: string;
  scene: string;
  style: string;
  isBw: boolean;
  camera: string;
  emotion: string;
  charName?: string;
  panelNo?: number;
  aspectRatio?: "square" | "wide" | "tall" | "splash";
}

/**
 * Generates rich 2D anime/manga scene illustrations with atmospheric background staging
 * (night cityscapes, glowing neon, wet street reflections, traditional shrines, 2D anime figures)
 */
export function generateMangaArtSVG(options: SvgArtOptions): string {
  const {
    title,
    scene = "",
    style = "shonen",
    isBw = false,
    camera = "Medium Shot",
    emotion = "Focused",
    charName = "Ren",
    panelNo = 1,
    aspectRatio = "square",
  } = options;

  const textLower = (scene + " " + title + " " + camera + " " + style).toLowerCase();
  
  // Dimensions based on aspect ratio
  const width = aspectRatio === "wide" ? 900 : aspectRatio === "tall" ? 600 : 800;
  const height = aspectRatio === "wide" ? 500 : aspectRatio === "tall" ? 850 : 600;

  // Scene type detection
  const isCityNight =
    textLower.includes("city") ||
    textLower.includes("night") ||
    textLower.includes("cyber") ||
    textLower.includes("neon") ||
    textLower.includes("street") ||
    textLower.includes("shinjuku") ||
    textLower.includes("alley") ||
    style === "cyberpunk";

  const isShrineOrFantasy =
    textLower.includes("shrine") ||
    textLower.includes("torii") ||
    textLower.includes("moon") ||
    textLower.includes("mountain") ||
    textLower.includes("temple") ||
    textLower.includes("blade") ||
    textLower.includes("seal") ||
    textLower.includes("chasm") ||
    textLower.includes("rift") ||
    textLower.includes("yuki") ||
    style === "shonen" ||
    style === "dark-fantasy";

  const isModelSheet =
    textLower.includes("model sheet") ||
    textLower.includes("concept") ||
    textLower.includes("character reference");

  const isCloseUp =
    textLower.includes("close-up") ||
    textLower.includes("close up") ||
    textLower.includes("macro") ||
    camera.toLowerCase().includes("close");

  const isWide =
    aspectRatio === "wide" ||
    textLower.includes("wide") ||
    textLower.includes("establishing") ||
    textLower.includes("panoramic");

  // Palette settings
  const skyTop = isBw ? "#050508" : isCityNight ? "#060918" : "#0a0814";
  const skyBottom = isBw ? "#1c1c24" : isCityNight ? "#141432" : "#241228";
  const neonCyan = isBw ? "#ffffff" : "#00f0ff";
  const neonPink = isBw ? "#e4e4e7" : "#ff2a85";
  const neonGold = isBw ? "#ffffff" : "#ffd166";
  const windowLit = isBw ? "rgba(255,255,255,0.75)" : "rgba(255,230,120,0.85)";
  const windowCyan = isBw ? "rgba(255,255,255,0.6)" : "rgba(0,240,255,0.75)";
  const inkBlack = "#09090b";
  const skinTone = isBw ? "#e4e4e7" : isCityNight ? "#ffd8c4" : "#ffe4d6";
  const hairColor = isBw ? "#18181b" : charName?.toLowerCase().includes("yuki") ? "#f4f4f5" : "#1e1b4b";
  const coatColor = isBw ? "#121214" : isCityNight ? "#0f172a" : "#1a1625";

  // Unique IDs for SVG gradients
  const gradId = `bg_${Math.random().toString(36).substring(2, 8)}`;
  const screentoneId = `st_${Math.random().toString(36).substring(2, 8)}`;

  // SVG Header & Defs
  let svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background-color: ${inkBlack};">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${skyTop}" />
        <stop offset="60%" stop-color="${skyBottom}" />
        <stop offset="100%" stop-color="${isBw ? '#0a0a0c' : '#030712'}" />
      </linearGradient>
      
      <linearGradient id="roadReflect" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${isBw ? '#1f1f23' : '#0a0f1d'}" />
        <stop offset="100%" stop-color="${isBw ? '#09090b' : '#020617'}" />
      </linearGradient>

      <pattern id="${screentoneId}" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="${isBw ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}" />
      </pattern>

      <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Sky Canvas -->
    <rect width="${width}" height="${height}" fill="url(#${gradId})" />
    <rect width="${width}" height="${height}" fill="url(#${screentoneId})" />
  `;

  // Model sheet rendering
  if (isModelSheet) {
    svg += `
      <!-- Technical Grid & Scale -->
      <g stroke="${isBw ? 'rgba(255,255,255,0.1)' : 'rgba(0,240,255,0.12)'}" stroke-width="1">
        ${Array.from({ length: 9 })
          .map((_, i) => `<line x1="40" y1="${i * 70 + 60}" x2="${width - 40}" y2="${i * 70 + 60}" stroke-dasharray="4 4" />`)
          .join("")}
        ${Array.from({ length: 7 })
          .map((_, i) => `<line x1="${i * 90 + 60}" y1="40" x2="${i * 90 + 60}" y2="${height - 40}" stroke-dasharray="4 4" />`)
          .join("")}
      </g>

      <!-- Front View 2D Character Model -->
      <g transform="translate(${width * 0.35}, ${height * 0.52})">
        <!-- Shadow base -->
        <ellipse cx="0" cy="220" rx="90" ry="16" fill="rgba(0,0,0,0.6)" />

        <!-- Legs & Boots -->
        <rect x="-32" y="110" width="22" height="95" rx="6" fill="${coatColor}" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="2" />
        <rect x="10" y="110" width="22" height="95" rx="6" fill="${coatColor}" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="2" />
        <path d="M-36,190 L-10,190 L-8,215 L-40,215 Z" fill="#000" stroke="${isBw ? '#fff' : neonGold}" stroke-width="1.5" />
        <path d="M8,190 L34,190 L38,215 L6,215 Z" fill="#000" stroke="${isBw ? '#fff' : neonGold}" stroke-width="1.5" />

        <!-- Torso & Kimono / Tactical Jacket -->
        <path d="M-45,-40 L45,-40 L38,120 L-38,120 Z" fill="${coatColor}" stroke="${isBw ? '#fff' : '#fff'}" stroke-width="2.5" />
        <path d="M-40,10 L40,10 L30,40 L-30,40 Z" fill="${isBw ? '#3f3f46' : '#be123c'}" stroke="${isBw ? '#fff' : neonGold}" stroke-width="1.5" />
        <!-- Belt buckle / Obi -->
        <rect x="-12" y="15" width="24" height="20" rx="4" fill="${isBw ? '#fff' : neonGold}" />

        <!-- Arms & Bracers -->
        <path d="M-45,-30 L-75,50 L-55,55 L-35,-15 Z" fill="${coatColor}" stroke="${isBw ? '#fff' : '#fff'}" stroke-width="2" />
        <path d="M45,-30 L75,50 L55,55 L35,-15 Z" fill="${coatColor}" stroke="${isBw ? '#fff' : '#fff'}" stroke-width="2" />
        <rect x="-78" y="25" width="22" height="30" rx="4" fill="#000" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="1.5" />
        <rect x="56" y="25" width="22" height="30" rx="4" fill="#000" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="1.5" />

        <!-- Katana Sheath -->
        <path d="M-30,25 L-70,160" stroke="${isBw ? '#fff' : neonGold}" stroke-width="6" stroke-linecap="round" />
        <line x1="-30" y1="25" x2="-20" y2="-10" stroke="${isBw ? '#fff' : neonPink}" stroke-width="8" stroke-linecap="round" />

        <!-- Head, Neck & Face -->
        <rect x="-14" y="-70" width="28" height="32" rx="4" fill="${skinTone}" stroke="#000" stroke-width="1" />
        <path d="M-30,-75 Q0,-50 30,-75 L28,-115 Q0,-125 -28,-115 Z" fill="${skinTone}" stroke="#000" stroke-width="2" />
        
        <!-- Expressive Manga Eyes -->
        <ellipse cx="-12" cy="-85" rx="6" ry="4" fill="#000" />
        <circle cx="-13" cy="-86" r="2" fill="#fff" />
        <ellipse cx="12" cy="-85" rx="6" ry="4" fill="#000" />
        <circle cx="11" cy="-86" r="2" fill="#fff" />
        <path d="M-18,-92 L-6,-90" stroke="#000" stroke-width="2" stroke-linecap="round" />
        <path d="M6,-90 L18,-92" stroke="#000" stroke-width="2" stroke-linecap="round" />
        <line x1="-2" y1="-76" x2="2" y2="-76" stroke="#000" stroke-width="2" />

        <!-- 2D Stylized Manga Hair Strands -->
        <path d="M-36,-110 L-50,-135 L-25,-120 L-15,-155 L0,-125 L15,-155 L25,-120 L50,-135 L36,-110 L28,-80 L35,-65 L22,-75 L0,-70 L-22,-75 L-35,-65 L-28,-80 Z" fill="${hairColor}" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="2.5" />
      </g>

      <!-- Spec Header Box -->
      <g transform="translate(40, 40)">
        <rect width="${width - 80}" height="42" rx="8" fill="#000" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="1.5" />
        <text x="16" y="27" fill="${isBw ? '#fff' : neonCyan}" font-family="sans-serif" font-size="14" font-weight="900" letter-spacing="2">
          CHARA CONCEPT MODEL SHEET // ${charName?.toUpperCase() || 'PROTAGONIST'}
        </text>
        <text x="${width - 220}" y="26" fill="#a1a1aa" font-family="monospace" font-size="11">
          STYLE: ${style.toUpperCase()} • 2D MANGA SPEC
        </text>
      </g>
    `;
  } else if (isCityNight) {
    // -------------------------------------------------------------
    // NIGHT CITY WITH GLOWING WINDOWS, NEON & STREET STAGING
    // -------------------------------------------------------------
    svg += `
      <!-- Radiant Full Moon / Atmospheric Glow -->
      <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${height * 0.12}" fill="${isBw ? '#ffffff' : '#fef08a'}" opacity="${isBw ? 0.35 : 0.85}" filter="url(#bloom)" />
      <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${height * 0.1}" fill="${isBw ? '#e4e4e7' : '#ffffff'}" />
      
      <!-- Distant Stars -->
      <g fill="#ffffff" opacity="0.6">
        <circle cx="120" cy="60" r="1.5" />
        <circle cx="280" cy="90" r="1" />
        <circle cx="420" cy="45" r="1.5" />
        <circle cx="560" cy="80" r="1" />
        <circle cx="70" cy="140" r="1" />
        <circle cx="720" cy="110" r="1.5" />
      </g>

      <!-- Layer 1: Distant Skyline Silhouettes -->
      <g fill="${isBw ? '#111116' : '#090d1e'}">
        <rect x="0" y="${height * 0.35}" width="${width * 0.14}" height="${height * 0.65}" />
        <rect x="${width * 0.12}" y="${height * 0.25}" width="${width * 0.18}" height="${height * 0.75}" />
        <polygon points="${width * 0.21},${height * 0.15} ${width * 0.22},${height * 0.25} ${width * 0.20},${height * 0.25}" />
        <rect x="${width * 0.28}" y="${height * 0.4}" width="${width * 0.15}" height="${height * 0.6}" />
        <rect x="${width * 0.41}" y="${height * 0.28}" width="${width * 0.2}" height="${height * 0.72}" />
        <rect x="${width * 0.59}" y="${height * 0.38}" width="${width * 0.16}" height="${height * 0.62}" />
        <rect x="${width * 0.73}" y="${height * 0.22}" width="${width * 0.18}" height="${height * 0.78}" />
        <polygon points="${width * 0.82},${height * 0.12} ${width * 0.83},${height * 0.22} ${width * 0.81},${height * 0.22}" />
        <rect x="${width * 0.89}" y="${height * 0.32}" width="${width * 0.15}" height="${height * 0.68}" />
      </g>

      <!-- Layer 2: Midground Buildings with Illuminated Windows -->
      <g fill="${isBw ? '#18181f' : '#0f172a'}" stroke="${isBw ? '#27272a' : '#1e293b'}" stroke-width="1.5">
        <rect x="${width * 0.05}" y="${height * 0.38}" width="${width * 0.22}" height="${height * 0.62}" />
        <rect x="${width * 0.32}" y="${height * 0.32}" width="${width * 0.26}" height="${height * 0.68}" />
        <rect x="${width * 0.64}" y="${height * 0.35}" width="${width * 0.28}" height="${height * 0.65}" />
      </g>

      <!-- Glowing Window Grids -->
      <g fill="${windowLit}">
        ${Array.from({ length: 7 })
          .map((_, r) =>
            Array.from({ length: 4 })
              .map((_, c) => {
                const show = (r * 4 + c) % 3 !== 0;
                return show
                  ? `<rect x="${width * 0.08 + c * 24}" y="${height * 0.42 + r * 22}" width="12" height="10" rx="1.5" />`
                  : "";
              })
              .join("")
          )
          .join("")}
      </g>

      <g fill="${windowCyan}">
        ${Array.from({ length: 8 })
          .map((_, r) =>
            Array.from({ length: 5 })
              .map((_, c) => {
                const show = (r * 5 + c) % 2 === 0;
                return show
                  ? `<rect x="${width * 0.35 + c * 28}" y="${height * 0.36 + r * 20}" width="14" height="9" rx="1.5" />`
                  : "";
              })
              .join("")
          )
          .join("")}
      </g>

      <g fill="${windowLit}">
        ${Array.from({ length: 7 })
          .map((_, r) =>
            Array.from({ length: 5 })
              .map((_, c) => {
                const show = (r * 5 + c) % 4 !== 1;
                return show
                  ? `<rect x="${width * 0.67 + c * 26}" y="${height * 0.39 + r * 22}" width="12" height="10" rx="1.5" />`
                  : "";
              })
              .join("")
          )
          .join("")}
      </g>

      <!-- Glowing Vertical Neon Signs (Kanji & Cyber) -->
      <g transform="translate(${width * 0.23}, ${height * 0.44})">
        <rect width="22" height="120" rx="4" fill="#000" stroke="${neonPink}" stroke-width="2" filter="url(#bloom)" />
        <text x="5" y="24" fill="${neonPink}" font-family="sans-serif" font-size="14" font-weight="900">ネ</text>
        <text x="5" y="48" fill="${neonPink}" font-family="sans-serif" font-size="14" font-weight="900">オ</text>
        <text x="5" y="72" fill="${neonPink}" font-family="sans-serif" font-size="14" font-weight="900">ン</text>
        <text x="5" y="96" fill="${neonPink}" font-family="sans-serif" font-size="14" font-weight="900">街</text>
      </g>

      <g transform="translate(${width * 0.55}, ${height * 0.38})">
        <rect width="24" height="140" rx="4" fill="#000" stroke="${neonCyan}" stroke-width="2" filter="url(#bloom)" />
        <text x="5" y="26" fill="${neonCyan}" font-family="sans-serif" font-size="14" font-weight="900">サ</text>
        <text x="5" y="52" fill="${neonCyan}" font-family="sans-serif" font-size="14" font-weight="900">イ</text>
        <text x="5" y="78" fill="${neonCyan}" font-family="sans-serif" font-size="14" font-weight="900">バ</text>
        <text x="5" y="104" fill="${neonCyan}" font-family="sans-serif" font-size="14" font-weight="900">ー</text>
        <text x="5" y="128" fill="${neonCyan}" font-family="sans-serif" font-size="14" font-weight="900">刀</text>
      </g>

      <!-- Overhead City Cables & Wires -->
      <g stroke="${isBw ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.85)'}" stroke-width="2" fill="none">
        <path d="M0,${height * 0.2} Q${width * 0.5},${height * 0.38} ${width},${height * 0.25}" />
        <path d="M0,${height * 0.28} Q${width * 0.45},${height * 0.42} ${width},${height * 0.32}" />
        <path d="M${width * 0.15},${height * 0.3} Q${width * 0.6},${height * 0.48} ${width},${height * 0.38}" />
      </g>

      <!-- Perspective Wet Asphalt Road / Rooftop Ground -->
      <polygon points="0,${height * 0.72} ${width},${height * 0.72} ${width},${height} 0,${height}" fill="url(#roadReflect)" />
      
      <!-- Wet Road Light Reflections -->
      <ellipse cx="${width * 0.24}" cy="${height * 0.88}" rx="45" ry="8" fill="${neonPink}" opacity="0.35" filter="url(#bloom)" />
      <ellipse cx="${width * 0.56}" cy="${height * 0.90}" rx="60" ry="10" fill="${neonCyan}" opacity="0.4" filter="url(#bloom)" />

      <!-- Perspective Dashed Road Markings -->
      <polygon points="${width * 0.48},${height * 0.73} ${width * 0.52},${height * 0.73} ${width * 0.54},${height * 0.78} ${width * 0.46},${height * 0.78}" fill="${isBw ? '#fff' : neonGold}" opacity="0.8" />
      <polygon points="${width * 0.46},${height * 0.82} ${width * 0.54},${height * 0.82} ${width * 0.57},${height * 0.90} ${width * 0.43},${height * 0.90}" fill="${isBw ? '#fff' : neonGold}" opacity="0.9" />
      <polygon points="${width * 0.42},${height * 0.93} ${width * 0.58},${height * 0.93} ${width * 0.62},${height} ${width * 0.38},${height}" fill="${isBw ? '#fff' : neonGold}" />

      <!-- 2D Anime Protagonist Staged in Scene -->
      <g transform="translate(${isWide ? width * 0.72 : width * 0.5}, ${height * 0.78})">
        <!-- Ground Shadow -->
        <ellipse cx="0" cy="65" rx="55" ry="12" fill="rgba(0,0,0,0.7)" />

        <!-- Billowing Ronin / Cyber Trench Coat -->
        <path d="M-30,-70 L-65,45 L-20,60 L20,60 L60,45 L30,-70 Z" fill="${coatColor}" stroke="${isBw ? '#fff' : '#fff'}" stroke-width="2.5" />
        
        <!-- Coat Interior & Neon Rim Lighting -->
        <path d="M-60,40 Q-30,55 0,55 Q30,55 55,40 L45,55 L-50,55 Z" fill="${isBw ? '#3f3f46' : '#991b1b'}" />
        <path d="M-65,45 L-30,-70" stroke="${neonCyan}" stroke-width="2.5" filter="url(#bloom)" />

        <!-- Legs & Stance -->
        <line x1="-15" y1="20" x2="-22" y2="65" stroke="#000" stroke-width="12" stroke-linecap="round" />
        <line x1="15" y1="20" x2="22" y2="65" stroke="#000" stroke-width="12" stroke-linecap="round" />
        <line x1="-15" y1="20" x2="-22" y2="65" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="2" />
        <line x1="15" y1="20" x2="22" y2="65" stroke="${isBw ? '#fff' : neonPink}" stroke-width="2" />

        <!-- Torso & Belt -->
        <path d="M-22,-70 L22,-70 L18,20 L-18,20 Z" fill="#09090b" stroke="${isBw ? '#fff' : '#fff'}" stroke-width="2" />
        <rect x="-20" y="5" width="40" height="10" fill="${isBw ? '#fff' : neonGold}" rx="2" />

        <!-- Glowing Katana / Cyber Weapon in Hand -->
        <path d="M20,-10 L75,-55" stroke="${isBw ? '#ffffff' : neonCyan}" stroke-width="4" stroke-linecap="round" filter="url(#bloom)" />
        <path d="M20,-10 L75,-55" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />

        <!-- Head, Face & Wind-Swept Anime Hair -->
        <circle cx="0" cy="-90" r="16" fill="${skinTone}" stroke="#000" stroke-width="1.5" />
        
        <!-- Expressive Anime Eyes looking forward -->
        <ellipse cx="6" cy="-90" rx="3.5" ry="2.5" fill="#000" />
        <circle cx="7" cy="-91" r="1" fill="#fff" />
        <line x1="2" y1="-95" x2="11" y2="-94" stroke="#000" stroke-width="1.5" />

        <!-- Dynamic Hair Silhouette with Rim Light -->
        <path d="M-18,-92 L-35,-115 L-12,-105 L0,-125 L12,-108 L28,-120 L20,-92 L12,-78 L-12,-78 Z" fill="${hairColor}" stroke="${isBw ? '#fff' : neonCyan}" stroke-width="2" />
      </g>
    `;
  } else if (isShrineOrFantasy) {
    // -------------------------------------------------------------
    // ANCIENT SHRINE / MOUNTAIN / CRIMSON MOON FANTASY STAGING
    // -------------------------------------------------------------
    svg += `
      <!-- Colossal Blood / Full Moon -->
      <circle cx="${width * 0.5}" cy="${height * 0.28}" r="${height * 0.22}" fill="${isBw ? '#ffffff' : '#dc2626'}" opacity="${isBw ? 0.3 : 0.85}" filter="url(#bloom)" />
      <circle cx="${width * 0.5}" cy="${height * 0.28}" r="${height * 0.19}" fill="${isBw ? '#e4e4e7' : '#ef4444'}" />
      
      <!-- Mountain Ridge Silhouettes -->
      <polygon points="0,${height * 0.45} ${width * 0.28},${height * 0.28} ${width * 0.55},${height * 0.48} ${width * 0.82},${height * 0.3} ${width},${height * 0.42} ${width},${height} 0,${height}" fill="${isBw ? '#131318' : '#0f0a1c'}" />
      
      <!-- Swirling Sakura Petals & Ink Sparks -->
      <g fill="${isBw ? '#ffffff' : '#f472b6'}" opacity="0.85">
        <ellipse cx="${width * 0.22}" cy="${height * 0.25}" rx="5" ry="2.5" transform="rotate(35 ${width * 0.22} ${height * 0.25})" />
        <ellipse cx="${width * 0.38}" cy="${height * 0.18}" rx="6" ry="3" transform="rotate(-20 ${width * 0.38} ${height * 0.18})" />
        <ellipse cx="${width * 0.65}" cy="${height * 0.22}" rx="5" ry="2.5" transform="rotate(45 ${width * 0.65} ${height * 0.22})" />
        <ellipse cx="${width * 0.78}" cy="${height * 0.35}" rx="6" ry="3" transform="rotate(15 ${width * 0.78} ${height * 0.35})" />
      </g>

      <!-- Ancient Torii Gate / Pagoda Roof Silhouette -->
      <g fill="${isBw ? '#000000' : '#180a0a'}" stroke="${isBw ? '#ffffff' : '#fca5a5'}" stroke-width="2">
        <!-- Torii Top Curved Beam -->
        <path d="M${width * 0.12},${height * 0.42} Q${width * 0.5},${height * 0.45} ${width * 0.88},${height * 0.42} L${width * 0.9},${height * 0.45} Q${width * 0.5},${height * 0.48} ${width * 0.1},${height * 0.45} Z" />
        <!-- Torii Second Horizontal Beam -->
        <rect x="${width * 0.2}" y="${height * 0.49}" width="${width * 0.6}" height="14" rx="2" />
        <!-- Torii Main Pillars -->
        <rect x="${width * 0.26}" y="${height * 0.45}" width="26" height="${height * 0.55}" />
        <rect x="${width * 0.70}" y="${height * 0.45}" width="26" height="${height * 0.55}" />
      </g>

      <!-- Cliff Edge / Temple Ground -->
      <polygon points="0,${height * 0.75} ${width},${height * 0.72} ${width},${height} 0,${height}" fill="${isBw ? '#09090b' : '#06040a'}" stroke="${isBw ? '#27272a' : '#450a0a'}" stroke-width="3" />

      <!-- 2D Manga Swordsman / Shrine Maiden Hero Figure -->
      <g transform="translate(${width * 0.5}, ${height * 0.74})">
        <!-- Shadow -->
        <ellipse cx="0" cy="55" rx="60" ry="14" fill="rgba(0,0,0,0.8)" />

        <!-- Flowing Kimono / Haori -->
        <path d="M-35,-65 L-70,40 L-25,50 L25,50 L70,40 L35,-65 Z" fill="${isBw ? '#000000' : '#1e1b4b'}" stroke="${isBw ? '#ffffff' : '#ffffff'}" stroke-width="2.5" />
        <path d="M-25,50 L-35,-65 L0,-20 L35,-65 L25,50 Z" fill="${isBw ? '#ffffff' : '#be123c'}" stroke="#000" stroke-width="1.5" />

        <!-- Katana Slash Energy Trail -->
        <path d="M-110,-40 Q0,-120 130,-20" fill="none" stroke="${isBw ? '#ffffff' : '#f59e0b'}" stroke-width="4" filter="url(#bloom)" />
        <path d="M-90,-35 Q0,-110 110,-18" fill="none" stroke="#ffffff" stroke-width="2" />

        <!-- Character Stance & Head -->
        <circle cx="0" cy="-85" r="16" fill="${skinTone}" stroke="#000" stroke-width="1.5" />
        
        <!-- Focused Eyes -->
        <ellipse cx="-5" cy="-85" rx="3.5" ry="2" fill="#000" />
        <ellipse cx="6" cy="-85" rx="3.5" ry="2" fill="#000" />
        <path d="M-9,-90 L-2,-88" stroke="#000" stroke-width="1.5" />
        <path d="M3,-88 L10,-90" stroke="#000" stroke-width="1.5" />

        <!-- Spiky Manga Hair -->
        <path d="M-22,-85 L-35,-115 L-15,-105 L0,-130 L15,-105 L35,-115 L22,-85 Z" fill="${hairColor}" stroke="${isBw ? '#ffffff' : '#f59e0b'}" stroke-width="2" />
      </g>
    `;
  } else {
    // -------------------------------------------------------------
    // DYNAMIC ACTION / COMBAT / SPEEDLINE PANEL
    // -------------------------------------------------------------
    svg += `
      <!-- Action Speed Lines Radiating from focal center -->
      <g stroke="${isBw ? 'rgba(255,255,255,0.22)' : 'rgba(245,158,11,0.3)'}" stroke-width="2">
        ${Array.from({ length: 24 })
          .map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = width * 0.5 + Math.cos(angle) * (width * 0.7);
            const y1 = height * 0.5 + Math.sin(angle) * (height * 0.7);
            const x2 = width * 0.5 + Math.cos(angle) * 80;
            const y2 = height * 0.5 + Math.sin(angle) * 80;
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
          })
          .join("")}
      </g>

      <!-- Central Climax 2D Hero Figure -->
      <g transform="translate(${width * 0.5}, ${height * 0.52})">
        <!-- Energy Impact Aura -->
        <circle cx="0" cy="0" r="110" fill="${isBw ? '#ffffff' : neonGold}" opacity="0.15" filter="url(#bloom)" />
        
        <!-- Slash Arc -->
        <path d="M-180,80 Q0,-140 180,-60" fill="none" stroke="${isBw ? '#ffffff' : neonCyan}" stroke-width="5" filter="url(#bloom)" />
        <path d="M-160,75 Q0,-130 160,-55" fill="none" stroke="#ffffff" stroke-width="2.5" />

        <!-- 2D Anime Hero Silhouette -->
        <path d="M-30,80 L-50,-20 L-20,-75 L20,-75 L50,-20 L30,80 Z" fill="#000000" stroke="${isBw ? '#ffffff' : neonGold}" stroke-width="2.5" />
        <circle cx="0" cy="-80" r="18" fill="${skinTone}" stroke="#000" stroke-width="2" />
        <path d="M-25,-85 L-40,-120 L-15,-110 L0,-135 L15,-110 L40,-120 L25,-85 Z" fill="${hairColor}" stroke="${isBw ? '#ffffff' : neonGold}" stroke-width="2" />
      </g>
    `;
  }

  // Authentic Manga Sound Effect (SFX) Typography
  const sfxText = textLower.includes("slash") || textLower.includes("crescent")
    ? "SHING!!"
    : textLower.includes("rumble") || textLower.includes("seal")
    ? "ドドド..."
    : textLower.includes("click") || textLower.includes("blade")
    ? "カチッ"
    : textLower.includes("barrier")
    ? "BOOM!"
    : "ゴゴゴ...";

  svg += `
    <!-- Manga SFX Lettering in Top Right -->
    <g transform="translate(${width - 140}, 55)">
      <text x="0" y="0" fill="${isBw ? '#ffffff' : neonGold}" font-family="impact, sans-serif" font-size="28" font-weight="900" font-style="italic" letter-spacing="1" stroke="#000000" stroke-width="5" paint-order="stroke fill">
        ${sfxText}
      </text>
    </g>

    <!-- Crisp Manga Panel Border -->
    <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="${isBw ? '#ffffff' : '#3f3f46'}" stroke-width="2.5" />
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
            scene: "Wide cinematic view of the crumbling Torii gate against a colossal bleeding crimson moon in night sky.",
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
              aspectRatio: "wide",
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
              aspectRatio: "tall",
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
              aspectRatio: "tall",
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
              aspectRatio: "tall",
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
              aspectRatio: "wide",
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
              aspectRatio: "wide",
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
              aspectRatio: "wide",
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
