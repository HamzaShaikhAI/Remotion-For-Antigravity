export interface FleetCommand {
  action: 'edit' | 'slice' | 'render' | 'publish';
  theme: string;
  subject?: string;
  audio?: string;
  duration?: number;
  accel?: 'nvenc' | 'amf' | 'qsv' | 'cpu';
  options: Record<string, string | number | boolean>;
}

/**
 * Fleet Commander Engine (Discord / Telegram Autonomous Command Dispatcher)
 * Parses natural language and bot commands (e.g. `!edit combat Zenitsu audio="dark drift"`)
 * into Remotion composition input properties and automated execution tasks.
 */
export function parseFleetCommand(rawInput: string): FleetCommand {
  const clean = rawInput.trim();
  const parts = clean.split(/\s+/);
  const commandWord = parts[0].startsWith('!') ? parts[0].slice(1) : parts[0];

  const result: FleetCommand = {
    action: (commandWord as FleetCommand['action']) || 'edit',
    theme: 'anime-phonk',
    options: {},
  };

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes('=')) {
      const [key, ...valParts] = part.split('=');
      const val = valParts.join('=').replace(/^["']|["']$/g, '');
      if (key === 'audio') result.audio = val;
      else if (key === 'duration') result.duration = parseFloat(val);
      else if (key === 'accel') result.accel = val as FleetCommand['accel'];
      else result.options[key] = val;
    } else {
      if (!result.subject && i === 2) {
        result.subject = part;
      } else if (i === 1) {
        result.theme = part;
      }
    }
  }

  return result;
}
