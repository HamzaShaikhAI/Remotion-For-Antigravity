# REA Editorial Intuition & Taste Architecture

> **Antigravity 2.0 Editorial Intelligence & Restraint Framework**  
> *Teaching autonomous AI video agents taste, restraint, narrative logic, and algorithmic survival to permanently escape the 2-view graveyard.*

---

## 🎭 The Problem: Over-Caffeinated AI Editing

Most automated AI video tools edit like over-caffeinated amateurs:
- They squeeze continuous 50-second masterpieces into 15-second fragments.
- They slice purely on random audio peaks without understanding what characters are doing on screen.
- They vomit every screen shake, chromatic aberration, and glitch effect onto every single beat.
- When everything glows and shakes, nothing feels impactful. The human brain gets fatigued and swipes away.

REA V2.2 introduces the **Intuition Architecture**—teaching the engine how seasoned Hollywood trailer editors think across 4 foundational pillars:

```
                          ┌──────────────────────────────────────────────┐
                          │         REA Intuition & Taste Engine         │
                          └──────────────────────┬───────────────────────┘
                                                 │
            ┌─────────────────────┬──────────────┴───────┬─────────────────────┐
            ▼                     ▼                      ▼                     ▼
 ┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐
 │ I. Narrative Logic  ││II. Timeline Elastic ││III. Aesthetic Restr ││IV. Viral Prediction │
 │   & Continuity      ││   (No 15s Squeeze)  ││   (Stop VFX Vomit)  ││ (Escape 2-View Cem) │
 ├─────────────────────┤├─────────────────────┤├─────────────────────┤├─────────────────────┤
 │• Semantic Scene Graph│• Minimum Viable Dur  │• VFX Budget Matrix  │• Pre-Publish APV Sim │
 │• 180° Action Axis   │• Bezier Micro-Pacing │• Saliency Focal Heat │• Curiosity Gap Hooks │
 │• Emotion & Gaze Match│• 1.2s Inhale Pause   │• Context Color Match │• Vocal Scoop Dynamic │
 │• J-Cuts & L-Cuts    │• Bar-Aligned Music   │• Shutter Motion Blur │• 3 Platform Forks    │
 └─────────────────────┘└─────────────────────┘└─────────────────────┘└─────────────────────┘
```

---

## 🎬 Pillar I: Narrative Logic & Continuity (Story First, Rhythm Second)

### 1. Semantic Scene Graphing (`rea intuition-graph`)
- **CLI:** `rea intuition-graph [--duration=30]`
- **Implementation:** [src/intuition/narrative/SemanticSceneGraph.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/narrative/SemanticSceneGraph.ts)
- **Principle:** Maps the raw footage into an archetypal Hollywood micro-narrative arc:
  $$\text{Taunt / Standoff} \longrightarrow \text{Aura Charge} \longrightarrow \text{Suspense Inhale} \longrightarrow \text{Clash Strike} \longrightarrow \text{Cold Sheathe}$$
  Ensures edits never devolve into arbitrary clip collages.

### 2. Action-Axis Continuity Tracking (The 180° Rule)
- **Implementation:** [src/intuition/narrative/ContinuityTracker.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/narrative/ContinuityTracker.ts)
- **Principle:** Tracks character attack vectors (`left_to_right` vs `right_to_left`). Mathematically flags or horizontally flips jump cuts where a character suddenly switches sides, preserving spatial orientation.

### 3. J-Cuts & L-Cuts (Split Edits)
- **Component:** [src/intuition/narrative/SplitEdits.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/narrative/SplitEdits.tsx)
- **Principle:** Incoming audio (blade clash, dialogue line, riser) leads the visual cut by 12–18 frames, pulling the viewer forward and creating seamless cinematic flow.

### 4. Dialogue-Aware Slicing (Breath Preservation)
- **Implementation:** [src/intuition/narrative/DialogueBoundaryGuard.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/narrative/DialogueBoundaryGuard.ts)
- **Principle:** Mathematically blocks the engine from slicing mid-word or mid-breath. Snaps cut boundaries to natural acoustic pauses.

---

## ⏳ Pillar II: Timeline Elasticity (Preserving Masterpieces)

### 5. Minimum Viable Duration (MVD) Calculator
- **Implementation:** [src/intuition/elasticity/MvdCalculator.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/elasticity/MvdCalculator.ts)
- **Principle:** Analyzes choreographic density. If a clip contains uninterrupted battle choreography, REA rejects short templates and expands the timeline to 28s–45s to let the scene breathe.

