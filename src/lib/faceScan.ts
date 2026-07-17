import type { FaceLandmarker } from "@mediapipe/tasks-vision";

// ─── MediaPipe landmark indices (478-point face mesh w/ iris) ───
const LM = {
  rEyeOuter: 33, rEyeInner: 133, lEyeInner: 362, lEyeOuter: 263,
  rEyeUpper: 159, rEyeLower: 145, lEyeUpper: 386, lEyeLower: 374,
  rIris: 468, lIris: 473,
  rCheek: 234, lCheek: 454,          // bizygomatic (face oval widest)
  rGonion: 58, lGonion: 288,         // jaw angle region
  foreheadTop: 10, chin: 152,
  nasion: 168, subnasale: 2,
  rAlar: 129, lAlar: 358,
  lipTop: 0, lipUpperInner: 13, lipLowerInner: 14, lipBottom: 17,
  rMouth: 61, lMouth: 291,
  rBrowMedial: 107, rBrowPeak: 105, rBrowTail: 70,
  lBrowMedial: 336, lBrowPeak: 334, lBrowTail: 300,
  rCheekSkin: 50, lCheekSkin: 280, foreheadSkin: 151,
};

// brow landmark rows for thickness/density sampling (medial → tail)
const R_BROW_UPPER = [107, 66, 105, 63, 70];
const R_BROW_LOWER = [55, 65, 52, 53, 46];
const L_BROW_UPPER = [336, 296, 334, 293, 300];
const L_BROW_LOWER = [285, 295, 282, 283, 276];

interface Pt { x: number; y: number }

export interface ScanMetric {
  id: string;
  name: string;
  display: string;       // formatted measured value, e.g. "4.2°"
  ideal: string;         // human-readable ideal band
  score: number;         // 0–10
  weight: number;
  note: string;          // one-line read on the result
  issueSlugs: string[];  // issues to surface when this metric is weak
}

export interface ScanResult {
  overall: number;
  tier: string;
  metrics: ScanMetric[];
  warnings: string[];
  /** key points in image pixel coords, for drawing the overlay */
  overlay: {
    rEyeOuter: Pt; rEyeInner: Pt; lEyeInner: Pt; lEyeOuter: Pt;
    rCheek: Pt; lCheek: Pt; rGonion: Pt; lGonion: Pt;
    nasion: Pt; subnasale: Pt; chin: Pt; foreheadTop: Pt;
    rBrowMedial: Pt; rBrowTail: Pt; lBrowMedial: Pt; lBrowTail: Pt;
    /** skin sample zones (only meaningful when pixel metrics ran) */
    rCheekSkin: Pt; lCheekSkin: Pt; foreheadSkin: Pt;
    /** base radius (px) for drawing the skin sample ovals */
    skinPatchR: number;
  };
}

// ─── model loading (singleton) ───
let landmarker: FaceLandmarker | null = null;
let loading: Promise<FaceLandmarker> | null = null;

export function loadFaceLandmarker(): Promise<FaceLandmarker> {
  if (landmarker) return Promise.resolve(landmarker);
  if (loading) return loading;
  loading = (async () => {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
    );
    const make = (delegate: "GPU" | "CPU") =>
      FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate,
        },
        runningMode: "IMAGE",
        numFaces: 1,
      });
    try {
      landmarker = await make("GPU");
    } catch {
      landmarker = await make("CPU");
    }
    return landmarker;
  })();
  return loading;
}

// ─── geometry helpers ───
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/**
 * Harsh scoring: 10 only at the exact center of [lo, hi], sliding to 8.5 at the
 * band edge, then dropping 1.35 per `unit` outside. A perfect 10 requires a
 * perfect measurement — near-ideal reads as "good, not done".
 */
function band(value: number, lo: number, hi: number, unit: number): number {
  const center = (lo + hi) / 2;
  const half = Math.max((hi - lo) / 2, 0.0001);
  const d = Math.abs(value - center);
  if (d <= half) return 10 - (d / half) * 1.5;
  return Math.max(1, Math.min(10, 8.5 - ((d - half) / unit) * 1.35));
}

