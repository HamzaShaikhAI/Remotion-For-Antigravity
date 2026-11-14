# Complex SVG Path & Dynamic Diagramming Rules

This rule defines how Antigravity agents construct technical, cloud architecture, and data flow diagrams in Remotion.

---

## 1. Self-Drawing SVG Paths
To animate a line, cable, or complex SVG curve from 0% to 100%:
- Use `strokeDasharray={pathLength}` and interpolate `strokeDashoffset` from `pathLength` to `0`.
- Use the project's native `SelfDrawingSvgPath` component:
  ```tsx
  import { SelfDrawingSvgPath } from '../engines/diagramming';

  <SelfDrawingSvgPath
    pathData="M 100 200 C 250 100, 350 300, 500 200"
    strokeColor="#38bdf8"
    strokeWidth={3}
    startFrame={15}
    durationInFrames={45}
    glow
  />
  ```

---

## 2. Dynamic Architecture Nodes & Traveling Data Packets
When illustrating microservices, distributed clusters, or AI workflows:
- Use `ArchitecturalFlowchart` to define nodes (`id`, `label`, `sublabel`, `x`, `y`, `color`) and connections (`from`, `to`, `curved: true`).
- The engine deterministically renders traveling pulse particles along the Bezier curves without third-party dependencies.

---

## 3. Kinetic Code Walkthroughs
When presenting source code, diffs, or terminal output:
- Use `KineticCodeWalkthrough`.
- Specify `lines: CodeLine[]` with `activeLineRange: [startLine, endLine]`.
- The engine handles typing reveals, syntax styling, dimming inactive lines, and animating callout inspection boxes.
