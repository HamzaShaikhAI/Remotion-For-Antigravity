import React from 'react';
import { Composition } from 'remotion';
import {
  AnimePhonkShort,
  animePhonkShortSchema,
} from './compositions/AnimePhonkShort';
import { ZenitsuVsKilluaShowdown } from './compositions/ZenitsuVsKilluaShowdown';
import { ZenitsuVsKilluaShowdownV2 } from './compositions/ZenitsuVsKilluaShowdownV2';
import { GodTierEngineShowcase } from './compositions/GodTierEngineShowcase';
import { HollywoodIntuitionMaster } from './compositions/HollywoodIntuitionMaster';
import { DiagramComposition } from './compositions/Diagram_flowchart';
import { GeneratedSAASComposition } from './compositions/Generated_saas';
import { KineticMapRoute } from './engines/geo';
import { IsometricTechShowcase } from './engines/three';
import { CyberpunkFpvDive } from './compositions/CyberpunkFpvDive';
import { KineticLyricVideo } from './compositions/KineticLyricVideo';
import { ClaudeSkillsShowcase } from './compositions/ClaudeSkillsShowcase';
import { WhimsicalGardenShowcase } from './compositions/WhimsicalGardenShowcase';
import { OneConversationFilm } from './compositions/OneConversationFilm';
import { LocalAiVsCloud } from './compositions/LocalAiVsCloud';
import { ParadoxOfFocus } from './compositions/ParadoxOfFocus';
import { ZhangHengSeismoscopeShort } from './compositions/ZhangHengSeismoscopeShort';
import { NeutronStarExplainer } from './compositions/NeutronStarExplainer';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Kurzgesagt-Inspired 2D Explainer (Neutron Stars · 60s @ 60fps) */}
      <Composition
        id="NeutronStarExplainer"
        component={NeutronStarExplainer}
        durationInFrames={3600}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 9:16 Ricks Clips 2.5D Cinematic Short (Zhang Heng Seismoscope - 132 AD) */}
      <Composition
        id="ZhangHengSeismoscopeShort"
        component={ZhangHengSeismoscopeShort}
        durationInFrames={1950}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 9:16 REA V4.0 Master Cinematic Short (The Paradox of Focus) */}
      <Composition
        id="ParadoxOfFocus"
        component={ParadoxOfFocus}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 9:16 Minimal Tech Short (Local AI vs Cloud) */}
      <Composition
        id="LocalAiVsCloud"
        component={LocalAiVsCloud}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 16:9 Cinematic 65s Finale Short Film (Use Case 3) */}
      <Composition
        id="OneConversationFilm"
        component={OneConversationFilm}
        durationInFrames={1950}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 9:16 Vertical 24s Whimsical Garden Showcase */}
      <Composition
        id="WhimsicalGardenShowcase"
        component={WhimsicalGardenShowcase}
        durationInFrames={1440}
        fps={60}
        width={1080}
        height={1920}
      />

      {/* 9:16 Vertical 20s Claude Skills Showcase */}
      <Composition
        id="ClaudeSkillsShowcase"
        component={ClaudeSkillsShowcase}
        durationInFrames={1200}
        fps={60}
        width={1080}
        height={1920}
      />

      {/* 16:9 Maximalist Kinetic Lyric Video (Use Case 2) */}
      <Composition
        id="KineticLyricVideo"
        component={KineticLyricVideo}
        durationInFrames={2412}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 16:9 Cinematic Hyperspeed Cyberpunk FPV Drone Dive */}
      <Composition
        id="CyberpunkFpvDive"
        component={CyberpunkFpvDive}
        durationInFrames={240}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 16:9 Landscape Interactive Map & Flight Route */}
      <Composition
        id="GeographicMapRoute"
        component={KineticMapRoute}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          origin: { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
          destination: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
          title: 'Trans-Pacific AI Pipeline Latency',
        }}
      />

      {/* 1:1 Square 3D Isometric Core Showcase */}
      <Composition
        id="Isometric3dCore"
        component={IsometricTechShowcase}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          cubeSize: 240,
          neonColor: '#38bdf8',
          label: 'REA 3D INFERENCE',
        }}
      />

      {/* 16:9 Landscape SVG Architecture & Data Flow */}
      <Composition
        id="ArchitectureFlowchart"
        component={DiagramComposition}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 16:9 Landscape Generative SaaS Product Demo */}
      <Composition
        id="GenerativeSaasDemo"
        component={GeneratedSAASComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="HollywoodIntuitionMaster"
        component={HollywoodIntuitionMaster}
        durationInFrames={1800}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="GodTierEngineShowcase"
        component={GodTierEngineShowcase}
        durationInFrames={360}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="ZenitsuVsKilluaShowdownV2"
        component={ZenitsuVsKilluaShowdownV2}
        durationInFrames={1920}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="ZenitsuVsKilluaShowdown"
        component={ZenitsuVsKilluaShowdown}
        durationInFrames={840}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnimePhonkShort"
        component={AnimePhonkShort}
        durationInFrames={720}
        fps={60}
        width={1080}
        height={1920}
        schema={animePhonkShortSchema}
        defaultProps={{
          audioFile: 'audio/active-phonk.mp3',
          dropFrame: 210,
          freezeDuration: 48,
          variant: 'chad',
          hookTitle: 'LIMIT BREAKER',
          dropCaption: 'COLDEST MOMENT',
          accentColor: '#00f5ff',
          useExternalClips: true,
          gameplayMode: 'none',
        }}
      />
    </>
  );
};