/** mean luminance, luminance std, and redness of a square patch centered on (cx, cy) */
function samplePatch(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  imgW: number, imgH: number
): { mean: number; std: number; redness: number } {
  const s = Math.max(4, Math.round(size));
  const x = Math.round(Math.max(0, Math.min(imgW - s, cx - s / 2)));
  const y = Math.round(Math.max(0, Math.min(imgH - s, cy - s / 2)));
  const data = ctx.getImageData(x, y, s, s).data;
  let sum = 0, sumSq = 0, rSum = 0, gbSum = 0, n = 0;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += lum;
    sumSq += lum * lum;
    rSum += data[i];
    gbSum += (data[i + 1] + data[i + 2]) / 2;
    n++;
  }
  const mean = sum / n;
  return {
    mean,
    std: Math.sqrt(Math.max(0, sumSq / n - mean * mean)),
    redness: rSum / Math.max(1, gbSum),
  };
}

function rotate(p: Pt, origin: Pt, rad: number): Pt {
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const dx = p.x - origin.x, dy = p.y - origin.y;
  return { x: origin.x + dx * cos - dy * sin, y: origin.y + dx * sin + dy * cos };
}

export function tierFor(overall: number): string {
  if (overall >= 8.7) return "Elite harmony";
  if (overall >= 7.5) return "Strong base";
  if (overall >= 6) return "Solid — clear levers";
  return "High upside";
}

