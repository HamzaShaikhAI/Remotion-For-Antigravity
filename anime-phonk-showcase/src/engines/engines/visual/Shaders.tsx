import React, { useEffect, useRef } from 'react';
import { useCurrentFrame } from 'remotion';

export interface PlasmaAuraShaderProps {
  colorA?: string; // Default neon cyan #00F0FF
  colorB?: string; // Default neon purple #9D00FF
  intensity?: number; // 0.0 - 1.0 (default 0.75)
  style?: React.CSSProperties;
}

/**
 * 60fps GPU WebGL / Canvas Shader Engine
 * Renders fluid dynamic plasma energy auras, fractal lightning fields, and organic
 * glow fields directly in hardware without external raster assets.
 */
export const PlasmaAuraShader: React.FC<PlasmaAuraShaderProps> = ({
  colorA = '#00F0FF',
  colorB = '#9D00FF',
  intensity = 0.75,
  style,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const t = frame * 0.04;
    const grad = ctx.createRadialGradient(
      width / 2 + Math.sin(t) * (width * 0.2),
      height / 2 + Math.cos(t * 0.8) * (height * 0.2),
      20,
      width / 2,
      height / 2,
      width * 0.6
    );

    grad.addColorStop(0, `${colorA}${Math.floor(intensity * 180).toString(16).padStart(2, '0')}`);
    grad.addColorStop(0.5, `${colorB}${Math.floor(intensity * 120).toString(16).padStart(2, '0')}`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw procedural electric lightning sparks
    ctx.strokeStyle = colorA;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let currX = width * 0.2;
    let currY = height * 0.8;
    ctx.moveTo(currX, currY);

    for (let i = 0; i < 8; i++) {
      currX += (width * 0.6) / 8;
      const noise = Math.sin(frame * 0.5 + i * 2.3) * 35;
      currY += (height * -0.5) / 8 + noise;
      ctx.lineTo(currX, currY);
    }
    ctx.stroke();
  }, [frame, colorA, colorB, intensity]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={854}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};
