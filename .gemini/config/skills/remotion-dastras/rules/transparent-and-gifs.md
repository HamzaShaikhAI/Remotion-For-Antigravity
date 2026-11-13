# Transparent Videos, GIFs, and Still Frame Rules

This guide explains how to render videos with transparency (alpha channels), export high-resolution still posters, and compile lightweight animated GIFs in the Antigravity REA ecosystem.

---

## 1. Transparent Videos (Alpha Channel Overlays)

Transparent videos allow motion graphics to be placed over live-action video in editing software (Premiere, Final Cut, DaVinci) or played as overlays in web applications.

### Supported Transparent Codecs:
1. **ProRes 4444 (`.mov`):** Industry standard for professional video editing (macOS & Windows).
2. **WebM VP9 (`.webm`):** Web-optimized transparent video format supported natively by modern browsers.

### Rendering Commands:
```bash
# Render transparent ProRes 4444 MOV:
rea render OverlayComp overlay.mov --codec=prores --prores-profile=4444

# Render transparent WebM VP9:
rea render OverlayComp overlay.webm --codec=vp9
```

### Canvas Transparency Rule:
Do not put a solid background color on `<AbsoluteFill>` or `body` if you want a transparent background.

---

## 2. Animated GIFs (`rea gif`)

For GitHub READMEs, Discord bots, and email newsletters, compile high-quality animated GIFs:

```bash
rea gif <composition-id> [output.gif] [--fps=15]
```
- **Example:** `rea gif MainVideo banner.gif --fps=12`
- **Optimization:** Keep framerates at 12–15 fps and resolutions under 800px width to maintain small file sizes.

---

## 3. High-Resolution Still Frames (`rea still`)

To extract a thumbnail or poster frame without compiling the entire video:

```bash
rea still <composition-id> [output.jpeg] [--frame=N]
```
- **Example:** `rea still DastrasShowcase poster.jpeg --frame=120`
- **Formats Supported:** `jpeg`, `png`
