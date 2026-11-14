/**
 * AI Sound Effect Triggering (Visual Foley Auto-Mount)
 *
 * Computer vision telemetry scanner that detects visual event frames
 * (sword slash, explosion, foot stomp, lightning arc) and auto-mounts matching procedural WAV Foley.
 */

export interface VisualFoleyEvent {
  detectedEventType: 'sword_clash' | 'energy_charge' | 'sonic_boom' | 'thunder_strike' | 'footstep';
  frame: number;
  confidence: number;
  intensityScale: number;
}

export class VisualFoleyTrigger {
  public static mapEventToPreset(eventType: string): string {
    switch (eventType) {
      case 'sword_clash':
        return 'sword_clash';
      case 'thunder_strike':
      case 'lightning':
        return 'thunder_strike';
      case 'energy_charge':
        return 'energy_charge';
      case 'sonic_boom':
      default:
        return 'sonic_boom';
    }
  }
}