// ─── main analysis ───
export function analyzeFace(
  rawLandmarks: { x: number; y: number }[],
  imgW: number,
  imgH: number,
  ctx?: CanvasRenderingContext2D
): ScanResult {
  // to pixel coords
  const px = (i: number): Pt => ({ x: rawLandmarks[i].x * imgW, y: rawLandmarks[i].y * imgH });

  // roll-correct: rotate all key points so the eye line is horizontal
  const rIris = px(LM.rIris), lIris = px(LM.lIris);
  const rollRad = Math.atan2(lIris.y - rIris.y, lIris.x - rIris.x);
  const center = mid(rIris, lIris);
  const P: Record<keyof typeof LM, Pt> = {} as Record<keyof typeof LM, Pt>;
  (Object.keys(LM) as (keyof typeof LM)[]).forEach((k) => {
    P[k] = rotate(px(LM[k]), center, -rollRad);
  });

  const warnings: string[] = [];

  // yaw check: nose should sit near the midpoint of the cheeks
  const faceW = dist(P.rCheek, P.lCheek);
  const noseOffset = Math.abs(P.nasion.x - mid(P.rCheek, P.lCheek).x) / faceW;
  if (noseOffset > 0.06)
    warnings.push("Head looks turned — face the camera dead-on for accurate ratios.");
  if (Math.abs((rollRad * 180) / Math.PI) > 8)
    warnings.push("Photo is tilted — results were roll-corrected but a straight photo scores cleaner.");

  const metrics: ScanMetric[] = [];
  const add = (m: ScanMetric) => metrics.push(m);

  // 1 · Canthal tilt (y grows downward → outer higher = positive tilt)
  const tiltR = (Math.atan2(P.rEyeInner.y - P.rEyeOuter.y, Math.abs(P.rEyeInner.x - P.rEyeOuter.x)) * 180) / Math.PI;
  const tiltL = (Math.atan2(P.lEyeInner.y - P.lEyeOuter.y, Math.abs(P.lEyeOuter.x - P.lEyeInner.x)) * 180) / Math.PI;
  const tilt = (tiltR + tiltL) / 2;
  add({
    id: "canthal-tilt", name: "Canthal Tilt",
    display: `${tilt.toFixed(1)}°`, ideal: "6–9° positive",
    score: band(tilt, 6, 9, 1.2), weight: 1.2,
    note: tilt >= 6 ? "Hunter-eye territory — keep it." :
      tilt >= 3 ? "Positive but short of ideal. Sleep debt and puffiness are flattening what's there." :
      "Flat-to-negative tilt — reads tired and recessed on camera. Puffiness and fatigue are the fixable part.",
    issueSlugs: tilt < 6 ? ["facial-puffiness", "poor-sleep"] : [],
  });

  // 2 · Eye spacing (1:1:1 rule)
  const eyeWidth = (dist(P.rEyeOuter, P.rEyeInner) + dist(P.lEyeInner, P.lEyeOuter)) / 2;
  const intercanthal = dist(P.rEyeInner, P.lEyeInner);
  const spacing = intercanthal / eyeWidth;
  add({
    id: "eye-spacing", name: "Eye Spacing",
    display: `${spacing.toFixed(2)}×`, ideal: "1.08–1.22× eye width",
    score: band(spacing, 1.08, 1.22, 0.07), weight: 0.8,
    note: spacing > 1.22 ? "Wide-set. Brow grooming toward the nose tightens the frame visually." :
      spacing < 1.08 ? "Close-set. Extend brow tails outward to widen the frame." :
      "Ideal spacing — textbook horizontal fifths.",
    issueSlugs: [],
  });

  // 3 · fWHR (cheek width / brow-to-lip height)
  const browMidY = (P.rBrowPeak.y + P.lBrowPeak.y) / 2;
  const fwhr = faceW / Math.abs(P.lipTop.y - browMidY);
  add({
    id: "fwhr", name: "Face Width-Height (fWHR)",
    display: fwhr.toFixed(2), ideal: "1.75–1.95",
    score: band(fwhr, 1.75, 1.95, 0.12), weight: 1.0,
    note: fwhr >= 1.75 && fwhr <= 1.95 ? "Dominant width-to-height — strong masculine signal." :
      fwhr > 1.95 ? "Width overshoots the band — usually soft-tissue fullness, not bone. Leanness pulls this back in." :
      "Narrow width-to-height — weakens the dominance signal. Masseter work and leanness are the levers.",
    issueSlugs: fwhr < 1.75 ? ["jawline-definition"] : fwhr > 1.95 ? ["facial-puffiness", "body-fat"] : [],
  });

  // 4 · Midface ratio (interpupillary / pupil-to-lip)
  const ipd = dist(rotate(rIris, center, -rollRad), rotate(lIris, center, -rollRad));
  const midface = ipd / dist(mid(P.rEyeInner, P.lEyeInner), P.lipTop);
  add({
    id: "midface", name: "Midface Compactness",
    display: `${midface.toFixed(2)}×`, ideal: "0.95–1.08",
    score: band(midface, 0.95, 1.08, 0.07), weight: 1.0,
    note: midface >= 0.95 && midface <= 1.08 ? "Compact midface — high harmony signal." :
      midface > 1.08 ? "Longer midface. Structural, but leanness reduces visual length." :
      "Short midface — reads youthful, generally favorable.",
    issueSlugs: [],
  });

  // 5 · Facial thirds (lower / middle)
  const middleThird = dist(P.nasion, P.subnasale);
  const lowerThird = dist(P.subnasale, P.chin);
  const thirds = lowerThird / middleThird;
  add({
    id: "thirds", name: "Facial Thirds Balance",
    display: `${thirds.toFixed(2)}×`, ideal: "1.22–1.42",
    score: band(thirds, 1.22, 1.42, 0.1), weight: 1.0,
    note: thirds > 1.42 ? "Lower third runs long — visibly stretches the face. Beard/facial hair styling rebalances it." :
      thirds < 1.22 ? "Lower third runs short — reads soft and under-developed. Jaw definition work is the lever." :
      "Balanced thirds.",
    issueSlugs: thirds < 1.22 ? ["jawline-definition"] : [],
  });

  // 6 · Chin-to-philtrum
  const philtrum = dist(P.subnasale, P.lipTop);
  const chinH = dist(P.lipBottom, P.chin);
  const chinRatio = chinH / philtrum;
  add({
    id: "chin-philtrum", name: "Chin-to-Philtrum",
    display: `${chinRatio.toFixed(2)}×`, ideal: "2.15–2.65×",
    score: band(chinRatio, 2.15, 2.65, 0.25), weight: 0.9,
    note: chinRatio < 2.15 ? "Chin under-projects relative to philtrum — weakens the whole profile. Body fat is usually the mask here." :
      chinRatio > 2.65 ? "Long lower face relative to philtrum — strong chin, style around it." :
      "Strong chin proportion.",
    issueSlugs: chinRatio < 2.15 ? ["jawline-definition", "body-fat"] : [],
  });

  // 7 · Lip ratio (lower / upper)
  const upperLip = dist(P.lipTop, P.lipUpperInner);
  const lowerLip = dist(P.lipLowerInner, P.lipBottom);
  const lipRatio = lowerLip / Math.max(upperLip, 0.001);
  add({
    id: "lip-ratio", name: "Lip Ratio",
    display: `${lipRatio.toFixed(2)}×`, ideal: "1.45–1.95× lower/upper",
    score: band(lipRatio, 1.45, 1.95, 0.25), weight: 0.7,
    note: lipRatio >= 1.45 && lipRatio <= 1.95 ? "Lower-to-upper fullness sits in the classic band." :
      lipRatio < 1.45 ? "Upper lip dominates — off the classic ratio, reads unbalanced up close." :
      "Bottom-heavy lip ratio — off the classic band and it shows in photos.",
    issueSlugs: [],
  });

  // 7b · Lip fullness (total vermilion height vs lower third)
  const lipFullness = dist(P.lipTop, P.lipBottom) / Math.max(dist(P.subnasale, P.chin), 0.001);
  add({
    id: "lip-fullness", name: "Lip Fullness",
    display: `${(lipFullness * 100).toFixed(0)}%`, ideal: "22–30% of lower third",
    score: band(lipFullness, 0.22, 0.3, 0.045), weight: 0.7,
    note: lipFullness < 0.22 ? "Lips run thin for your lower third — flattens the whole mouth area on camera." :
      lipFullness > 0.3 ? "Lips carry a lot of the lower third — proportion, not fullness, is the issue here." :
      "Vermilion height is proportionate to your lower third.",
    issueSlugs: [],
  });

  // 7c · Mouth width vs nose width (classic ~1.5× rule)
  const mouthNose = dist(P.rMouth, P.lMouth) / Math.max(dist(P.rAlar, P.lAlar), 0.001);
  add({
    id: "mouth-nose", name: "Mouth-to-Nose Width",
    display: `${mouthNose.toFixed(2)}×`, ideal: "1.38–1.62× nose width",
    score: band(mouthNose, 1.38, 1.62, 0.13), weight: 0.7,
    note: mouthNose < 1.38 ? "Mouth reads narrow against your nose — throws off the lower-face balance." :
      mouthNose > 1.62 ? "Wide mouth relative to nose — pulls attention low on the face." :
      "Mouth-to-nose proportion is on the classic line.",
    issueSlugs: [],
  });

  // 7d · Eye aspect ratio (height / width — narrow reads sharper)
  const earR = dist(P.rEyeUpper, P.rEyeLower) / Math.max(dist(P.rEyeOuter, P.rEyeInner), 0.001);
  const earL = dist(P.lEyeUpper, P.lEyeLower) / Math.max(dist(P.lEyeOuter, P.lEyeInner), 0.001);
  const eyeAspect = (earR + earL) / 2;
  add({
    id: "eye-aspect", name: "Eye Narrowness",
    display: `${eyeAspect.toFixed(2)}×`, ideal: "0.24–0.32 height/width",
    score: band(eyeAspect, 0.24, 0.32, 0.04), weight: 0.9,
    note: eyeAspect > 0.32 ? "Eyes read round — puffiness and water retention round the eye area. Leanness + sleep narrows the shape." :
      eyeAspect < 0.24 ? "Extremely narrow aperture — often camera angle or squinting. Retake relaxed if so." :
      "Narrow aperture — the hunter-eye shape everyone is chasing.",
    issueSlugs: eyeAspect > 0.32 ? ["facial-puffiness", "poor-sleep"] : [],
  });

  // 8 · Nose width vs intercanthal
  const noseRatio = dist(P.rAlar, P.lAlar) / intercanthal;
  add({
    id: "nose-width", name: "Nose Width",
    display: `${noseRatio.toFixed(2)}×`, ideal: "1.05–1.28× intercanthal",
    score: band(noseRatio, 1.05, 1.28, 0.11), weight: 0.8,
    note: noseRatio >= 1.05 && noseRatio <= 1.28 ? "Nose sits in the ideal channel between the eyes." :
      noseRatio > 1.28 ? "Alar width runs wide of intercanthal — mostly structural." :
      "Narrow nose — generally favorable in front profile.",
    issueSlugs: [],
  });

  // 9 · Jaw taper (gonial width / cheek width)
  const jawTaper = dist(P.rGonion, P.lGonion) / faceW;
  add({
    id: "jaw-taper", name: "Jaw-to-Cheek Taper",
    display: `${jawTaper.toFixed(2)}×`, ideal: "0.84–0.90",
    score: band(jawTaper, 0.845, 0.895, 0.022), weight: 1.0,
    note: jawTaper > 0.895 ? "Lower face carries width — usually soft-tissue, not bone. The jawline is buried; fat loss reveals it." :
      jawTaper < 0.845 ? "Narrow gonial width — jaw disappears from the front. Masseter development adds real width here." :
      "Clean taper — jawline reads defined.",
    issueSlugs: jawTaper > 0.895 ? ["facial-puffiness", "jawline-definition", "body-fat"] :
      jawTaper < 0.845 ? ["jawline-definition"] : [],
  });

  // 10 · Brow tilt (tail above medial = positive)
  const bTiltR = (Math.atan2(P.rBrowMedial.y - P.rBrowTail.y, Math.abs(P.rBrowMedial.x - P.rBrowTail.x)) * 180) / Math.PI;
  const bTiltL = (Math.atan2(P.lBrowMedial.y - P.lBrowTail.y, Math.abs(P.lBrowTail.x - P.lBrowMedial.x)) * 180) / Math.PI;
  const browTilt = (bTiltR + bTiltL) / 2;
  add({
    id: "brow-tilt", name: "Brow Tilt",
    display: `${browTilt.toFixed(1)}°`, ideal: "−4° to +2°",
    score: band(browTilt, -4.5, 2, 1.8), weight: 0.9,
    note: browTilt < -4.5 ? "Tail droops. Lamination + growing the tail out is the highest-ROI grooming fix." :
      "Neutral-to-upward sweep — strong eye-area frame.",
    issueSlugs: browTilt < -4.5 ? ["thin-brows"] : [],
  });

  // 11 · Symmetry (mirrored deviation of paired points about the vertical midline)
  const midX = (P.nasion.x + P.chin.x) / 2;
  const pairs: [Pt, Pt][] = [
    [P.rEyeOuter, P.lEyeOuter], [P.rEyeInner, P.lEyeInner],
    [P.rCheek, P.lCheek], [P.rGonion, P.lGonion],
    [P.rMouth, P.lMouth], [P.rBrowTail, P.lBrowTail],
  ];
  const asym =
    pairs.reduce((s, [r, l]) => {
      const dR = midX - r.x, dL = l.x - midX;
      return s + Math.abs(dR - dL) / faceW + Math.abs(r.y - l.y) / faceW;
    }, 0) / pairs.length;
  // a turned head reads as asymmetry — don't punish geometry for camera angle
  const yawUnreliable = noseOffset > 0.06;
  const symScore = yawUnreliable ? 7 : Math.max(1, Math.min(10, 10 - asym * 48));
  add({
    id: "symmetry", name: "Symmetry",
    display: yawUnreliable ? "—" : `${Math.max(0, 100 - asym * 400).toFixed(0)}%`,
    ideal: "93%+",
    score: symScore, weight: 1.2,
    note: yawUnreliable ? "Head is turned in this photo — symmetry can't be read reliably. Retake straight-on." :
      symScore >= 8.5 ? "High symmetry — top-tier baseline most people don't have." :
      symScore >= 7 ? "Minor asymmetry — within normal range, camera angle exaggerates it." :
      "Visible asymmetry in this photo — retake straight-on before reading into it.",
    issueSlugs: [],
  });

  // 12 · Facial index (height / width)
  const faceIndex = dist(P.foreheadTop, P.chin) / faceW;
  add({
    id: "face-index", name: "Face Length Index",
    display: `${faceIndex.toFixed(2)}×`, ideal: "1.18–1.30",
    score: band(faceIndex, 1.18, 1.3, 0.09), weight: 0.8,
    note: faceIndex > 1.3 ? "Long-face pattern — hairstyle with side volume rebalances." :
      faceIndex < 1.18 ? "Round-face pattern — definition is buried under soft tissue. Leanness is the master lever here." :
      "Balanced length-to-width.",
    issueSlugs: faceIndex < 1.18 ? ["facial-puffiness", "body-fat"] : [],
  });

  // ── pixel-based metrics (need the un-annotated canvas) ──
  if (ctx) {
    // 13 · Skin clarity — texture (local luminance variation) + tone evenness
    const patchSize = faceW * 0.09;
    const patches = [LM.rCheekSkin, LM.lCheekSkin, LM.foreheadSkin].map((i) => {
      const p = px(i);
      return samplePatch(ctx, p.x, p.y, patchSize, imgW, imgH);
    });
    const texture = (patches.reduce((s, p) => s + p.std / Math.max(1, p.mean), 0) / patches.length) * 100;
    const meanLum = patches.reduce((s, p) => s + p.mean, 0) / patches.length;
    const tone =
      (Math.sqrt(patches.reduce((s, p) => s + (p.mean - meanLum) ** 2, 0) / patches.length) /
        Math.max(1, meanLum)) * 100;
    const skinValue = 0.65 * texture + 0.35 * tone;
    const skinScore = band(-skinValue, -6, 0, 2.5);
    if (meanLum < 60)
      warnings.push("Low light — skin reading is unreliable in this photo.");
    add({
      id: "skin-clarity", name: "Skin Clarity (est.)",
      display: `${Math.max(0, Math.min(100, 100 - (skinValue - 4) * 6)).toFixed(0)}%`,
      ideal: "75%+",
      score: skinScore, weight: 1.1,
      note: skinScore >= 8 ? "Even texture and tone — skin is carrying you." :
        skinScore >= 6 ? "Some texture or unevenness reads on camera. A basic actives routine moves this fast." :
        "Texture/tone variation is visible — this is the most fixable metric on the list.",
      issueSlugs: skinScore < 7 ? ["skin-clarity", "skin-texture"] : [],
    });

    // 14 · Brow density — brow-vs-forehead contrast + physical thickness
    const browPairs: [number, number][] = [];
    R_BROW_UPPER.forEach((u, i) => browPairs.push([u, R_BROW_LOWER[i]]));
    L_BROW_UPPER.forEach((u, i) => browPairs.push([u, L_BROW_LOWER[i]]));
    const thicknessPx =
      browPairs.reduce((s, [u, l]) => s + dist(px(u), px(l)), 0) / browPairs.length;
    const browThickness = thicknessPx / eyeWidth;
    // sample the middle segments of each brow (upper/lower landmark pairs)
    const browMidPairs: [number, number][] = [
      [66, 65], [105, 52], [63, 53],
      [296, 295], [334, 282], [293, 283],
    ];
    const browLum =
      browMidPairs.reduce((s, [u, l]) => {
        const m = mid(px(u), px(l));
        return s + samplePatch(ctx, m.x, m.y, thicknessPx * 0.8, imgW, imgH).mean;
      }, 0) / browMidPairs.length;
    const foreLum =
      browMidPairs.reduce((s, [u]) => {
        const p = px(u);
        return s + samplePatch(ctx, p.x, p.y - thicknessPx * 2, thicknessPx * 0.8, imgW, imgH).mean;
      }, 0) / browMidPairs.length;
    const contrast = ((foreLum - browLum) / Math.max(1, foreLum)) * 100;
    const browScore = Math.min(10, 0.7 * band(contrast, 38, 100, 5) + 0.3 * band(browThickness, 0.22, 0.5, 0.04));
    add({
      id: "brow-density", name: "Brow Density (est.)",
      display: `${Math.max(0, contrast).toFixed(0)}%`,
      ideal: "38%+ contrast",
      score: browScore, weight: 0.9,
      note: browScore >= 8 ? "Full, dense brows — strong eye-area frame." :
        browScore >= 6 ? "Brows read slightly light. Density is one of the highest-ROI fixes — minoxidil on the tails is the standard play." :
        "Brows read sparse or light on camera. Density protocols show results in 8–12 weeks.",
      issueSlugs: browScore < 7 ? ["thin-brows"] : [],
    });
  }

  const totalWeight = metrics.reduce((s, m) => s + m.weight, 0);
  const weightedMean = metrics.reduce((s, m) => s + m.score * m.weight, 0) / totalWeight;
  // with the harsh band(), raw weighted means cluster ~7.5–9 for real faces;
  // steep linear stretch so the overall actually differentiates AND runs harsh:
  // junk ~3, average ~5–6, strong ~7, near-perfect required to break 9
  const overall = Math.max(2.9, Math.min(9.4, 2.4 * weightedMean - 14.0));

  return {
    overall,
    tier: tierFor(overall),
    metrics,
    warnings,
    // raw (un-rotated) pixel coords so lines land on the actual photo
    overlay: {
      rEyeOuter: px(LM.rEyeOuter), rEyeInner: px(LM.rEyeInner), lEyeInner: px(LM.lEyeInner), lEyeOuter: px(LM.lEyeOuter),
      rCheek: px(LM.rCheek), lCheek: px(LM.lCheek), rGonion: px(LM.rGonion), lGonion: px(LM.lGonion),
      nasion: px(LM.nasion), subnasale: px(LM.subnasale), chin: px(LM.chin), foreheadTop: px(LM.foreheadTop),
      rBrowMedial: px(LM.rBrowMedial), rBrowTail: px(LM.rBrowTail), lBrowMedial: px(LM.lBrowMedial), lBrowTail: px(LM.lBrowTail),
      rCheekSkin: px(LM.rCheekSkin), lCheekSkin: px(LM.lCheekSkin), foreheadSkin: px(LM.foreheadSkin),
      skinPatchR: faceW * 0.09,
    },
  };
}
