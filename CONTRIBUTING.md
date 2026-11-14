# Contributing to Remotion Engine for Antigravity (REA)

Thank you for your interest in contributing to REA! This document provides guidelines for contributing code, visual plugins, and documentation.

---

## 🚀 Development Workflow

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/HamzaShaikhAI/Remotion-For-Antigravity.git
   cd Remotion-For-Antigravity
   npm install
   ```

2. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Verify Local Tests:**
   ```bash
   npm test
   node bin/rea-cli.js validate
   ```

---

## 📐 Engineering Guidelines

- **Deterministic Rendering:** Never use `Math.random()` in React component bodies. Derive all particle positions and transitions from `frame` and `useVideoConfig()`.
- **Spring Physics:** Use Remotion's `spring()` or `interpolate()` curves instead of linear CSS transitions.
- **Asset Access:** Reference public assets exclusively using `staticFile('filename.ext')`.
- **Plugin Architecture:** Place modular visual plugins in `src/plugins/<plugin-name>/` with an `index.tsx` component and an `index.ts` re-export pointing explicitly to `./index.tsx`.
- **Memory Hygiene:** Wrap `<Audio>` components inside `<Sequence durationInFrames={...}>` to ensure timely buffer disposal.

---

## 📋 Pull Request Checklist

- [ ] All unit tests pass (`npm test`).
- [ ] Pre-flight asset audits pass (`node bin/rea-cli.js validate`).
- [ ] Code follows TypeScript strict typing conventions.
- [ ] PR includes visual evidence (still poster frame or animated preview).
