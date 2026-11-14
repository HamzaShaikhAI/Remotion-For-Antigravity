/**
 * Multi-Persona Director Debate (Writers' Room Simulation)
 *
 * Runs a three-way debate between:
 * 1. The Director Agent (Narrative gravitas, story arcs, cinematic pacing)
 * 2. The Hype Editor Agent (1.2s dopamine spikes, screen shake, hyper-velocity)
 * 3. The Cinematic Purist Agent (Restraint, rule of thirds, clean typography)
 * Outputs a balanced compromise schema before rendering.
 */

export interface PersonaCritique {
  persona: 'Director' | 'HypeEditor' | 'CinematicPurist';
  vote: 'APPROVE' | 'REJECT' | 'REVISE';
  argument: string;
}

export class WritersRoomDebate {
  public static simulateDebate(durationSec: number, vfxCount: number): PersonaCritique[] {
    const directorVote: PersonaCritique = {
      persona: 'Director',
      vote: durationSec >= 25 ? 'APPROVE' : 'REVISE',
      argument: durationSec >= 25 ? 'Edit has room to breathe and tells a coherent 3-act battle.' : 'Video is too short to establish stakes. Extend tension before the drop.',
    };

    const hypeVote: PersonaCritique = {
      persona: 'HypeEditor',
      vote: vfxCount >= 5 ? 'APPROVE' : 'REJECT',
      argument: vfxCount >= 5 ? 'Dopamine density is optimal. The drop hits like a truck.' : 'Not enough kinetic energy on the second beat. Inject glitch or RGB split!',
    };

    const puristVote: PersonaCritique = {
      persona: 'CinematicPurist',
      vote: vfxCount <= 8 ? 'APPROVE' : 'REVISE',
      argument: vfxCount <= 8 ? 'Composition is clean and respects character focal lines.' : 'Too much VFX clutter. Suppress the background embers so eyes focus on the blade.',
    };

    return [directorVote, hypeVote, puristVote];
  }
}