### 6. Bezier Time-Remapping (Micro-Pacing)
- **Component:** [src/intuition/elasticity/BezierTimeRemapping.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/elasticity/BezierTimeRemapping.tsx)
- **Principle:** Keeps clips intact with nonlinear velocity ramps: dialogue fast-forwards at 280%, then slams into 30% slow-mo at the exact frame of blade impact.

### 7. The "Breathing Room" Suspense Pause (The Inhale Shot)
- **Component:** [src/intuition/elasticity/BreathingRoom.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/elasticity/BreathingRoom.tsx)
- **Principle:** Enforces 1.0s–1.5s of total visual stillness and dimmed lighting immediately before a massive drop. Contrast creates hype; constant chaos is boring.

---

## 🎨 Pillar III: Aesthetic Restraint (Eliminating VFX Fatigue)

### 8. The VFX Budgeting Matrix (`rea intuition-budget`)
- **CLI:** `rea intuition-budget`
- **Implementation:** [src/intuition/restraint/VfxBudgetMatrix.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/restraint/VfxBudgetMatrix.ts)
- **Principle:** Enforces visual fatigue caps (100 points maximum). If drop #1 uses heavy screen shakes and glitches, drop #2 is strictly restricted to clean, elegant hard cuts.

### 9. Saliency Mapping & Focal Point Preservation
- **Component:** [src/intuition/restraint/SaliencyPreservation.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/restraint/SaliencyPreservation.tsx)
- **Principle:** Generates visual attention heatmaps (character eyes, blades) and pushes subtitles, emojis, and HUD badges into safe zones, never covering the action.

### 10. Optical Flow Motion Blur (180° Shutter)
- **Component:** [src/intuition/restraint/MotionBlurOverlay.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/restraint/MotionBlurOverlay.tsx)
- **Principle:** Applies directional velocity blur to text and floating overlays proportional to camera shake velocity, embedding typography into the physical world.

### 11. Contrast-Adaptive Typography
- **Component:** [src/intuition/restraint/ContrastAdaptiveText.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/restraint/ContrastAdaptiveText.tsx)
- **Principle:** Dynamically samples background luminance: applies heavy black drop-shadows over bright white lightning flashes and strips them over dark backdrops.

---

## 📈 Pillar IV: Viral Prediction & Algorithmic Survival

### 12. Pre-Publish Retention Simulation (`rea intuition-predict`)
- **CLI:** `rea intuition-predict [--duration=30]`
- **Implementation:** [src/intuition/virality/RetentionPredictor.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/virality/RetentionPredictor.ts)
- **Principle:** Simulates second-by-second Average Percentage Viewed (APV) curves and flags Swipe Risk drop-off zones before rendering.

### 13. Curiosity Gap Text Engine (`rea intuition-hooks`)
- **CLI:** `rea intuition-hooks [charA] [charB]`
- **Implementation:** [src/intuition/virality/CuriosityGapHooks.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/virality/CuriosityGapHooks.ts)
- **Principle:** Replaces generic captions with polarizing debate hooks (e.g., *"Killua's Godspeed was undefeated... until 0:12 💀"*), sparking comment velocity.

### 14. Multi-Platform Pacing Forks (`rea intuition-fork`)
- **CLI:** `rea intuition-fork`
- **Implementation:** [src/intuition/virality/MultiPlatformForks.ts](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/intuition/virality/MultiPlatformForks.ts)
- **Principle:** Tailors three distinct cuts from one master project:
  - **TikTok:** 15.0s hyper-speed pace (0.4s cuts, max dopamine).
  - **YouTube Shorts:** 30.0s narrative arc with breathing room and climax payoff.
  - **Instagram Reels:** 20.0s aesthetic polish with color harmony.

---

## 🏆 Flagship Verification Still: `HollywoodIntuitionMaster`

Rendered and visually verified at the exact beat-drop timestamp (Frame 720 / 12.0s):
- **Verified Still Frame:** [still-hollywood-intuition.jpeg](file:///C:/Users/win10/Documents/antigravity-remotion-skills/assets/still-hollywood-intuition.jpeg)
- **Composition Source:** [src/compositions/HollywoodIntuitionMaster.tsx](file:///C:/Users/win10/Documents/antigravity-remotion-skills/src/compositions/HollywoodIntuitionMaster.tsx)
- **Key Features:** Saliency-preserved framing (Killua's glowing Godspeed eyes 100% visible), curiosity gap polarizing hook, and restrained Moyai Chad badge placement.
