# Conversational Iteration & Live Code Mutation Rules

This rule defines how Antigravity agents conversationally iterate on and mutate Remotion video compositions in real time.

---

## 1. Conversational Refinement Protocol
When the user gives natural language visual feedback (e.g., *"Make the headline bolder, shift the spring entrance by 5 frames, switch to dark charcoal theme"*):
- Apply precise, atomic code modifications using `ConversationalTweakEngine` or direct file editing.
- Never rewrite entire components from scratch when refining existing props; preserve stable keyframe timings and existing asset bindings.
- Check that the modified component maintains deterministic rendering and compiles without TypeScript errors (`npx tsc --noEmit`).

---

## 2. Supported Atomic Tweak Parameters
- **Typography & Font Weight:** Map colloquial terms (`bolder`, `lighter`, `huge`) to numeric font weights (`fontWeight: 900`, `fontWeight: 400`) and relative `rem` / `px` units.
- **Spring Physics:** Translate requests for "snappier" or "bouncier" animation to `stiffness: 180, damping: 18` or `stiffness: 100, damping: 8`.
- **Timing Shifts:** Adjust frame offsets (`frame: frame - N`) to advance or delay layer entrances.
- **Color Themes:** Map descriptive color keywords (`dark charcoal`, `cyberpunk neon`, `pure black`) to tested hex colors (`#121214`, `#00f5ff`, `#000000`).

---

## 3. CLI Helper Integration
Agents and developers can also execute tweaks directly via the CLI:
```bash
rea tweak src/compositions/MyScene.tsx "Make the headline font bolder and shift entrance by 8 frames"
```
