/**
 * Types & Contracts for Claude GSAP Motion Design Lab Studio Engine (Engine XXIX)
 * Replicating the 1584x2016 11:14 Motion Design Lab Dashboard.
 */

export type MotionLabControlId =
  | 'SPACING'
  | 'TYPOGRAPHY'
  | 'MOTION_BLUR'
  | 'EASING'
  | 'FOLLOW_THROUGH'
  | 'ANTICIPATION';

export interface MotionLabPrincipleConfig {
  id: string;
  name: MotionLabControlId;
  label: string;
  description: string;
  directingPrompt: string[];
  codeSnippet: string[];
  startFrame: number;
  durationFrames: number;
}

export const MOTION_LAB_PRINCIPLES: MotionLabPrincipleConfig[] = [
  {
    id: '01',
    name: 'SPACING',
    label: 'SPACING',
    description: 'Distance between poses',
    directingPrompt: [
      '> define the key poses',
      '> control travel distance',
      '> inspect the spacing',
      '> keep the edit in co|',
    ],
    codeSnippet: [
      'const frame = useCurrentFrame();',
      'const x = interpolate(',
      '  frame, [0, 60], [0, 600]',
      ');',
      '// spacing controls the travel',
    ],
    startFrame: 0,
    durationFrames: 110,
  },
  {
    id: '02',
    name: 'TYPOGRAPHY',
    label: 'TYPOGRAPHY',
    description: 'Scale / tracking / line breaks',
    directingPrompt: [
      '> make the title readable',
      '> set scale and tracking',
      '> choose the line breaks',
      '> hold the final word|',
    ],
    codeSnippet: [
      'const delay = index * 3;',
      'const y = spring({',
      '  frame: frame - delay, fps',
      '});',
      '// keep the title readable',
    ],
    startFrame: 110,
    durationFrames: 115,
  },
  {
    id: '05',
    name: 'FOLLOW_THROUGH',
    label: 'FOLLOW-THROUGH',
    description: 'Secondary parts settle later',
    directingPrompt: [
      '> move the body first',
      '> let the tail follow',
      '> delay the secondary part',
      '> tune th|',
    ],
    codeSnippet: [
      'const lag = 6;',
      'const tailFrame = frame - lag;',
      'const tail = spring({',
      '  frame: tailFrame, fps',
      '});',
    ],
    startFrame: 225,
    durationFrames: 115,
  },
  {
    id: '06',
    name: 'ANTICIPATION',
    label: 'ANTICIPATION',
    description: 'Prepare before the main move',
    directingPrompt: [
      '> prepare the main action',
      '> add a short pullback',
      '> release the movement',
      '> hold the final pose|',
    ],
    codeSnippet: [
      'const scaleY = interpolate(',
      '  frame, [0, 6, 12], [1, .8, 1]',
      ');',
      '// prepare, release, settle',
      '// keep the final pose clear',
    ],
    startFrame: 340,
    durationFrames: 116,
  },
];
