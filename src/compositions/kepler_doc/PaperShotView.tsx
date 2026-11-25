import React from 'react';
import {
  interpolate,
  spring,
  staticFile,
  Img,
} from 'remotion';
import { PAPER_THEMES, paperShadow, smallPaperShadow } from './PaperStyles';

export interface ShotData {
  id: number;
  chapter: number;
  chapterTitle: string;
  title: string;
  narration: string;
  visualType: string;
  theme: string;
  accent: string;
  audioFile: string;
  durationSec: number;
  audioFrames: number;
  durationFrames: number;
  startFrame: number;
  endFrame: number;
}

interface PaperShotViewProps {
  shot: ShotData;
  frameInShot: number;
  fps: number;
}

export const PaperShotView: React.FC<PaperShotViewProps> = ({
  shot,
  frameInShot,
  fps,
}) => {
  const theme = PAPER_THEMES[shot.theme] || PAPER_THEMES.warm_parchment;

  // ---------------------------------------------------------------------------
  // 1. MULTI-STAGE PHYSICAL PAPER STAGGER (Tactile Stop-Motion Paper Craft)
  // ---------------------------------------------------------------------------
  // Stage 1: Main card drops down from desk with bouncy overshoot
  const cardEntrance = spring({
    frame: frameInShot,
    fps,
    config: { damping: 11, stiffness: 140 },
  });

  // Stage 2: Secondary card / photo / diagram drops with slight stagger
  const secondaryEntrance = spring({
    frame: Math.max(0, frameInShot - 7),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // Stage 3: Washi tape strip stamps down across corner with elastic snap
  const tapeEntrance = spring({
    frame: Math.max(0, frameInShot - 14),
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  // Stage 4: Rubber stamp slams down with heavy impact bounce
  const stampEntrance = spring({
    frame: Math.max(0, frameInShot - 22),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // ---------------------------------------------------------------------------
  // 2. HANDHELD CAMERA BREATHING DRIFT (Never static or slideshow-like)
  // ---------------------------------------------------------------------------
  const cameraScale = interpolate(frameInShot, [0, shot.durationFrames], [0.99, 1.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraDriftX = Math.sin(frameInShot / 22) * 6;
  const cameraDriftY = Math.cos(frameInShot / 28) * 4;
  const organicRotation = (shot.id % 2 === 0 ? -1.6 : 1.4) + Math.sin(frameInShot / 18) * 0.25;

  // ---------------------------------------------------------------------------
  // 3. LIVE KINETIC COUNTERS (Dynamic animated hardware specs & numbers)
  // ---------------------------------------------------------------------------
  const countClock = interpolate(frameInShot, [12, 38], [0, 993], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(0);

  const countBandwidth = interpolate(frameInShot, [15, 45], [0, 21.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(1);

  const countCores = interpolate(frameInShot, [10, 32], [0, 384], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(0);

  const countShaders = interpolate(frameInShot, [12, 45], [0, 1420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(0);

  const countStress = interpolate(frameInShot, [10, 50], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(0);

  // ---------------------------------------------------------------------------
  // 4. RENDERING ENGINE (Covers ALL 110 Visual Types — Zero Generic Fallbacks)
  // ---------------------------------------------------------------------------
  const renderVisualContent = () => {
    // =========================================================================
    // BLOCK 1: HARDWARE SPECS & SILICON MACROS
    // =========================================================================
    if (
      shot.visualType === 'hardware_crisis' ||
      shot.visualType === 'hardware_macro' ||
      shot.visualType === 'gt740_vram_spec' ||
      shot.visualType === 'gtx780ti_specs' ||
      shot.visualType === 'silicon_die' ||
      shot.visualType === 'compute_power'
    ) {
      const imgMap: Record<string, string> = {
        hardware_crisis: 'images/kepler_hardware/gt740_isometric_hero.jpg',
        hardware_macro: 'images/kepler_hardware/gt740_pcb_cad_topdown.jpg',
        gt740_vram_spec: 'images/kepler_hardware/gt740_pcie_insertion_macro.jpg',
        gtx780ti_specs: 'images/kepler_hardware/gt740_io_bracket_macro.jpg',
        silicon_die: 'images/kepler_hardware/gt740_pcb_cad_topdown.jpg',
        compute_power: 'images/kepler_hardware/gt740_isometric_hero.jpg',
      };
      const imgSrc = staticFile(imgMap[shot.visualType] || 'images/kepler_hardware/gt740_isometric_hero.jpg');

      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Polaroid Paper Frame */}
          <div
            style={{
              width: '560px',
              background: '#FFFFFF',
              padding: '16px 16px 40px 16px',
              borderRadius: '10px',
              border: '3px solid #E2E8F0',
              boxShadow: paperShadow,
              transform: `rotate(${organicRotation}deg) translateY(${interpolate(cardEntrance, [0, 1], [40, 0])}px) scale(${cardEntrance})`,
              position: 'relative',
            }}
          >
            {/* Washi Tape Accent */}
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                left: '38%',
                width: '140px',
                height: '30px',
                background: 'rgba(245, 158, 11, 0.9)',
                transform: `rotate(-4deg) scale(${tapeEntrance})`,
                boxShadow: smallPaperShadow,
                borderRadius: '2px',
              }}
            />
            <div style={{ width: '100%', height: '420px', overflow: 'hidden', borderRadius: '6px', background: '#0F172A' }}>
              <Img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center', fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '18px', color: '#334155' }}>
              FIGURE {shot.id}: AUTHENTIC KEPLER TESTBED (GK107 SILICON)
            </div>
          </div>

          {/* Paper Technical Spec Sheet with Kinetic Counters */}
          <div
            style={{
              width: '640px',
              background: '#FFFDF9',
              padding: '36px',
              borderRadius: '14px',
              border: `3px solid ${theme.border}`,
              boxShadow: paperShadow,
              transform: `rotate(${-organicRotation * 0.8}deg) translateY(${interpolate(secondaryEntrance, [0, 1], [60, 0])}px)`,
              position: 'relative',
            }}
          >
            {/* Rubber Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                border: '3px solid #DC2626',
                color: '#DC2626',
                padding: '6px 16px',
                fontWeight: '900',
                fontSize: '18px',
                borderRadius: '6px',
                transform: `rotate(-8deg) scale(${stampEntrance})`,
                opacity: stampEntrance > 0.1 ? 1 : 0,
              }}
            >
              TESTBED VERIFIED
            </div>

            <div style={{ background: theme.accentBg, color: theme.accent, padding: '6px 14px', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px', marginBottom: '16px' }}>
              HARDWARE SPECIFICATION LOG
            </div>
            <h3 style={{ fontSize: '34px', fontWeight: '900', color: theme.text, margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              NVIDIA GeForce GT 740
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '18px', color: theme.textMuted }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #CBD5E1', paddingBottom: '6px' }}>
                <span>Silicon Architecture:</span>
                <strong style={{ color: theme.text }}>GK107 (28nm TSMC)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #CBD5E1', paddingBottom: '6px' }}>
                <span>CUDA Cores / SMs:</span>
                <strong style={{ color: '#0284C7', fontFamily: 'Courier New, monospace', fontSize: '20px' }}>{countCores} Cores (2 SMX)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #CBD5E1', paddingBottom: '6px' }}>
                <span>Core Clock Speed:</span>
                <strong style={{ color: '#0284C7', fontFamily: 'Courier New, monospace', fontSize: '20px' }}>{countClock} MHz</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #CBD5E1', paddingBottom: '6px' }}>
                <span>Memory Bandwidth:</span>
                <strong style={{ color: '#D97706', fontFamily: 'Courier New, monospace', fontSize: '20px' }}>{countBandwidth} GB/s</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #CBD5E1', paddingBottom: '6px' }}>
                <span>Native Feature Level:</span>
                <strong style={{ color: '#EF4444' }}>D3D_FEATURE_LEVEL_11_0</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #CBD5E1', paddingBottom: '6px' }}>
                <span>NVIDIA Driver Cutoff:</span>
                <strong style={{ color: '#DC2626' }}>Branch 472.12 (Oct 2021)</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 2: CRASH DIALOG & DIRECTX 12 BARRIER
    // =========================================================================
    if (
      shot.visualType === 'crash_dialog' ||
      shot.visualType === 'hex_error' ||
      shot.visualType === 'driver_lock' ||
      shot.visualType === 'silicon_reject' ||
      shot.visualType === 'crash_flame' ||
      shot.visualType === 'dx12_wall' ||
      shot.visualType === 'ewaste_stats' ||
      shot.visualType === 'api_barrier' ||
      shot.visualType === 'error_code_card'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative' }}>
          {/* Warning Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              background: '#EF4444',
              color: '#FFFFFF',
              padding: '10px 40px',
              fontWeight: '900',
              fontSize: '20px',
              letterSpacing: '2px',
              borderRadius: '6px',
              boxShadow: paperShadow,
              transform: `rotate(-3deg) scale(${tapeEntrance})`,
              zIndex: 10,
            }}
          >
            CRITICAL EXCEPTION: HARDWARE REJECTED
          </div>

          {/* Windows Style Paper Crash Dialog */}
          <div
            style={{
              width: '940px',
              background: '#FFFDF9',
              borderRadius: '14px',
              border: '4px solid #EF4444',
              boxShadow: paperShadow,
              overflow: 'hidden',
              transform: `scale(${cardEntrance}) rotate(${organicRotation * 0.5}deg)`,
              position: 'relative',
            }}
          >
            {/* Crash Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '90px',
                right: '40px',
                border: '4px solid #DC2626',
                color: '#DC2626',
                padding: '8px 24px',
                fontWeight: '900',
                fontSize: '24px',
                borderRadius: '8px',
                transform: `rotate(12deg) scale(${stampEntrance})`,
                opacity: stampEntrance > 0.1 ? 1 : 0,
                zIndex: 20,
              }}
            >
              CRASH TO DESKTOP
            </div>

            {/* Dialog Header */}
            <div style={{ background: '#EF4444', color: '#FFFFFF', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'Courier New, monospace' }}>DirectX 12 Fatal Application Error</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF', opacity: 0.8 }} />
              </div>
            </div>

            {/* Dialog Body */}
            <div style={{ padding: '36px', display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  border: '4px solid #DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: '#DC2626',
                  fontWeight: '900',
                  flexShrink: 0,
                }}
              >
                X
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '26px', color: '#1E293B', fontFamily: 'Georgia, serif' }}>
                  A D3D12-capable graphics card is required.
                </h4>
                <p style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#64748B', lineHeight: '1.5' }}>
                  The application cannot create Direct3D 12 device. Hardware Feature Level 12_0 or Shader Model 6.0 DXIL support was not detected on this physical adapter.
                </p>
                <div style={{ background: '#1E293B', color: '#38BDF8', padding: '18px 22px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '16px', lineHeight: '1.6' }}>
                  <div>HRESULT: 0x887A0005 (DXGI_ERROR_DEVICE_REMOVED)</div>
                  <div style={{ color: '#F87171' }}>REASON: DXGI_ERROR_UNSUPPORTED (D3D_FEATURE_LEVEL_11_0)</div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ background: '#F8FAFC', padding: '16px 36px', borderTop: '2px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button style={{ padding: '10px 24px', borderRadius: '6px', background: '#DC2626', color: '#FFF', fontWeight: 'bold', border: 'none', fontSize: '16px' }}>
                Exit Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 3: ARCHITECTURAL FOUNDATIONS & THREE PILLARS
    // =========================================================================
    // Question Mark Dilemma Card (Shot 11)
    if (shot.visualType === 'question_mark') {
      const dieImg = staticFile('images/kepler_hardware/gt740_pcb_cad_topdown.jpg');
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Silicon Photo Frame */}
          <div style={{ width: '540px', background: '#FFF', padding: '16px 16px 36px 16px', borderRadius: '12px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(${organicRotation}deg) scale(${cardEntrance})` }}>
            <div style={{ width: '100%', height: '380px', overflow: 'hidden', borderRadius: '6px', background: '#0F172A' }}>
              <Img src={dieImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: '14px', textAlign: 'center', fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '17px', color: '#334155' }}>
              GK107 SILICON: FROZEN IN 2021
            </div>
          </div>

          {/* Dilemma Paper */}
          <div style={{ width: '680px', background: '#FFFDF9', padding: '38px', borderRadius: '16px', border: '4px solid #D97706', boxShadow: paperShadow, transform: `rotate(${-organicRotation * 0.7}deg) scale(${secondaryEntrance})`, position: 'relative' }}>
            {/* Giant Question Mark Sticker */}
            <div style={{ position: 'absolute', top: '-24px', right: '36px', width: '64px', height: '64px', borderRadius: '50%', background: '#D97706', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', fontWeight: '900', boxShadow: smallPaperShadow, transform: `scale(${stampEntrance})` }}>
              ?
            </div>
            <div style={{ background: '#FEF3C7', color: '#B45309', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
              THE CORE ENGINEERING DILEMMA
            </div>
            <h3 style={{ fontSize: '34px', fontWeight: '900', color: '#1E293B', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Can 2012 Silicon Run 2024 DirectX 12 Games?
            </h3>
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              NVIDIA's official answer was no. The hardware was frozen at D3D 11.0. Modern game engines mandate explicit memory allocators, Shader Model 6.0 DXIL, and bindless descriptors.
            </p>
            <div style={{ background: '#DCFCE7', border: '2px dashed #16A34A', padding: '16px 20px', borderRadius: '10px', fontSize: '17px', color: '#166534', fontWeight: 'bold' }}>
              KeplerBridge Hypothesis: Build an application-local user-space translation proxy that speaks DirectX 12 to games and DirectX 11 to Kepler silicon!
            </div>
          </div>
        </div>
      );
    }

    // Historical DirectX Shift (Shot 12)
    if (shot.visualType === 'd3d_history') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ background: '#0284C7', color: '#FFF', padding: '10px 32px', borderRadius: '30px', fontWeight: '900', fontSize: '20px', letterSpacing: '1px', boxShadow: smallPaperShadow, transform: `scale(${tapeEntrance})` }}>
            DIRECTX ARCHITECTURAL EVOLUTION (2009 – 2024)
          </div>
          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', width: '100%' }}>
            {/* Era 1 */}
            <div style={{ width: '380px', background: '#FFFDF9', padding: '30px', borderRadius: '14px', border: '3px solid #16A34A', boxShadow: paperShadow, transform: `rotate(-2deg) scale(${cardEntrance})` }}>
              <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
                ERA 1: 2009 – 2014
              </div>
              <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 10px 0', fontFamily: 'Georgia, serif' }}>
                DirectX 11 Era
              </h4>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                High-level driver abstraction. The NVIDIA driver managed memory, thread safety, state validation, and shader registers behind the scenes.
              </p>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', fontSize: '14px', color: '#15803D', fontWeight: 'bold' }}>
                ✔ Kepler Architecture Native Home
              </div>
            </div>

            {/* Era 2 */}
            <div style={{ width: '380px', background: '#FFFDF9', padding: '30px', borderRadius: '14px', border: '3px solid #EF4444', boxShadow: paperShadow, transform: `scale(${secondaryEntrance})` }}>
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
                ERA 2: 2015 – 2021
              </div>
              <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 10px 0', fontFamily: 'Georgia, serif' }}>
                DirectX 12 Low-Level
              </h4>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                Console-style explicit control. Games manage command lists, barriers, and descriptor heaps directly. Driver abstraction eliminated.
              </p>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', fontSize: '14px', color: '#DC2626', fontWeight: 'bold' }}>
                ✖ High Complexity & Hardware Demands
              </div>
            </div>

            {/* Era 3 */}
            <div style={{ width: '380px', background: '#FFFDF9', padding: '30px', borderRadius: '14px', border: '3px solid #0284C7', boxShadow: paperShadow, transform: `rotate(2deg) scale(${cardEntrance})` }}>
              <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
                ERA 3: 2021 – PRESENT
              </div>
              <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 10px 0', fontFamily: 'Georgia, serif' }}>
                KeplerBridge Solution
              </h4>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                Zero driver modding. Intercepts D3D12 calls and maps them back to the stable D3D11 driver runtime in user space.
              </p>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', fontSize: '14px', color: '#0284C7', fontWeight: 'bold' }}>
                ✔ Seamless Compatibility Reborn
              </div>
            </div>
          </div>
        </div>
      );
    }

    // DirectX 11 Context vs DirectX 12 Low Level (Shots 13 & 14)
    if (shot.visualType === 'd3d11_context' || shot.visualType === 'd3d12_lowlevel') {
      const isD3D11 = shot.visualType === 'd3d11_context';
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Architecture Stack Card */}
          <div style={{ width: '620px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: `4px solid ${isD3D11 ? '#16A34A' : '#EF4444'}`, boxShadow: paperShadow, transform: `rotate(-1.5deg) scale(${cardEntrance})` }}>
            <div style={{ background: isD3D11 ? '#DCFCE7' : '#FEE2E2', color: isD3D11 ? '#16A34A' : '#DC2626', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              {isD3D11 ? 'DIRECTX 11 EXECUTION MODEL' : 'DIRECTX 12 EXECUTION MODEL'}
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              {isD3D11 ? 'Immediate Context Driver Abstraction' : 'Bare-Metal Command Recording'}
            </h3>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {isD3D11
                ? 'Under DirectX 11, the NVIDIA graphics driver acts as an intelligent governor, automatically serializing draw calls, managing GPU state hazards, and paging VRAM.'
                : 'DirectX 12 removes the governor entirely. The game engine must manually coordinate GPU queues, allocate raw heaps, track resource lifetimes, and insert pipeline barriers.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'Courier New, monospace', fontSize: '15px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <span>Layer 1: </span>
                <strong style={{ color: '#0F172A' }}>Game Engine Core Logic</strong>
              </div>
              <div style={{ background: isD3D11 ? '#DCFCE7' : '#FEF3C7', padding: '12px 16px', borderRadius: '8px', border: `1px solid ${isD3D11 ? '#86EFAC' : '#FDE68A'}` }}>
                <span>Layer 2: </span>
                <strong style={{ color: isD3D11 ? '#15803D' : '#92400E' }}>{isD3D11 ? 'ID3D11DeviceContext (Driver Runtime)' : 'ID3D12CommandList (Manual Recording)'}</strong>
              </div>
              <div style={{ background: '#0F172A', color: '#38BDF8', padding: '12px 16px', borderRadius: '8px' }}>
                <span>Layer 3: </span>
                <strong>NVIDIA Kepler Silicon (GK107)</strong>
              </div>
            </div>
          </div>

          {/* Key Characteristics Spec */}
          <div style={{ width: '580px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(1.5deg) scale(${secondaryEntrance})` }}>
            <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 18px 0', fontFamily: 'Georgia, serif' }}>
              Architectural Takeaway
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', color: '#475569' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: isD3D11 ? '#16A34A' : '#EF4444', fontWeight: 'bold', fontSize: '20px' }}>•</span>
                <span>{isD3D11 ? 'Kepler was designed from the transistor level up around DirectX 11 state-driven pipelines.' : 'DirectX 12 requires hardware descriptor tables that older Kepler chips lack.'}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: isD3D11 ? '#16A34A' : '#EF4444', fontWeight: 'bold', fontSize: '20px' }}>•</span>
                <span>{isD3D11 ? 'Branch 472.12 driver has mature, ultra-stable D3D11 codepaths that never crash.' : 'Direct D3D12 calls cause instant driver panics or silent crashes without a proxy.'}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: isD3D11 ? '#16A34A' : '#EF4444', fontWeight: 'bold', fontSize: '20px' }}>•</span>
                <span>KeplerBridge acts as the translator: converting D3D12 command lists into rock-solid D3D11 immediate context submissions!</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // DXIL Bitcode Mandate (Shot 15)
    if (shot.visualType === 'dxil_bitcode') {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Disassembly Card */}
          <div style={{ width: '640px', background: '#0F172A', padding: '34px', borderRadius: '16px', border: '3px solid #EF4444', boxShadow: paperShadow, color: '#F8FAFC', transform: `rotate(-1deg) scale(${cardEntrance})`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', border: '3px solid #EF4444', color: '#EF4444', padding: '4px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', transform: `rotate(6deg) scale(${stampEntrance})` }}>
              SM 6.0 BITCODE
            </div>
            <div style={{ color: '#38BDF8', fontWeight: 'bold', fontSize: '17px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '16px', fontFamily: 'Courier New, monospace' }}>
              // Shader Model 6.0 DXIL (LLVM 3.7 Container)
            </div>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: '14px', lineHeight: '1.7', color: '#E2E8F0' }}>
              <div style={{ color: '#94A3B8' }}>; Unrecognized by legacy Kepler microcode:</div>
              <div>%res = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)</div>
              <div>%tex = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %res)</div>
              <div>%val = extractvalue %dx.types.ResRet.f32 %tex, 0</div>
              <div style={{ color: '#F87171' }}>; Hardware Driver Error: Unsupported DXIL Bitcode opcode</div>
            </div>
          </div>

          {/* Translation Explanation */}
          <div style={{ width: '560px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(1deg) scale(${secondaryEntrance})` }}>
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              THE SHADER COMPILATION BARRIER
            </div>
            <h4 style={{ fontSize: '28px', fontWeight: '900', color: '#1E293B', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Why D3D12 Games Crash on Launch
            </h4>
            <p style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.6', margin: '0 0 18px 0' }}>
              DirectX 12 replaced Microsoft's legacy DXBC bytecode with DXIL—an LLVM intermediate representation. Kepler drivers (472.12) have no DXIL compiler!
            </p>
            <div style={{ background: '#DCFCE7', border: '2px solid #16A34A', padding: '16px', borderRadius: '10px', fontSize: '16px', color: '#15803D', fontWeight: 'bold' }}>
              KeplerBridge Solution: Built-in LLVM lowering engine deconstructs DXIL bitcode and emits native Shader Model 5.0 DXBC!
            </div>
          </div>
        </div>
      );
    }

    // Swapchain Diagram (Shot 19)
    if (shot.visualType === 'swapchain_diagram') {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ width: '600px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #EF4444', boxShadow: paperShadow, transform: `rotate(-1.5deg) scale(${cardEntrance})` }}>
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              DIRECTX 12 SWAPCHAIN MISMATCH
            </div>
            <h3 style={{ fontSize: '30px', fontWeight: '900', color: '#1E293B', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Modern Flip Model Dilemma
            </h3>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 18px 0' }}>
              DirectX 12 mandates <code>DXGI_SWAP_EFFECT_FLIP_DISCARD</code> and variable refresh flags. Legacy Kepler drivers reject these flags with <code>DXGI_ERROR_INVALID_CALL</code>.
            </p>
            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '14px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#DC2626' }}>
              HRESULT: 0x887A0001<br />
              (DXGI_ERROR_INVALID_CALL)
            </div>
          </div>

          <div style={{ width: '600px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #16A34A', boxShadow: paperShadow, transform: `rotate(1.5deg) scale(${secondaryEntrance})` }}>
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              KEPLERBRIDGE PRESENTATION SANITIZER
            </div>
            <h3 style={{ fontSize: '30px', fontWeight: '900', color: '#1E293B', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Sanitized BitBlt Swapchain
            </h3>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 18px 0' }}>
              KeplerBridge intercepts <code>CreateSwapChainForHwnd</code>, strips unsupported tearing flags, and re-routes buffers to standard DWM composition.
            </p>
            <div style={{ background: '#DCFCE7', border: '2px solid #16A34A', padding: '14px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#15803D', fontWeight: 'bold' }}>
              ✔ DXGI_SWAP_EFFECT_DISCARD<br />
              ✔ Tear-free, stable presentation
            </div>
          </div>
        </div>
      );
    }

    // 3 Pillars Overview (Shot 21)
    if (shot.visualType === 'three_pillars') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ background: '#0284C7', color: '#FFF', padding: '10px 30px', borderRadius: '30px', fontWeight: '900', fontSize: '20px', letterSpacing: '1px', boxShadow: smallPaperShadow, transform: `scale(${tapeEntrance})` }}>
            THE THREE ARCHITECTURAL PILLARS OF KEPLERBRIDGE
          </div>
          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', width: '100%' }}>
            {/* Pillar 1 */}
            <div style={{ width: '370px', background: '#FFFDF9', padding: '30px', borderRadius: '16px', border: '3px solid #EF4444', boxShadow: paperShadow, transform: `rotate(-2deg) scale(${cardEntrance})` }}>
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
                PILLAR 1: TRANSLATION
              </div>
              <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 12px 0', fontFamily: 'Georgia, serif' }}>
                Shader Lowering
              </h4>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Converts modern LLVM-based SM 6.0 DXIL bitcode down to legacy SM 5.0 DXBC bytecode compatible with GK107 execution units.
              </p>
            </div>

            {/* Pillar 2 */}
            <div style={{ width: '370px', background: '#FFFDF9', padding: '30px', borderRadius: '16px', border: '3px solid #0284C7', boxShadow: paperShadow, transform: `scale(${secondaryEntrance})` }}>
              <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
                PILLAR 2: BINDING
              </div>
              <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 12px 0', fontFamily: 'Georgia, serif' }}>
                Root Virtualization
              </h4>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Maps boundless D3D12 descriptor tables onto Kepler's fixed hardware slots: 128 SRVs, 16 CBVs, 16 Samplers, and 8 UAVs.
              </p>
            </div>

            {/* Pillar 3 */}
            <div style={{ width: '370px', background: '#FFFDF9', padding: '30px', borderRadius: '16px', border: '3px solid #16A34A', boxShadow: paperShadow, transform: `rotate(2deg) scale(${cardEntrance})` }}>
              <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '14px', display: 'inline-block', marginBottom: '14px' }}>
                PILLAR 3: PRESENTATION
              </div>
              <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 12px 0', fontFamily: 'Georgia, serif' }}>
                Swapchain Pacing
              </h4>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Sanitizes unsupported modern flip-discard flags into stable presentation models, ensuring tear-free, crash-free display output.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Fixed Slots or Binding Gap Diagram
    if (shot.visualType === 'fixed_slots' || shot.visualType === 'binding_gap' || shot.visualType === 'root_signature') {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ width: '600px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(-1.5deg) scale(${cardEntrance})` }}>
            <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              KEPLER D3D11 HARDWARE SLOT ARCHITECTURE
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Physical Register Constraints
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'Courier New, monospace', fontSize: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #E2E8F0' }}>
                <span>Shader Resource Views (SRV):</span>
                <strong style={{ color: '#0284C7' }}>128 Slots (t0 – t127)</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #E2E8F0' }}>
                <span>Constant Buffer Views (CBV):</span>
                <strong style={{ color: '#16A34A' }}>16 Slots (b0 – b15)</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #E2E8F0' }}>
                <span>Sampler States (SMP):</span>
                <strong style={{ color: '#D97706' }}>16 Slots (s0 – s15)</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #E2E8F0' }}>
                <span>Unordered Access Views (UAV):</span>
                <strong style={{ color: '#EF4444' }}>8 Slots (u0 – u7)</strong>
              </div>
            </div>
          </div>

          <div style={{ width: '600px', background: '#0F172A', padding: '36px', borderRadius: '16px', border: '3px solid #38BDF8', boxShadow: paperShadow, color: '#F8FAFC', transform: `rotate(1.5deg) scale(${secondaryEntrance})` }}>
            <div style={{ color: '#38BDF8', fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '16px' }}>
              // D3D12 Root Signature Translation
            </div>
            <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              DirectX 12 applications expect unbounded descriptor heaps with thousands of simultaneous handles. KeplerBridge flattens them into discrete physical slots on demand:
            </p>
            <div style={{ background: '#1E293B', padding: '16px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#4ADE80' }}>
              void SetRootDescriptorTable(UINT RootIndex, D3D12_GPU_DESCRIPTOR_HANDLE Base) &#123;<br />
              &nbsp;&nbsp;auto& slot = m_bindingTable.Resolve(RootIndex, Base);<br />
              &nbsp;&nbsp;m_d3d11Context-&gt;PSSetShaderResources(slot.index, 1, &slot.srv);<br />
              &#125;
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 4: GITHUB REPO & OPEN SOURCE CODE
    // =========================================================================
    if (
      shot.visualType === 'github_hero' ||
      shot.visualType === 'github_repo_card' ||
      shot.visualType === 'github_star_card' ||
      shot.visualType === 'cmake_terminal' ||
      shot.visualType === 'community_hub' ||
      shot.visualType === 'sha256_stamp'
    ) {
      const githubImg = staticFile('assets/github_keplerbridge_repo.png');
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* GitHub Live Screenshot in Paper Clipboard */}
          <div
            style={{
              width: '680px',
              background: '#FFFDF9',
              borderRadius: '14px',
              border: '3px solid #CBD5E1',
              boxShadow: paperShadow,
              padding: '18px',
              position: 'relative',
              transform: `rotate(${organicRotation}deg) translateY(${interpolate(cardEntrance, [0, 1], [40, 0])}px) scale(${cardEntrance})`,
            }}
          >
            {/* Clipboard Metal Clip */}
            <div
              style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '34px',
                background: '#475569',
                border: '3px solid #1E293B',
                borderRadius: '6px',
                boxShadow: smallPaperShadow,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFF',
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '1px',
              }}
            >
              GITHUB VERIFIED REPO
            </div>

            <div style={{ width: '100%', height: '440px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '12px' }}>
              <Img src={githubImg} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          </div>

          {/* GitHub Metadata Card */}
          <div
            style={{
              width: '580px',
              background: '#FFFDF9',
              padding: '36px',
              borderRadius: '14px',
              border: `3px solid ${theme.border}`,
              boxShadow: paperShadow,
              transform: `rotate(${-organicRotation * 0.7}deg) translateY(${interpolate(secondaryEntrance, [0, 1], [60, 0])}px)`,
              position: 'relative',
            }}
          >
            {/* Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                border: '3px solid #16A34A',
                color: '#16A34A',
                padding: '6px 14px',
                fontWeight: '900',
                fontSize: '16px',
                borderRadius: '6px',
                transform: `rotate(-8deg) scale(${stampEntrance})`,
                opacity: stampEntrance > 0.1 ? 1 : 0,
              }}
            >
              OPEN SOURCE MIT
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '36px' }}>⭐</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '28px', color: theme.text, fontFamily: 'Georgia, serif' }}>
                  HamzaShaikhAI / KeplerBridge
                </h3>
                <span style={{ color: theme.accent, fontSize: '16px', fontWeight: 'bold' }}>github.com/HamzaShaikhAI/KeplerBridge</span>
              </div>
            </div>

            <p style={{ color: theme.textMuted, fontSize: '18px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Open-source Direct3D 12 to Direct3D 11 compatibility translation layer enabling modern gaming on legacy NVIDIA Kepler (GT 740 / GTX 700 series) GPUs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#F1F5F9', padding: '14px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace', fontSize: '16px' }}>
                <span>Latest Release:</span>
                <strong style={{ color: '#0284C7' }}>v0.5.0-rc1</strong>
              </div>
              <div style={{ background: '#F1F5F9', padding: '14px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace', fontSize: '16px' }}>
                <span>Target Architecture:</span>
                <strong style={{ color: '#16A34A' }}>x64 (Win32 DLL)</strong>
              </div>
              <div style={{ background: '#F1F5F9', padding: '14px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace', fontSize: '16px' }}>
                <span>License:</span>
                <strong style={{ color: '#D97706' }}>MIT Open Source</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 5: WIN32 LOADER HIERARCHY & PROXY HOOK
    // =========================================================================
    if (
      shot.visualType === 'loader_hierarchy' ||
      shot.visualType === 'proxy_dll_card' ||
      shot.visualType === 'intercept_code' ||
      shot.visualType === 'model_a_contract' ||
      shot.visualType === 'driver_stability' ||
      shot.visualType === 'com_wrappers' ||
      shot.visualType === 'pipeline_bridge' ||
      shot.visualType === 'dual_perspective' ||
      shot.visualType === 'safety_shield'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Win32 Search Order Paper Flow */}
          <div
            style={{
              width: '620px',
              background: '#FFFDF9',
              padding: '32px',
              borderRadius: '14px',
              border: '3px solid #CBD5E1',
              boxShadow: paperShadow,
              transform: `rotate(${organicRotation}deg) translateY(${interpolate(cardEntrance, [0, 1], [40, 0])}px) scale(${cardEntrance})`,
            }}
          >
            <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              WINDOWS DYNAMIC LINK SEARCH HIERARCHY
            </div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '26px', color: '#0F172A', fontFamily: 'Georgia, serif' }}>
              Why Drop-In Proxies Work
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '16px', fontFamily: 'Courier New, monospace' }}>
              <div style={{ background: '#DCFCE7', border: '2px solid #16A34A', padding: '12px 16px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#15803D' }}>1. .\d3d12.dll (Game Directory)</span>
                <div style={{ color: '#166534', fontSize: '13px', marginTop: '4px' }}>
                  ➜ MATCH FOUND! KeplerBridge proxy intercepts initialization immediately.
                </div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '8px', color: '#64748B' }}>
                <span>2. C:\Windows\System32\d3d12.dll [BYPASSED]</span>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '8px', color: '#64748B' }}>
                <span>3. C:\Windows\System\ [BYPASSED]</span>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '8px', color: '#64748B' }}>
                <span>4. %PATH% Environment Directories [BYPASSED]</span>
              </div>
            </div>
          </div>

          {/* C++ Hooking Snippet */}
          <div
            style={{
              width: '620px',
              background: '#0F172A',
              padding: '30px',
              borderRadius: '14px',
              border: '3px solid #38BDF8',
              boxShadow: paperShadow,
              color: '#F8FAFC',
              fontFamily: 'Courier New, monospace',
              fontSize: '15px',
              lineHeight: '1.6',
              transform: `rotate(${-organicRotation * 0.7}deg) translateY(${interpolate(secondaryEntrance, [0, 1], [60, 0])}px)`,
              position: 'relative',
            }}
          >
            {/* Model A Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                border: '3px solid #38BDF8',
                color: '#38BDF8',
                padding: '4px 12px',
                fontWeight: '900',
                fontSize: '14px',
                borderRadius: '6px',
                transform: `rotate(-6deg) scale(${stampEntrance})`,
                opacity: stampEntrance > 0.1 ? 1 : 0,
              }}
            >
              MODEL A CONTRACT
            </div>

            <div style={{ color: '#38BDF8', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '14px' }}>
              // Interception Hook: src/core/d3d12_proxy.cpp
            </div>
            <div style={{ color: '#F43F5E' }}>HRESULT WINAPI D3D12CreateDevice(</div>
            <div style={{ paddingLeft: '20px' }}>
              IUnknown* <span style={{ color: '#38BDF8' }}>pAdapter</span>,<br />
              D3D_FEATURE_LEVEL <span style={{ color: '#38BDF8' }}>MinimumFeatureLevel</span>,<br />
              REFIID <span style={{ color: '#38BDF8' }}>riid</span>,<br />
              void** <span style={{ color: '#38BDF8' }}>ppDevice</span>
            </div>
            <div style={{ color: '#F43F5E' }}>) &#123;</div>
            <div style={{ paddingLeft: '20px', color: '#4ADE80' }}>
              // Route to Kepler Translation Runtime<br />
              return KeplerBridge::CreateProxyDevice(<br />
              &nbsp;&nbsp;pAdapter,<br />
              &nbsp;&nbsp;D3D_FEATURE_LEVEL_11_0, // Honest Contract<br />
              &nbsp;&nbsp;riid,<br />
              &nbsp;&nbsp;ppDevice<br />
              );
            </div>
            <div style={{ color: '#F43F5E' }}>&#125;</div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 6: SHADER COMPILATION & TRANSLATION ENGINE
    // =========================================================================
    if (
      shot.visualType === 'shader_core' ||
      shot.visualType === 'pso_creation' ||
      shot.visualType === 'llvm_decoder' ||
      shot.visualType === 'int64_lowering' ||
      shot.visualType === 'register_split' ||
      shot.visualType === 'mem2reg_diagram' ||
      shot.visualType === 'dxbc_emitter' ||
      shot.visualType === 'silicon_speed' ||
      shot.visualType === 'disk_cache_folder' ||
      shot.visualType === 'cache_hit_perf' ||
      shot.visualType === 'smooth_frametime' ||
      shot.visualType === 'stutter_graph'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Main Pipeline Step Flow */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            {/* Step 1: DXIL */}
            <div
              style={{
                width: '360px',
                background: '#FFFDF9',
                padding: '28px',
                borderRadius: '14px',
                border: '3px solid #EF4444',
                boxShadow: paperShadow,
                transform: `rotate(-2deg) scale(${cardEntrance})`,
              }}
            >
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', display: 'inline-block', marginBottom: '12px' }}>
                INPUT BITCODE
              </div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#1E293B', fontFamily: 'Georgia, serif' }}>
                Shader Model 6.0 DXIL
              </h4>
              <p style={{ margin: 0, fontSize: '15px', color: '#64748B', lineHeight: '1.5' }}>
                LLVM Bitcode format. Unrecognized by legacy Kepler microcode.
              </p>
            </div>

            {/* Arrow */}
            <div style={{ fontSize: '36px', color: theme.accent, fontWeight: '900' }}>➜</div>

            {/* Step 2: KeplerBridge Translator */}
            <div
              style={{
                width: '400px',
                background: '#FFFDF9',
                padding: '28px',
                borderRadius: '14px',
                border: '4px solid #0284C7',
                boxShadow: paperShadow,
                transform: `scale(${secondaryEntrance})`,
              }}
            >
              <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', display: 'inline-block', marginBottom: '12px' }}>
                TRANSLATION CORE
              </div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#1E293B', fontFamily: 'Georgia, serif' }}>
                Kepler Lowering Engine
              </h4>
              <div style={{ fontSize: '14px', color: '#334155', fontFamily: 'Courier New, monospace', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>• Mem2Reg optimization pass</div>
                <div>• Int64 register splitting</div>
                <div>• Discrete slot mapping</div>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ fontSize: '36px', color: theme.accent, fontWeight: '900' }}>➜</div>

            {/* Step 3: DXBC */}
            <div
              style={{
                width: '360px',
                background: '#FFFDF9',
                padding: '28px',
                borderRadius: '14px',
                border: '3px solid #16A34A',
                boxShadow: paperShadow,
                transform: `rotate(2deg) scale(${cardEntrance})`,
              }}
            >
              <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', display: 'inline-block', marginBottom: '12px' }}>
                OUTPUT BYTECODE
              </div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#1E293B', fontFamily: 'Georgia, serif' }}>
                Shader Model 5.0 DXBC
              </h4>
              <p style={{ margin: 0, fontSize: '15px', color: '#64748B', lineHeight: '1.5' }}>
                Serialized to Direct3D 11 runtime. Executes on Kepler silicon.
              </p>
            </div>
          </div>

          {/* Disk Cache Banner */}
          <div
            style={{
              width: '1180px',
              background: '#FFFDF9',
              padding: '22px 36px',
              borderRadius: '14px',
              border: '2px solid #CBD5E1',
              boxShadow: smallPaperShadow,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <span style={{ fontSize: '36px' }}>📁</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#1E293B' }}>
                  Persistent Shader Disk Cache: <code style={{ color: '#0284C7' }}>kepler_cache/shaders/</code> ({countShaders} Shaders Stored)
                </div>
                <div style={{ fontSize: '15px', color: '#64748B' }}>
                  128-bit hash indexing eliminates in-game compilation stutter completely on warm cache runs.
                </div>
              </div>
            </div>
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
              0 ms Latency Hit
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 7: ROOT SIGNATURE & UAV ROUTING
    // =========================================================================
    if (
      shot.visualType === 'root_tables' ||
      shot.visualType === 'slot_mapping' ||
      shot.visualType === 'uav_routing'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ width: '620px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(-1deg) scale(${cardEntrance})` }}>
            <div style={{ background: '#FEF3C7', color: '#B45309', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              DYNAMIC DESCRIPTOR MAPPING ENGINE
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Root Table Virtualization
            </h3>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Kepler lacks Tier 3 bindless descriptor indexing. KeplerBridge allocates virtual slot ranges and resolves GPU virtual addresses into local D3D11 resource tables:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'Courier New, monospace', fontSize: '15px' }}>
              <div style={{ background: '#F1F5F9', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>RootParam[0] (CBV Table)</span>
                <strong style={{ color: '#0284C7' }}>Mapped to b0..b3</strong>
              </div>
              <div style={{ background: '#F1F5F9', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>RootParam[1] (Texture SRV)</span>
                <strong style={{ color: '#16A34A' }}>Mapped to t0..t31</strong>
              </div>
              <div style={{ background: '#F1F5F9', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>RootParam[2] (Compute UAV)</span>
                <strong style={{ color: '#DC2626' }}>Mapped to u0..u7</strong>
              </div>
            </div>
          </div>

          <div style={{ width: '580px', background: '#0F172A', padding: '36px', borderRadius: '16px', border: '3px solid #38BDF8', boxShadow: paperShadow, color: '#F8FAFC', transform: `rotate(1deg) scale(${secondaryEntrance})` }}>
            <div style={{ color: '#38BDF8', fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '16px' }}>
              // Compute Shader UAV Dispatcher
            </div>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: '15px', lineHeight: '1.6', color: '#E2E8F0' }}>
              <div style={{ color: '#94A3B8' }}>// Direct3D 11 Compute Context Dispatch</div>
              <div>void DispatchCompute(UINT X, UINT Y, UINT Z) &#123;</div>
              <div style={{ paddingLeft: '20px', color: '#38BDF8' }}>FlushUAVBindings();</div>
              <div style={{ paddingLeft: '20px', color: '#4ADE80' }}>m_d3d11Context-&gt;Dispatch(X, Y, Z);</div>
              <div style={{ paddingLeft: '20px', color: '#FBBF24' }}>SynchronizeComputeFences();</div>
              <div>&#125;</div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 8: MEMORY GUARDIAN & TEXTURE CLAMPING
    // =========================================================================
    if (
      shot.visualType === 'vram_meter' ||
      shot.visualType === 'memory_guardian' ||
      shot.visualType === 'texture_downscale' ||
      shot.visualType === 'vram_savings' ||
      shot.visualType === 'frame_pacing_good'
    ) {
      const vramWidth = interpolate(frameInShot, [15, 45], [92, 38], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Left: VRAM Meter */}
          <div style={{ width: '600px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(-1.5deg) scale(${cardEntrance})` }}>
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              AUTONOMOUS MEMORY GUARDIAN
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Dynamic VRAM Clamping
            </h3>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Unreal Engine 4 & 5 allocate 4K uncompressed textures by default, immediately overflowing Kepler's 4GB VRAM buffer. Memory Guardian clamps them dynamically to 1024 max resolution:
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                <span>VRAM Allocation (GT 740 4GB):</span>
                <span style={{ color: vramWidth > 75 ? '#DC2626' : '#16A34A' }}>
                  {((vramWidth / 100) * 4096).toFixed(0)} MB / 4096 MB ({vramWidth.toFixed(0)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '24px', background: '#E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${vramWidth}%`, height: '100%', background: vramWidth > 75 ? 'linear-gradient(90deg, #F87171, #DC2626)' : 'linear-gradient(90deg, #4ADE80, #16A34A)', transition: 'width 0.1s ease' }} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px dashed #CBD5E1', fontSize: '15px', color: '#64748B' }}>
              Result: Zero DXGI_ERROR_OUT_OF_MEMORY crashes during extended gaming sessions.
            </div>
          </div>

          {/* Right: Texture Comparison Box */}
          <div style={{ width: '600px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #0284C7', boxShadow: paperShadow, transform: `rotate(1.5deg) scale(${secondaryEntrance})` }}>
            <h4 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Texture Downscaling Matrix
            </h4>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#FEE2E2', border: '2px solid #EF4444', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#991B1B', fontWeight: 'bold' }}>ORIGINAL ASSET</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#DC2626', margin: '8px 0' }}>4096 × 4096</div>
                <div style={{ fontSize: '14px', color: '#B91C1C' }}>64 MB VRAM / Texture</div>
              </div>
              <div style={{ fontSize: '28px', color: '#0284C7', fontWeight: 'bold' }}>➜</div>
              <div style={{ flex: 1, background: '#DCFCE7', border: '2px solid #16A34A', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#166534', fontWeight: 'bold' }}>CLAMPED ASSET</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#16A34A', margin: '8px 0' }}>1024 × 1024</div>
                <div style={{ fontSize: '14px', color: '#15803D' }}>4 MB VRAM (16× SAVINGS)</div>
              </div>
            </div>
            <div style={{ background: '#0F172A', color: '#38BDF8', padding: '14px 18px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '14px' }}>
              [Profile.Performance] EnableTextureClamping = 1<br />
              MaxTextureResolution = 1024
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 9: DXGI SWAPCHAIN SANITIZATION & PRESENTATION
    // =========================================================================
    if (
      shot.visualType === 'dwm_display' ||
      shot.visualType === 'flip_modes' ||
      shot.visualType === 'swap_sanitizer' ||
      shot.visualType === 'strip_flags' ||
      shot.visualType === 'alttab_occlusion' ||
      shot.visualType === 'restore_success' ||
      shot.visualType === 'stress_chart' ||
      shot.visualType === 'rhythm_sync' ||
      shot.visualType === 'clean_monitor'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '50px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ width: '620px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `rotate(-1deg) scale(${cardEntrance})` }}>
            <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              DXGI SWAPCHAIN SANITIZATION PROTOCOL
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Flip Model Translation
            </h3>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              D3D12 games mandate <code>DXGI_SWAP_EFFECT_FLIP_DISCARD</code> and variable refresh flags that cause immediate blue-screen or hard driver crashes on Kepler Branch 472.12:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', fontFamily: 'Courier New, monospace' }}>
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '12px 16px', borderRadius: '8px', color: '#991B1B' }}>
                ✖ Stripped: DXGI_SWAP_CHAIN_FLAG_ALLOW_TEARING
              </div>
              <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', padding: '12px 16px', borderRadius: '8px', color: '#166534' }}>
                ✔ Replaced: DXGI_SWAP_EFFECT_DISCARD (Legacy BitBlt Pacing)
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px', color: '#475569' }}>
                ✔ Handled: DXGI_STATUS_OCCLUDED during Alt-Tab events
              </div>
            </div>
          </div>

          <div style={{ width: '580px', background: '#FFFDF9', padding: '36px', borderRadius: '16px', border: '3px solid #16A34A', boxShadow: paperShadow, transform: `rotate(1deg) scale(${secondaryEntrance})` }}>
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
              ROCK-SOLID STRESS TEST RESULTS
            </div>
            <h4 style={{ fontSize: '28px', fontWeight: '900', color: '#1E293B', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              Alt-Tab Stress Benchmark
            </h4>
            <div style={{ fontSize: '64px', fontWeight: '900', color: '#15803D', fontFamily: 'Georgia, serif', margin: '10px 0' }}>
              {countStress} / 100 PASS
            </div>
            <p style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
              Tested over 100 rapid desktop minimizes, Alt-Tab switches, and resolution resizes. 0 deadlocks, 0 device-lost events.
            </p>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 10: GAME COMPATIBILITY SHOWCASE & POSTERS
    // =========================================================================
    if (shot.visualType.startsWith('game_poster_') || shot.visualType === 'catalogue_wall') {
      const posterKey = shot.visualType.replace('game_poster_', '');
      const posterFileMap: Record<string, { file: string; title: string; engine: string; fps: string; targetFps: number; status: string; statusBg: string }> = {
        stray: { file: 'stray.jpg', title: 'Stray', engine: 'Unreal Engine 4.27', fps: '28–38 FPS (720p Low)', targetFps: 38, status: 'PLAYABLE VIA PROXY', statusBg: '#16A34A' },
        dmc5: { file: 'dmc5.jpg', title: 'Devil May Cry 5', engine: 'RE Engine (D3D12)', fps: '35–48 FPS (720p Med)', targetFps: 48, status: 'PLAYABLE VIA PROXY', statusBg: '#16A34A' },
        re: { file: 're2_remake.jpg', title: 'Resident Evil 2 / 3 Remake', engine: 'RE Engine (D3D12)', fps: '34–46 FPS (720p Low/Med)', targetFps: 46, status: 'PLAYABLE VIA PROXY', statusBg: '#16A34A' },
        liesofp: { file: 'lies_of_p.jpg', title: 'Lies of P', engine: 'Unreal Engine 4.27', fps: '30–42 FPS (720p Low)', targetFps: 42, status: 'PLAYABLE VIA PROXY', statusBg: '#16A34A' },
        hifi: { file: 'hifi_rush.jpg', title: 'Hi-Fi RUSH', engine: 'Unreal Engine 4.27', fps: '40–55 FPS (720p Low)', targetFps: 55, status: 'EXCELLENT STABILITY', statusBg: '#0284C7' },
        persona: { file: 'persona3_reload.jpg', title: 'Persona 3 Reload / P5R', engine: 'Unreal Engine 4', fps: '45–60 FPS (720p Normal)', targetFps: 60, status: 'PERFECT 60 FPS LOCK', statusBg: '#0284C7' },
        eldenring: { file: 'elden_ring.jpg', title: 'Elden Ring', engine: 'FromSoftware Engine', fps: '24–32 FPS (720p Low)', targetFps: 32, status: 'PLAYABLE VIA PROXY', statusBg: '#16A34A' },
        cyberpunk: { file: 'cyberpunk2077.jpg', title: 'Cyberpunk 2077', engine: 'REDengine 4 (D3D12)', fps: '18–25 FPS (720p Low + FSR)', targetFps: 25, status: 'PLAYABLE (TARGETED PATH)', statusBg: '#D97706' },
        hades2: { file: 'hades2.jpg', title: 'Hades II', engine: 'Custom Engine (D3D12)', fps: '50–60 FPS (1080p)', targetFps: 60, status: 'BUTTERY 60 FPS', statusBg: '#16A34A' },
      };

      const game = posterFileMap[posterKey] || {
        file: 'stray.jpg',
        title: 'Marquee Title',
        engine: 'DirectX 12 Game Engine',
        fps: '30+ FPS (720p)',
        targetFps: 30,
        status: 'PLAYABLE VIA KEPLERBRIDGE',
        statusBg: '#16A34A',
      };
      const posterSrc = staticFile(('assets/game_posters/' + game.file) as string);
      const animatedFps = interpolate(frameInShot, [15, 45], [0, game.targetFps], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }).toFixed(0);

      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '60px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Authentic Steam Library Poster */}
          <div
            style={{
              width: '380px',
              height: '570px',
              background: '#FFFFFF',
              padding: '14px',
              borderRadius: '14px',
              border: '3px solid #CBD5E1',
              boxShadow: paperShadow,
              transform: `rotate(${organicRotation}deg) scale(${cardEntrance})`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Washi Tape Corner */}
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-25px',
                width: '110px',
                height: '26px',
                background: 'rgba(239, 68, 68, 0.85)',
                transform: `rotate(45deg) scale(${tapeEntrance})`,
                boxShadow: smallPaperShadow,
              }}
            />
            <Img src={posterSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          </div>

          {/* Paper Compatibility Spec Badge with Live FPS counter */}
          <div
            style={{
              width: '740px',
              background: '#FFFDF9',
              padding: '40px',
              borderRadius: '16px',
              border: `4px solid ${theme.border}`,
              boxShadow: paperShadow,
              transform: `rotate(${-organicRotation * 0.7}deg) translateY(${interpolate(secondaryEntrance, [0, 1], [50, 0])}px)`,
              position: 'relative',
            }}
          >
            {/* Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '32px',
                right: '32px',
                border: `3px solid ${game.statusBg}`,
                color: game.statusBg,
                padding: '6px 16px',
                fontWeight: '900',
                fontSize: '16px',
                borderRadius: '6px',
                transform: `rotate(-6deg) scale(${stampEntrance})`,
                opacity: stampEntrance > 0.1 ? 1 : 0,
              }}
            >
              {game.status}
            </div>

            <div style={{ background: game.statusBg, color: '#FFFFFF', padding: '6px 18px', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px', marginBottom: '18px' }}>
              COMPATIBILITY BENCHMARK
            </div>

            <h3 style={{ fontSize: '44px', fontWeight: '900', color: theme.text, margin: '0 0 10px 0', fontFamily: 'Georgia, serif' }}>
              {game.title}
            </h3>

            <div style={{ fontSize: '20px', color: '#64748B', marginBottom: '26px' }}>
              Engine: <strong style={{ color: theme.text }}>{game.engine}</strong>
            </div>

            <div style={{ background: '#F8FAFC', border: '2px dashed #CBD5E1', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', color: '#64748B', marginBottom: '6px' }}>TARGET HARDWARE BENCHMARK (GT 740 4GB DDR3)</div>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#0284C7', fontFamily: 'Georgia, serif' }}>
                {game.fps} <span style={{ fontSize: '22px', color: '#16A34A', fontFamily: 'Courier New, monospace' }}>({animatedFps} FPS Live Peak)</span>
              </div>
            </div>

            <div style={{ fontSize: '17px', color: theme.textMuted, lineHeight: '1.6' }}>
              Tested and validated under KeplerBridge v0.5.0-rc1 proxy with descriptor virtualization and swapchain pacing.
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 11: PALWORLD NATIVE -DX11 CRITICAL WARNING
    // =========================================================================
    if (
      shot.visualType === 'warning_tape' ||
      shot.visualType === 'ue51_barrier' ||
      shot.visualType === 'dx11_switch_card' ||
      shot.visualType === 'palworld_perf_card'
    ) {
      const palworldPoster = staticFile('assets/game_posters/palworld.jpg');
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '54px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Palworld Poster with Yellow Hazard Ribbon */}
          <div
            style={{
              width: '380px',
              height: '570px',
              background: '#FFFFFF',
              padding: '14px',
              borderRadius: '14px',
              border: '4px solid #EF4444',
              boxShadow: paperShadow,
              transform: `rotate(${organicRotation}deg) scale(${cardEntrance})`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Img src={palworldPoster} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
            {/* Warning Stamp Overlay */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '-10%',
                width: '120%',
                background: 'rgba(220, 38, 38, 0.95)',
                color: '#FFF',
                textAlign: 'center',
                padding: '14px 0',
                fontWeight: '900',
                fontSize: '20px',
                letterSpacing: '2px',
                transform: `rotate(-20deg) scale(${stampEntrance})`,
                boxShadow: paperShadow,
              }}
            >
              DO NOT RUN VIA D3D12
            </div>
          </div>

          {/* Detailed Explainer Paper */}
          <div
            style={{
              width: '740px',
              background: '#FFFDF9',
              padding: '40px',
              borderRadius: '16px',
              border: '4px solid #EF4444',
              boxShadow: paperShadow,
              transform: `rotate(${-organicRotation * 0.6}deg) translateY(${interpolate(secondaryEntrance, [0, 1], [50, 0])}px)`,
            }}
          >
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 16px', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px', marginBottom: '18px' }}>
              CRITICAL GAMER ADVISORY: PALWORLD (UE 5.1)
            </div>

            <h3 style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', margin: '0 0 14px 0', fontFamily: 'Georgia, serif' }}>
              Why D3D12 Mode Fails on Kepler
            </h3>

            <p style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Palworld uses Unreal Engine 5.1, strictly mandating Feature Level 12_0 and Tier 3 bindless descriptor indexing. Kepler hardware cannot physically execute this path.
            </p>

            {/* The Solution Box */}
            <div style={{ background: '#DCFCE7', border: '3px solid #16A34A', padding: '22px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#15803D', marginBottom: '10px' }}>
                THE OFFICIAL FIX: USE NATIVE -DX11 SWITCH
              </div>
              <div style={{ background: '#1E293B', color: '#4ADE80', padding: '14px 18px', borderRadius: '8px', fontFamily: 'Courier New, monospace', fontSize: '20px', fontWeight: 'bold' }}>
                Palworld.exe -dx11
              </div>
              <div style={{ fontSize: '15px', color: '#166534', marginTop: '10px' }}>
                (Steam: Right Click Game ➜ Properties ➜ Launch Options ➜ type <code>-dx11</code>)
              </div>
            </div>

            <div style={{ fontSize: '18px', color: '#334155', fontWeight: 'bold' }}>
              Delivers <span style={{ color: '#15803D' }}>30–45 FPS</span> directly on GT 740 via native Direct3D 11 engine path!
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 12: SETUP & HOW TO USE STEP-BY-STEP GUIDE
    // =========================================================================
    if (
      shot.visualType === 'setup_intro' ||
      shot.visualType === 'download_zip' ||
      shot.visualType === 'zip_contents' ||
      shot.visualType === 'game_folder_view' ||
      shot.visualType === 'ue4_path_card' ||
      shot.visualType === 'backup_file' ||
      shot.visualType === 'copy_paste_paper' ||
      shot.visualType === 'launch_button' ||
      shot.visualType === 'log_terminal' ||
      shot.visualType === 'log_success_card' ||
      shot.visualType === 'offline_shield' ||
      shot.visualType === 'uninstall_rollback'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          {/* Header Step Badge */}
          <div
            style={{
              background: '#0284C7',
              color: '#FFF',
              padding: '10px 28px',
              borderRadius: '30px',
              fontWeight: '900',
              fontSize: '20px',
              letterSpacing: '1px',
              boxShadow: smallPaperShadow,
              transform: `scale(${tapeEntrance})`,
            }}
          >
            STEP-BY-STEP GAMER SETUP GUIDE
          </div>

          {/* Main Visualized Target Game Folder */}
          <div
            style={{
              width: '1080px',
              background: '#FFFDF9',
              borderRadius: '16px',
              border: '3px solid #CBD5E1',
              boxShadow: paperShadow,
              overflow: 'hidden',
              transform: `scale(${cardEntrance}) rotate(${organicRotation * 0.4}deg)`,
            }}
          >
            {/* Windows Explorer Style Header */}
            <div style={{ background: '#F1F5F9', padding: '16px 28px', borderBottom: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '24px' }}>📁</span>
              <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '18px', color: '#334155' }}>
                C:\Games\TargetGame\Binaries\Win64\
              </span>
            </div>

            {/* Folder Contents with Highlighted Files */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '24px' }}>🎮</span>
                  <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#1E293B', fontFamily: 'Courier New, monospace' }}>Game.exe</span>
                </div>
                <span style={{ color: '#64748B', fontSize: '15px' }}>64-bit Target Executable</span>
              </div>

              {/* KeplerBridge Proxy Highlight */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: '#E0F2FE', borderRadius: '10px', border: '2px solid #0284C7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '24px' }}>⚡</span>
                  <span style={{ fontWeight: '900', fontSize: '20px', color: '#0369A1', fontFamily: 'Courier New, monospace' }}>d3d12.dll</span>
                </div>
                <span style={{ background: '#0284C7', color: '#FFF', padding: '6px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                  COPY FROM RELEASE ZIP
                </span>
              </div>

              {/* KeplerBridge INI Highlight */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: '#FEF3C7', borderRadius: '10px', border: '2px solid #D97706' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '24px' }}>⚙️</span>
                  <span style={{ fontWeight: '900', fontSize: '20px', color: '#92400E', fontFamily: 'Courier New, monospace' }}>kepler_bridge.ini</span>
                </div>
                <span style={{ background: '#D97706', color: '#FFF', padding: '6px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                  COPY CONFIG PROFILE
                </span>
              </div>

              {/* Auto Generated Cache Folder */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', background: '#F0FDF4', borderRadius: '10px', border: '2px dashed #16A34A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '24px' }}>📁</span>
                  <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#166534', fontFamily: 'Courier New, monospace' }}>kepler_cache/</span>
                </div>
                <span style={{ color: '#15803D', fontSize: '14px', fontWeight: 'bold' }}>
                  Auto-created on first launch (contains lowered shader cache)
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 13: CONFIGURATION TUNING (kepler_bridge.ini)
    // =========================================================================
    if (
      shot.visualType === 'ini_editor_card' ||
      shot.visualType === 'auto_detect_switch' ||
      shot.visualType === 'profile_dial' ||
      shot.visualType === 'clamping_toggle' ||
      shot.visualType === 'resolution_slider' ||
      shot.visualType === 'fsr_banner' ||
      shot.visualType === 'upscale_comparison' ||
      shot.visualType === 'vram_2gb_card'
    ) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div
            style={{
              width: '1080px',
              background: '#FFFDF9',
              borderRadius: '14px',
              border: '3px solid #CBD5E1',
              boxShadow: paperShadow,
              overflow: 'hidden',
              transform: `scale(${cardEntrance}) rotate(${organicRotation * 0.4}deg)`,
            }}
          >
            {/* INI Editor Title Bar */}
            <div style={{ background: '#1E293B', color: '#FFF', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '18px', color: '#38BDF8' }}>
                kepler_bridge.ini — Configuration Profile Editor
              </span>
              <span style={{ background: '#0284C7', color: '#FFF', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                SCHEMA V2
              </span>
            </div>

            {/* INI Code View */}
            <div style={{ padding: '28px', background: '#0F172A', color: '#E2E8F0', fontFamily: 'Courier New, monospace', fontSize: '17px', lineHeight: '1.7', overflow: 'hidden' }}>
              <div style={{ color: '#94A3B8' }}>; ==========================================================</div>
              <div style={{ color: '#94A3B8' }}>; KeplerBridge Master Configuration Profile</div>
              <div style={{ color: '#94A3B8' }}>; ==========================================================</div>
              <div style={{ color: '#38BDF8', fontWeight: 'bold' }}>[Configuration]</div>
              <div>EnableProfileAutoDetect = <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>1</span></div>
              <div>ActiveProfile = <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>Performance</span></div>
              <br />
              <div style={{ color: '#38BDF8', fontWeight: 'bold' }}>[Profile.Performance]</div>
              <div>EnableD3D11Translation = <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>1</span></div>
              <div>EnableTextureClamping = <span style={{ color: '#F43F5E', fontWeight: 'bold' }}>1</span>  <span style={{ color: '#94A3B8' }}>; Prevents VRAM exhaustion</span></div>
              <div>MaxTextureResolution = <span style={{ color: '#A78BFA', fontWeight: 'bold' }}>1024</span> <span style={{ color: '#94A3B8' }}>; Slashes 4K textures down to 1024</span></div>
              <div>EnableFSR1Upscaling = <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>1</span>  <span style={{ color: '#94A3B8' }}>; Spatial upscaling for +30% FPS</span></div>
              <div>ImmediateQueueFlush = <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>1</span>  <span style={{ color: '#94A3B8' }}>; Zero-latency draw submission</span></div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // BLOCK 14: ENGINEERING TRUTH, REBIRTH & SUBSCRIBER CALL TO ACTION
    // =========================================================================
    if (
      shot.visualType === 'zero_bloat' ||
      shot.visualType === 'gamer_freedom' ||
      shot.visualType === 'truth_engineering' ||
      shot.visualType === 'bandwidth_comparison' ||
      shot.visualType === 'rebirth_silicon' ||
      shot.visualType === 'official_lab_card' ||
      shot.visualType === 'subscribe_cta'
    ) {
      if (shot.visualType === 'bandwidth_comparison') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
            <div style={{ width: '1080px', background: '#FFFDF9', padding: '40px', borderRadius: '16px', border: '3px solid #CBD5E1', boxShadow: paperShadow, transform: `scale(${cardEntrance}) rotate(${organicRotation}deg)` }}>
              <div style={{ background: '#FEF3C7', color: '#B45309', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>
                HARDWARE REALITY CHECK: MEMORY BANDWIDTH
              </div>
              <h3 style={{ fontSize: '34px', fontWeight: '900', color: '#0F172A', margin: '0 0 20px 0', fontFamily: 'Georgia, serif' }}>
                Bandwidth Comparison Through The Eras
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span>GeForce GT 740 (DDR3 - Our Testbed):</span>
                    <strong style={{ color: '#DC2626' }}>21.3 GB/s</strong>
                  </div>
                  <div style={{ width: '100%', height: '20px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '2.5%', height: '100%', background: '#DC2626' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span>GeForce GTX 780 Ti (Kepler Flagship GDDR5):</span>
                    <strong style={{ color: '#D97706' }}>336.0 GB/s (15× Faster)</strong>
                  </div>
                  <div style={{ width: '100%', height: '20px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '33%', height: '100%', background: '#D97706' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span>GeForce RTX 4090 (Modern GDDR6X):</span>
                    <strong style={{ color: '#16A34A' }}>1,008.0 GB/s (47× Faster)</strong>
                  </div>
                  <div style={{ width: '100%', height: '20px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: '#16A34A' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Official Channel & Call to Action (Shots 109 & 110)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div
            style={{
              width: '1040px',
              background: '#FFFDF9',
              padding: '44px 50px',
              borderRadius: '18px',
              border: '4px solid #0284C7',
              boxShadow: paperShadow,
              textAlign: 'center',
              transform: `scale(${cardEntrance}) rotate(${organicRotation * 0.4}deg)`,
              position: 'relative',
            }}
          >
            {/* Rubber Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '32px',
                border: '3px solid #DC2626',
                color: '#DC2626',
                padding: '6px 16px',
                fontWeight: '900',
                fontSize: '18px',
                borderRadius: '6px',
                transform: `rotate(8deg) scale(${stampEntrance})`,
                opacity: stampEntrance > 0.1 ? 1 : 0,
              }}
            >
              SUBSCRIBE NOW
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Img
                src={staticFile('assets/brand/official_hs_logo.png')}
                style={{ width: '56px', height: '56px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', fontFamily: 'Georgia, serif' }}>
                Hamza Shaikh AI (@HamzaShaikhAI)
              </span>
            </div>

            <h3 style={{ fontSize: '38px', fontWeight: '900', color: '#0284C7', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>
              {shot.title}
            </h3>

            <p style={{ fontSize: '20px', color: '#475569', lineHeight: '1.6', margin: '0 0 28px 0', maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto' }}>
              {shot.narration}
            </p>

            {/* Subscribe Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <div style={{ background: '#DC2626', color: '#FFF', padding: '14px 36px', borderRadius: '30px', fontWeight: '900', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: smallPaperShadow }}>
                <span>▶ SUBSCRIBE ON YOUTUBE</span>
              </div>
              <div style={{ background: '#0F172A', color: '#FFF', padding: '14px 32px', borderRadius: '30px', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: smallPaperShadow }}>
                <span>⭐ STAR ON GITHUB</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // FALLBACK SAFETY (Should never trigger, but guaranteed rich styling)
    // =========================================================================
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '980px',
            background: theme.card,
            padding: '48px',
            borderRadius: '18px',
            border: `4px solid ${theme.border}`,
            boxShadow: paperShadow,
            transform: `scale(${cardEntrance}) rotate(${organicRotation}deg)`,
            textAlign: 'center',
          }}
        >
          <div style={{ background: theme.accentBg, color: theme.accent, padding: '8px 22px', borderRadius: '24px', display: 'inline-block', fontWeight: '900', fontSize: '16px', letterSpacing: '1px', marginBottom: '22px' }}>
            CHAPTER {shot.chapter}: {shot.chapterTitle}
          </div>
          <h2 style={{ fontSize: '46px', fontWeight: '900', color: theme.text, margin: '0 0 22px 0', fontFamily: 'Georgia, serif' }}>
            {shot.title}
          </h2>
          <p style={{ fontSize: '24px', color: theme.textMuted, lineHeight: '1.6', margin: 0, fontFamily: 'Inter, sans-serif' }}>
            {shot.narration}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '40px 80px 140px 80px',
        transform: `scale(${cameraScale}) translate(${cameraDriftX}px, ${cameraDriftY}px)`,
      }}
    >
      {renderVisualContent()}
    </div>
  );
};
