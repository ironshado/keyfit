import { useState, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 🔑 DEPLOYMENT INSTRUCTIONS
//    This file uses the Anthropic API while running as a Claude artifact.
//    When you deploy to GitHub Pages, do TWO things:
//    1. Set your Gemini key: const GEMINI_API_KEY = "AIza...your key..."
//    2. In callAI() comment out ANTHROPIC block, uncomment GEMINI block.
// ─────────────────────────────────────────────────────────────────────────────
const GEMINI_API_KEY = "AQ.Ab8RN6Ls465llJveUSElgbUxuEE6whMkeMrQ6MH-EqaWADy6pA";
console.log("KEY:", GEMINI_API_KEY);

async function callAI(imageBase64, imageMimeType, prompt) {
  // ── ANTHROPIC (active in Claude artifact) ──────────────────────────────
  // const response = await fetch("https://api.anthropic.com/v1/messages", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     model: "claude-sonnet-4-20250514", max_tokens: 1000,
  //     messages: [{ role: "user", content: [
  //       { type: "image", source: { type: "base64", media_type: imageMimeType, data: imageBase64 } },
  //       { type: "text", text: prompt }
  //     ]}]
  //   })
  // });
  // const data = await response.json();
  // return data.content.map(c => c.text || "").join("");

  // ── GEMINI (uncomment for deploy) ──────────────────────────────────────
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ contents:[{ parts:[
        { inline_data:{ mime_type: imageMimeType, data: imageBase64 } },
        { text: prompt }
      ]}], generationConfig:{ temperature:0.4, maxOutputTokens:2000, responseMimeType:"application/json" } }) }
  );
  const data = await response.json();
  if (!response.ok) return JSON.stringify(data); // return error for handling
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const OCCASIONS = [
  { id:"date_night",  label:"Date Night",  icon:"🌙" },
  { id:"dinner",      label:"Dinner",      icon:"🍷" },
  { id:"museum",      label:"Museum",      icon:"🖼️" },
  { id:"movie",       label:"Movie",       icon:"🎬" },
  { id:"grocery",     label:"Grocery",     icon:"🛒" },
  { id:"clubbing",    label:"Clubbing",    icon:"🎉" },
  { id:"house_party", label:"House Party", icon:"🏠" },
  { id:"lunch",       label:"Lunch",       icon:"☀️" },
  { id:"park",        label:"Park Stroll", icon:"🌿" },
  { id:"office",      label:"Office",      icon:"💼" },
];
const VIBES = [
  { id:"casual",    label:"Casual/Chill" },
  { id:"formal",    label:"Formal"       },
  { id:"punk",      label:"Punk"         },
  { id:"goth",      label:"Goth"         },
  { id:"old_money", label:"Old Money"    },
  { id:"y2k",       label:"Y2K"          },
  { id:"dont_care", label:"Don't Care"   },
  { id:"anime",     label:"Anime"        },
  { id:"batman",    label:"Batman"       },
];
const ITEM_KEYS   = ["top","bottom","footwear","accessories","accent"];
const ITEM_ICONS  = { top:"👕", bottom:"👖", footwear:"👟", accessories:"⌚", accent:"✨" };
const ITEM_LABELS = { top:"Top", bottom:"Bottom", footwear:"Footwear", accessories:"Accessories", accent:"Dash of Color" };

