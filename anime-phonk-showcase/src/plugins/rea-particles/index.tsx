import { useCurrentFrame, useVideoConfig } from 'remotion';
import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  baseX: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export const NeonEmbers: React.FC<{ count?: number; interactive?: boolean }> = ({
  count = 50,
  interactive = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [mouse, setMouse] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Generate deterministic particles using index math (no Math.random leaks)
  const particles: Particle[] = React.useMemo(() => {
    const neonPalette = ['#00f5ff', '#a855f7', '#3b82f6', '#ec4899', '#ffffff'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      baseX: (i * 37) % 100,
      size: 3 + ((i * 13) % 6),
      speed: 1.2 + ((i * 7) % 3.5),
      opacity: 0.3 + ((i * 11) % 0.6),
      color: neonPalette[i % neonPalette.length],
    }));
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => {
        const naturalY = height + 50 - ((frame * p.speed * 2) % (height + 100));
        let horizontalDrift = p.baseX + Math.sin((frame + p.id * 10) * 0.04) * 2.5;
        let verticalOffset = 0;

        // Mouse Repulsion Physics in interactive Studio preview
        if (mouse.x !== null && mouse.y !== null) {
          const particleScreenX = (horizontalDrift / 100) * width;
          const particleScreenY = naturalY;
          const distX = particleScreenX - mouse.x;
          const distY = particleScreenY - mouse.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            horizontalDrift += (distX / distance) * force * 12;
            verticalOffset += (distY / distance) * force * 12;
          }
        }

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${horizontalDrift}%`,
              top: `${naturalY + verticalOffset}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}`,
              opacity: p.opacity,
              transition: 'left 0.05s linear, top 0.05s linear',
            }}
          />
        );
      })}
    </div>
  );
};