// ─────────────────────────────────────────────────────────────────────────────
// PER-VIBE PAGE BACKGROUNDS  (gradient + SVG overlay pattern)
// ─────────────────────────────────────────────────────────────────────────────
const VIBE_BG = {
  "Casual/Chill": {
    // Sky-wash with diagonal denim stripe
    gradient: "linear-gradient(160deg, #daedf7 0%, #eef6fb 50%, #d4eaf5 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><line x1='0' y1='40' x2='40' y2='0' stroke='rgba(100,170,210,0.18)' stroke-width='2'/><line x1='-20' y1='40' x2='20' y2='0' stroke='rgba(100,170,210,0.18)' stroke-width='2'/><line x1='20' y1='40' x2='60' y2='0' stroke='rgba(100,170,210,0.18)' stroke-width='2'/></svg>`,
    headerBg: "rgba(220,240,250,0.92)", ink: "#1a3a4a", inkMid: "#3a6a7a", border: "#8cc8de", accent: "#2a90b4",
  },
  "Formal": {
    // Deep charcoal pinstripe
    gradient: "linear-gradient(180deg, #1a1f2e 0%, #242a3d 60%, #1a1f2e 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><line x1='4' y1='0' x2='4' y2='8' stroke='rgba(255,255,255,0.06)' stroke-width='1'/></svg>`,
    headerBg: "rgba(26,31,46,0.95)", ink: "#e8e4d8", inkMid: "#a0a8c0", border: "#3a4560", accent: "#8898cc",
  },
  "Punk": {
    // Black with red splatter tartan
    gradient: "linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='0' y1='0' x2='20' y2='20' stroke='rgba(220,30,60,0.35)' stroke-width='2'/><line x1='20' y1='0' x2='0' y2='20' stroke='rgba(220,30,60,0.2)' stroke-width='1'/><line x1='10' y1='0' x2='10' y2='20' stroke='rgba(220,30,60,0.1)' stroke-width='1'/></svg>`,
    headerBg: "rgba(13,13,13,0.95)", ink: "#ff3366", inkMid: "#cc2244", border: "#aa1133", accent: "#ff3366",
  },
  "Goth": {
    // Near-black velvet with purple damask diamond
    gradient: "linear-gradient(160deg, #080010 0%, #0d0018 50%, #080010 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><polygon points='12,1 23,12 12,23 1,12' fill='none' stroke='rgba(160,80,240,0.18)' stroke-width='1'/><circle cx='12' cy='12' r='3' fill='none' stroke='rgba(160,80,240,0.12)' stroke-width='0.5'/></svg>`,
    headerBg: "rgba(8,0,16,0.96)", ink: "#c084fc", inkMid: "#9060cc", border: "#5a1d9a", accent: "#a855f7",
  },
  "Old Money": {
    // Warm parchment houndstooth
    gradient: "linear-gradient(160deg, #f0e8d0 0%, #f7f2e4 50%, #ede0c4 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><rect x='0' y='0' width='10' height='10' fill='rgba(120,90,40,0.07)'/><rect x='10' y='10' width='10' height='10' fill='rgba(120,90,40,0.07)'/><rect x='5' y='0' width='5' height='5' fill='rgba(120,90,40,0.05)'/><rect x='15' y='10' width='5' height='5' fill='rgba(120,90,40,0.05)'/></svg>`,
    headerBg: "rgba(240,232,208,0.94)", ink: "#2c2010", inkMid: "#6a5030", border: "#b09060", accent: "#8a6030",
  },
  "Y2K": {
    // Bubblegum gradient with polka dots + shimmer
    gradient: "linear-gradient(135deg, #ffe0f7 0%, #e8d0ff 35%, #c8e8ff 65%, #ffe0f0 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><circle cx='8' cy='8' r='4' fill='rgba(240,100,200,0.2)'/><circle cx='22' cy='22' r='4' fill='rgba(160,120,255,0.2)'/><circle cx='22' cy='8' r='2.5' fill='rgba(80,180,255,0.2)'/><circle cx='8' cy='22' r='2.5' fill='rgba(240,100,200,0.15)'/></svg>`,
    headerBg: "rgba(255,224,247,0.92)", ink: "#5a0060", inkMid: "#9a40a0", border: "#e080c0", accent: "#cc40aa",
  },
  "Don't Care": {
    // Crumpled off-white linen
    gradient: "linear-gradient(170deg, #eeebe4 0%, #f4f1ec 40%, #e8e4dc 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><line x1='0' y1='15' x2='60' y2='17' stroke='rgba(140,130,110,0.15)' stroke-width='1'/><line x1='0' y1='32' x2='60' y2='29' stroke='rgba(140,130,110,0.1)' stroke-width='1'/><line x1='0' y1='48' x2='60' y2='51' stroke='rgba(140,130,110,0.13)' stroke-width='1'/></svg>`,
    headerBg: "rgba(238,235,228,0.94)", ink: "#4a4540", inkMid: "#7a7068", border: "#c0b8a8", accent: "#8a8070",
  },
  "Anime": {
    // Warm white with manga speed-lines
    gradient: "linear-gradient(160deg, #fff9e0 0%, #fffdf4 50%, #fff4d4 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><line x1='0' y1='0' x2='60' y2='15' stroke='rgba(220,60,20,0.18)' stroke-width='1.5'/><line x1='0' y1='0' x2='60' y2='35' stroke='rgba(220,60,20,0.12)' stroke-width='1'/><line x1='0' y1='0' x2='60' y2='55' stroke='rgba(220,60,20,0.18)' stroke-width='1.5'/><line x1='0' y1='0' x2='40' y2='60' stroke='rgba(220,60,20,0.12)' stroke-width='1'/><line x1='0' y1='0' x2='18' y2='60' stroke='rgba(220,60,20,0.08)' stroke-width='1'/></svg>`,
    headerBg: "rgba(255,249,224,0.93)", ink: "#aa1800", inkMid: "#cc4400", border: "#e06030", accent: "#dd3300",
  },
  "Batman": {
    // Brushed dark steel / carbon fibre hex
    gradient: "linear-gradient(160deg, #080808 0%, #111118 40%, #0c0c14 70%, #080808 100%)",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='34' height='20'><polygon points='17,1 33,10 17,19 1,10' fill='none' stroke='rgba(255,210,0,0.1)' stroke-width='0.8'/><line x1='1' y1='10' x2='33' y2='10' stroke='rgba(255,210,0,0.05)' stroke-width='0.5'/></svg>`,
    headerBg: "rgba(8,8,8,0.97)", ink: "#ffd700", inkMid: "#c8a800", border: "#6a5800", accent: "#ffd700",
  },
};

// Default notebook grid bg (no vibe hovered)
const DEFAULT_BG = {
  gradient: "#ffffff",
  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><defs><pattern id='sm' width='8' height='8' patternUnits='userSpaceOnUse'><path d='M 8 0 L 0 0 0 8' fill='none' stroke='rgba(180,210,255,0.3)' stroke-width='0.5'/></pattern><pattern id='lg' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='url(%23sm)'/><path d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(160,200,255,0.55)' stroke-width='1'/></pattern></defs><rect width='40' height='40' fill='url(%23lg)'/></svg>`,
  headerBg: "rgba(255,255,255,0.92)", ink: "#1A1A2E", inkMid: "#4A4A6A", border: "#C8D8F0", accent: "#2255CC",
};

function svgToDataUrl(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEB AUDIO CLICK SOUNDS  (all synthesized, zero external files)
// ─────────────────────────────────────────────────────────────────────────────
function playVibeSound(vibeLabel) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const sound = {
      // Casual: soft vinyl record scratch / chill snap
      "Casual/Chill": () => {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2) * 0.4;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1200;
        src.connect(f); f.connect(ctx.destination);
        src.start();
      },

      // Formal: quiet single piano key (middle C ish)
      "Formal": () => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle"; o.frequency.setValueAtTime(523, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.25, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.5);
      },

      // Punk: electric guitar power chord crunch
      "Punk": () => {
        [110, 165, 220, 330].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const dist = ctx.createWaveShaper();
          const curve = new Float32Array(256);
          for (let j = 0; j < 256; j++) { const x = (j * 2) / 256 - 1; curve[j] = ((Math.PI + 400) * x) / (Math.PI + 400 * Math.abs(x)); }
          dist.curve = curve;
          o.type = "sawtooth"; o.frequency.value = freq;
          g.gain.setValueAtTime(0.18, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          o.connect(dist); dist.connect(g); g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.015);
          o.stop(ctx.currentTime + 0.35);
        });
      },

      // Goth: low, slow, bored sigh (falling tone + breath noise)
      "Goth": () => {
        // Breath noise
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (i / d.length < 0.1 ? i / (d.length * 0.1) : 1) * 0.08;
        const ns = ctx.createBufferSource(); ns.buffer = buf;
        const nf = ctx.createBiquadFilter(); nf.type = "bandpass"; nf.frequency.value = 400; nf.Q.value = 0.5;
        const ng = ctx.createGain(); ng.gain.setValueAtTime(0.3, ctx.currentTime); ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        ns.connect(nf); nf.connect(ng); ng.connect(ctx.destination); ns.start();
        // Falling tone
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(180, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.7);
        g.gain.setValueAtTime(0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.7);
      },

      // Old Money: dignified clock tick / pocket watch
      "Old Money": () => {
        [0, 0.08].forEach(t => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = "sine"; o.frequency.value = t === 0 ? 1200 : 900;
          g.gain.setValueAtTime(0.3, ctx.currentTime + t);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.06);
          o.connect(g); g.connect(ctx.destination);
          o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.08);
        });
      },

      // Y2K: ascending bubbly blip (like an AIM notification)
      "Y2K": () => {
        [800, 1000, 1400].forEach((freq, i) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = "sine"; o.frequency.value = freq;
          g.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
          g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.07 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.12);
          o.connect(g); g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.07); o.stop(ctx.currentTime + i * 0.07 + 0.14);
        });
      },

      // Don't Care: dry, unimpressed single low thud
      "Don't Care": () => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(90, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.2);
      },

      // Anime: katana slash — quick high-pitched metallic sweep + ring-off
      "Anime": () => {
        // Slash sweep (noise burst)
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
          const env = i < d.length * 0.15 ? i / (d.length * 0.15) : Math.pow(1 - (i - d.length * 0.15) / (d.length * 0.85), 3);
          d[i] = (Math.random() * 2 - 1) * env * 0.6;
        }
        const src = ctx.createBufferSource(); src.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 3000;
        const g = ctx.createGain(); g.gain.value = 1.2;
        src.connect(f); f.connect(g); g.connect(ctx.destination); src.start();
        // Metal ring-off
        [3500, 5200, 7800].forEach((freq, i) => {
          const o = ctx.createOscillator(); const og = ctx.createGain();
          o.type = "sine"; o.frequency.value = freq;
          og.gain.setValueAtTime(0.12 - i * 0.03, ctx.currentTime + 0.05);
          og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5 - i * 0.1);
          o.connect(og); og.connect(ctx.destination);
          o.start(ctx.currentTime + 0.05); o.stop(ctx.currentTime + 0.5);
        });
      },

      // Batman: dark, armored impact thud + low reverberant boom
      "Batman": () => {
        // Impact crack
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.2)) * 0.9;
        const src = ctx.createBufferSource(); src.buffer = buf;
        const g = ctx.createGain(); g.gain.value = 1.5;
        src.connect(g); g.connect(ctx.destination); src.start();
        // Low boom
        const o = ctx.createOscillator(); const og = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(55, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.6);
        og.gain.setValueAtTime(0.7, ctx.currentTime); og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        o.connect(og); og.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.6);
        // Gold shimmer overtone
        const o2 = ctx.createOscillator(); const og2 = ctx.createGain();
        o2.type = "triangle"; o2.frequency.value = 880;
        og2.gain.setValueAtTime(0.08, ctx.currentTime + 0.02); og2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        o2.connect(og2); og2.connect(ctx.destination); o2.start(ctx.currentTime + 0.02); o2.stop(ctx.currentTime + 0.4);
      },
    };

    sound[vibeLabel]?.();
    setTimeout(() => ctx.close(), 2000);
  } catch(e) { /* audio blocked — fail silently */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function textColors(hex) {
  if (!hex || hex.length < 7) return { text:"rgba(0,0,0,0.85)", sub:"rgba(0,0,0,0.45)" };
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  return lum > 0.45
    ? { text:"rgba(0,0,0,0.85)",      sub:"rgba(0,0,0,0.45)" }
    : { text:"rgba(255,255,255,0.95)", sub:"rgba(255,255,255,0.6)" };
}

function buildFullPrompt(occ, vib, variant) {
  return `You are KeyFit, an AI men's digital stylist. Look at the attached image of the user's anchor/statement garment.

Occasion: ${occ}
Vibe: ${vib}
${variant > 0 ? `Variation #${variant}: fresh alternative, different colors.` : ""}

CRITICAL: Your response must be ONLY a valid JSON object. No introductory text, no explanations, no markdown, no backticks, no "Here is..." — just the raw JSON object starting with { and ending with }.

Identify the dominant color of the garment, then build a cohesive men's outfit palette.

Respond with exactly this structure:
{"anchorDescription":"2-3 word color label","anchorHex":"#RRGGBB","palette":{"top":{"colorName":"Warm Ivory","hex":"#F5F0E8","note":"slim fit tee"},"bottom":{"colorName":"Slate Grey","hex":"#6B7280","note":"chino trousers"},"footwear":{"colorName":"Tan","hex":"#C4956A","note":"leather loafers"},"accessories":{"colorName":"Navy","hex":"#1E3A5F","note":"woven belt"},"accent":{"colorName":"Burnt Orange","hex":"#C45C26","note":"pocket square"}},"styleNote":"One punchy sentence."}

Rules:
- Footwear: classic colors only — white, black, tan, brown, navy, grey
- Goth: blacks, charcoals, deep purples
- Punk: high-contrast clashes, saturated accents
- Old Money: navy, camel, cream, burgundy, forest green
- Casual/Chill: washed denim, heather grey, off-white, khaki
- Formal: neutrals, deep navy, charcoal
- Batman: black, deep grey, dark gold only
- Y2K: pastels, metallics, bright pops
- Anime: bold primaries, graphic contrast
- Don't Care: loose neutrals, minimal effort
- accent = small accessory-level color pop
- All hex values must accurately match their color names
- OUTPUT ONLY JSON, NOTHING ELSE`;
}

function buildItemPrompt(itemKey, currentPalette, anchorHex, occ, vib) {
  const rest = Object.entries(currentPalette).filter(([k]) => k !== itemKey).map(([k,v]) => `${k}: ${v.colorName} (${v.hex})`).join(", ");
  return `You are KeyFit, an AI men's digital stylist.
Anchor: ${anchorHex} | Occasion: ${occ} | Vibe: ${vib} | Rest of outfit: ${rest}

Give ONE alternative ${itemKey} color that fits the vibe, harmonises with the outfit, and is different from the current one.${itemKey==="footwear"?" Must be classic shoe color: white/black/tan/brown/navy/grey.":""}

CRITICAL: Respond with ONLY a JSON object, no text before or after, no markdown, no backticks:
{"colorName":"Name","hex":"#RRGGBB","note":"brief note"}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function KeyFit() {
  const [step, setStep]                   = useState(1);
  const [imageUrl, setImageUrl]           = useState(null);
  const [imageBase64, setImageBase64]     = useState(null);
  const [imageMime, setImageMime]         = useState("image/jpeg");
  const [dominantColor, setDominantColor] = useState(null);
  const [occasion, setOccasion]           = useState(null);
  const [vibe, setVibe]                   = useState(null);
  const [palette, setPalette]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [shufflingItem, setShufflingItem] = useState(null);
  const [uploadError, setUploadError]     = useState(null);
  const [hoveredVibe, setHoveredVibe]     = useState(null);
  const fileRef = useRef();

  // Current bg theme based on hovered vibe (or default)
  const activeBg = hoveredVibe ? (VIBE_BG[hoveredVibe] || DEFAULT_BG) : DEFAULT_BG;

  const handleImageUpload = useCallback((file) => {
    if (!file) return;
    setUploadError(null);
    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImageUrl(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
      setStep(2);
    };
    reader.onerror = () => setUploadError("Couldn't read that file.");
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImageUpload(file);
  }, [handleImageUpload]);

  const generatePalette = async (variant=0, occ, vib) => {
    setLoading(true); setPalette(null);
    try {
      const raw = await callAI(imageBase64, imageMime, buildFullPrompt(occ, vib, variant));
      console.log("RAW RESPONSE:", raw);

      // Detect rate limit / empty response
      if (!raw || raw.trim() === "") {
        alert("⏱️ Gemini rate limit hit — please wait 60 seconds and try again.");
        return;
      }

      // Detect error JSON from Gemini
      if (raw.includes('"error"')) {
        const err = JSON.parse(raw);
        alert("Gemini error: " + (err.error?.message || raw));
        return;
      }

      const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // Extract just the JSON object if there's surrounding text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        alert("Couldn't find JSON in response. Check console for raw output.");
        return;
      }
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.anchorHex) setDominantColor(parsed.anchorHex);
      if (!parsed.palette || Object.keys(parsed.palette).length === 0) {
        alert("Got a response but palette was empty. Check console — RAW RESPONSE is logged.");
        console.log("PARSED OBJECT:", JSON.stringify(parsed, null, 2));
        return;
      }
      setPalette(parsed); setStep(4);
    } catch(e) {
      console.error("ERROR:", e);
      if (e.message?.includes("JSON")) {
        alert("⏱️ Rate limit or bad response from Gemini — wait 60 seconds and try again.");
      } else {
        alert("Something went wrong: " + e.message);
      }
    }
    finally { setLoading(false); }
  };

  const shuffleItem = async (itemKey) => {
    if (!palette || shufflingItem) return;
    setShufflingItem(itemKey);
    try {
      const raw    = await callAI(imageBase64, imageMime, buildItemPrompt(itemKey, palette.palette, dominantColor, occasion, vibe));
      const cleanedItem = raw.replace(/```json/gi,"").replace(/```/g,"").trim();
      const itemMatch = cleanedItem.match(/\{[\s\S]*\}/);
      if (!itemMatch) return;
      const parsed = JSON.parse(itemMatch[0]);
      setPalette(prev => ({ ...prev, palette: { ...prev.palette, [itemKey]: parsed } }));
    } catch(e) { console.error(e); }
    finally { setShufflingItem(null); }
  };

  const reset = () => {
    setStep(1); setImageUrl(null); setImageBase64(null); setDominantColor(null);
    setOccasion(null); setVibe(null); setPalette(null); setUploadError(null);
    setShufflingItem(null); setHoveredVibe(null);
  };

  // Derived theme — default notebook or vibe-specific
  const T = {
    ink:        activeBg.ink     || "#1A1A2E",
    inkMid:     activeBg.inkMid  || "#4A4A6A",
    inkLight:   "#8888AA",
    border:     activeBg.border  || "#C8D8F0",
    accent:     activeBg.accent  || "#2255CC",
    accentBg:   activeBg.accent  ? `${activeBg.accent}18` : "#EEF3FF",
    headerBg:   activeBg.headerBg || "rgba(255,255,255,0.92)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: activeBg.gradient.includes("linear") ? "transparent" : activeBg.gradient,
      backgroundImage: `${svgToDataUrl(activeBg.svg)}, ${activeBg.gradient}`,
      backgroundSize: "auto, 100% 100%",
      backgroundRepeat: "repeat, no-repeat",
      color: T.ink,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background-image 0.55s ease, color 0.4s ease",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .shuffle-reveal { opacity:0; transition: opacity 0.18s; }
        .palette-row:hover .shuffle-reveal { opacity:1; }
        .occ-btn { transition: all 0.15s !important; }
        .occ-btn:hover { background: ${T.accentBg} !important; border-color: ${T.accent} !important; }
      `}</style>

      {/* Margin line */}
      <div style={{ position:"fixed", top:0, left:"52px", width:"2px", height:"100%", background: hoveredVibe ? activeBg.accent : "#FF6B8A", opacity:0.3, pointerEvents:"none", zIndex:0, transition:"background 0.5s" }} />

      {/* Header */}
      <div style={{ position:"relative", zIndex:1, borderBottom:`1px solid ${T.border}`, padding:"1.1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", background: T.headerBg, backdropFilter:"blur(10px)", transition:"background 0.5s, border-color 0.5s" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:"0.6rem" }}>
          <span style={{ fontFamily:"'Bebas Neue'", fontSize:"28px", letterSpacing:"3px", color:T.ink, transition:"color 0.4s" }}>KEYFIT</span>
          <span style={{ fontSize:"11px", color:T.inkMid, letterSpacing:"2px", textTransform:"uppercase", transition:"color 0.4s" }}>Digital Stylist</span>
        </div>
        {step > 1 && (
          <button onClick={reset}
            style={{ background:"none", border:`1px solid ${T.border}`, color:T.inkMid, borderRadius:"20px", padding:"6px 16px", fontSize:"12px", cursor:"pointer", letterSpacing:"1px", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.inkMid; }}
          >↩ Start over</button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ display:"flex", padding:"0.9rem 2rem 0", gap:"6px", position:"relative", zIndex:1 }}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{ height:"3px", flex:1, background: step >= s ? T.accent : T.border, borderRadius:"2px", transition:"background 0.4s" }} />
        ))}
      </div>

      <div style={{ padding:"2rem", maxWidth:"560px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* ── STEP 1 ─────────────────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <h1 style={{ fontFamily:"'Bebas Neue'", fontSize:"46px", letterSpacing:"2px", marginBottom:"0.2rem", color:T.ink }}>Drop your anchor.</h1>
            <p style={{ color:T.inkMid, fontSize:"14px", marginBottom:"2rem", lineHeight:"1.65" }}>Snap your statement piece — the item your whole fit orbits around.</p>
            <div
              onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current.click()}
              style={{ border:`2px dashed ${T.border}`, borderRadius:"16px", padding:"3.5rem 2rem", textAlign:"center", cursor:"pointer", background:"rgba(255,255,255,0.45)", transition:"all 0.2s", backdropFilter:"blur(4px)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = "rgba(255,255,255,0.65)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "rgba(255,255,255,0.45)"; }}
            >
              <div style={{ fontSize:"44px", marginBottom:"1rem" }}>📸</div>
              <p style={{ color:T.inkMid, fontSize:"14px", margin:0 }}>Drop a photo or tap to upload</p>
              <p style={{ color:T.inkMid, fontSize:"12px", marginTop:"6px", opacity:0.6 }}>JPG · PNG · WEBP</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleImageUpload(e.target.files[0])} />
            {uploadError && <p style={{ color:"#CC3355", fontSize:"13px", marginTop:"1rem", textAlign:"center" }}>{uploadError}</p>}
          </div>
        )}

        {/* ── STEP 2 ─────────────────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            {imageUrl && (
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"1.5rem", background:"rgba(255,255,255,0.7)", borderRadius:"12px", padding:"12px 14px", border:`1px solid ${T.border}`, backdropFilter:"blur(4px)" }}>
                <img src={imageUrl} style={{ width:"50px", height:"50px", objectFit:"cover", borderRadius:"8px", border:`1px solid ${T.border}` }} alt="Anchor" />
                <div>
                  <div style={{ fontSize:"10px", color:T.inkMid, letterSpacing:"2px", textTransform:"uppercase", opacity:0.7 }}>Anchor locked in</div>
                  <div style={{ fontSize:"13px", color:T.inkMid, marginTop:"3px" }}>Now tell me where you're headed</div>
                </div>
              </div>
            )}
            <h2 style={{ fontFamily:"'Bebas Neue'", fontSize:"38px", letterSpacing:"2px", marginBottom:"1.25rem", color:T.ink }}>Where you headed?</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"8px" }}>
              {OCCASIONS.map(o => (
                <button key={o.id} className="occ-btn"
                  onClick={() => { setOccasion(o.label); setStep(3); }}
                  style={{ background:"rgba(255,255,255,0.75)", border:`1px solid ${T.border}`, borderRadius:"12px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", color:T.ink, fontSize:"14px", fontFamily:"'DM Sans'", backdropFilter:"blur(4px)" }}
                >
                  <span style={{ fontSize:"20px" }}>{o.icon}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: VIBE ───────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <h2 style={{ fontFamily:"'Bebas Neue'", fontSize:"38px", letterSpacing:"2px", marginBottom:"0.25rem", color:T.ink, transition:"color 0.4s" }}>What's the vibe?</h2>
            <p style={{ color:T.inkMid, fontSize:"13px", marginBottom:"1.5rem", transition:"color 0.4s" }}>
              {occasion} · <span style={{ color:T.accent, fontWeight:600 }}>pick your energy</span>
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {VIBES.map(v => {
                const isHovered = hoveredVibe === v.label;
                return (
                  <button key={v.id}
                    onMouseEnter={() => setHoveredVibe(v.label)}
                    onMouseLeave={() => setHoveredVibe(null)}
                    onClick={() => {
                      playVibeSound(v.label);
                      setVibe(v.label);
                      generatePalette(0, occasion, v.label);
                    }}
                    style={{
                      background: isHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(6px)",
                      border: `1px solid ${isHovered ? (activeBg.accent || T.accent) : T.border}`,
                      borderRadius: "12px",
                      paddingTop: "16px", paddingBottom: "16px",
                      paddingLeft: isHovered ? "26px" : "20px",
                      paddingRight: "20px",
                      cursor: "pointer",
                      color: isHovered ? T.ink : T.ink,
                      fontSize: "15px",
                      fontWeight: isHovered ? "600" : "500",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      fontFamily: "'DM Sans'",
                      letterSpacing: isHovered ? "0.4px" : "0",
                      boxShadow: isHovered ? `0 4px 20px ${activeBg.accent || T.accent}33` : "0 1px 3px rgba(0,0,0,0.06)",
                      transform: isHovered ? "scale(1.01)" : "scale(1)",
                    }}
                  >
                    <span>{v.label}</span>
                    <span style={{ transition:"transform 0.2s", display:"inline-block", transform: isHovered ? "translateX(5px)" : "none", color: T.accent }}>→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:"center", padding:"5rem 0", animation:"fadeIn 0.3s ease" }}>
            <div style={{ width:"40px", height:"40px", margin:"0 auto 1.5rem", border:`2px solid ${T.border}`, borderTop:`2px solid ${T.accent}`, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
            <p style={{ color:T.inkMid, fontSize:"13px", fontStyle:"italic" }}>Sketching your palette…</p>
          </div>
        )}

        {/* ── STEP 4 ─────────────────────────────────────────────────── */}
        {step === 4 && palette && !loading && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", gap:"8px", marginBottom:"1.25rem", flexWrap:"wrap" }}>
              <span style={{ background:"rgba(255,255,255,0.75)", border:`1px solid ${T.border}`, borderRadius:"20px", padding:"4px 12px", fontSize:"11px", color:T.inkMid, letterSpacing:"1px" }}>{occasion}</span>
              <span style={{ background: T.accentBg, border:`1px solid ${T.accent}44`, borderRadius:"20px", padding:"4px 12px", fontSize:"11px", color:T.accent, letterSpacing:"1px", fontWeight:600 }}>{vibe}</span>
            </div>

            {/* Anchor */}
            <div style={{ background:"rgba(255,255,255,0.82)", border:`1px solid ${T.border}`, borderRadius:"14px", padding:"14px 16px", marginBottom:"10px", display:"flex", alignItems:"center", gap:"12px", backdropFilter:"blur(4px)" }}>
              {imageUrl && <img src={imageUrl} style={{ width:"50px", height:"50px", objectFit:"cover", borderRadius:"9px", border:`1px solid ${T.border}` }} alt="Anchor" />}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"10px", color:T.inkMid, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"3px", opacity:0.6 }}>Anchor piece</div>
                <div style={{ fontSize:"14px", color:T.inkMid, fontWeight:500 }}>{palette.anchorDescription}</div>
              </div>
              <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:dominantColor, border:`1px solid ${T.border}`, flexShrink:0 }} />
            </div>

            {/* Palette rows */}
            <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"10px" }}>
              {ITEM_KEYS.map(key => {
                const item = palette.palette?.[key];
                if (!item) return null;
                const hex = item.hex || "#eee";
                const { text, sub } = textColors(hex);
                const isSpinning = shufflingItem === key;
                return (
                  <div key={key} className="palette-row" style={{ position:"relative", borderRadius:"14px", overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.1)" }}>
                    {isSpinning && (
                      <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3, backdropFilter:"blur(2px)" }}>
                        <div style={{ width:"20px", height:"20px", border:`2px solid rgba(0,0,0,0.1)`, borderTop:`2px solid ${T.accent}`, borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
                      </div>
                    )}
                    <div style={{ background:hex, padding:"15px 16px", display:"flex", alignItems:"center", gap:"14px", border:"1px solid rgba(0,0,0,0.06)" }}>
                      <span style={{ fontSize:"22px", width:"28px", textAlign:"center", flexShrink:0 }}>{ITEM_ICONS[key]}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:"10px", color:sub, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"3px" }}>{ITEM_LABELS[key]}</div>
                        <div style={{ fontSize:"16px", fontWeight:"700", color:text }}>{item.colorName}</div>
                        <div style={{ fontSize:"12px", color:sub, marginTop:"2px" }}>{item.note}</div>
                      </div>
                      <button className="shuffle-reveal"
                        onClick={() => shuffleItem(key)} disabled={!!shufflingItem}
                        style={{ background:"rgba(255,255,255,0.3)", border:"1px solid rgba(255,255,255,0.5)", borderRadius:"50%", width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", cursor:shufflingItem?"not-allowed":"pointer", flexShrink:0, fontSize:"15px", backdropFilter:"blur(4px)", transition:"background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.6)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                      >🔀</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Style note */}
            {palette.styleNote && (
              <div style={{ borderLeft:`3px solid ${T.accent}`, padding:"10px 14px", marginBottom:"1.25rem", background:"rgba(255,255,255,0.6)", borderRadius:"0 8px 8px 0", backdropFilter:"blur(4px)" }}>
                <p style={{ margin:0, fontSize:"13px", color:T.inkMid, fontStyle:"italic", lineHeight:"1.65" }}>{palette.styleNote}</p>
              </div>
            )}

            {/* Shuffle all */}
            <button
              onClick={() => generatePalette(Date.now(), occasion, vibe)}
              style={{ width:"100%", background:"rgba(255,255,255,0.75)", border:`1px solid ${T.border}`, borderRadius:"14px", padding:"15px", color:T.ink, fontSize:"14px", cursor:"pointer", letterSpacing:"1px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"all 0.2s", fontFamily:"'DM Sans'", fontWeight:500, backdropFilter:"blur(4px)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.color = T.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "rgba(255,255,255,0.75)"; e.currentTarget.style.color = T.ink; }}
            >
              <span>🔀</span><span>Shuffle entire palette</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
