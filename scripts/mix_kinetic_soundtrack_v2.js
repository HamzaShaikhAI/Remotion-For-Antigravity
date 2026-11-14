const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = path.resolve('bin/ffmpeg/ffmpeg.exe');

const vocal1 = path.resolve('public/audio/vocal_01_intro.mp3');
const vocal2 = path.resolve('public/audio/vocal_02_verse.mp3');
const vocal3 = path.resolve('public/audio/vocal_03_chorus.mp3');
const vocal4 = path.resolve('public/audio/vocal_04_bridge.mp3');
const vocal5 = path.resolve('public/audio/vocal_05_outro.mp3');
const bgMusic = path.resolve('public/audio/active-phonk.mp3');
const riser = path.resolve('public/sfx/fpv_riser.wav');
const impact = path.resolve('public/sfx/fpv_impact.wav');
const whoosh = path.resolve('public/sfx/fpv_whoosh.wav');

const outMaster = path.resolve('public/audio/kinetic_master_v2.mp3');

console.log('Synthesizing Master Soundtrack with Authentic Studio Phonk Beat & Stereo Mastering...');

// Offsets in milliseconds:
// Intro: 0 ms
// Verse: 5740 ms
// Chorus: 12150 ms
// Bridge: 26980 ms
// Outro: 34450 ms
// Total duration: 40.2s (40200 ms)

const filter = [
  // Vocal delays and stereo upmix so amix doesn't collapse stereo width
  `[0:a]aresample=48000,aformat=channel_layouts=stereo,adelay=0|0,volume=1.4[v1]`,
  `[1:a]aresample=48000,aformat=channel_layouts=stereo,adelay=5740|5740,volume=1.4[v2]`,
  `[2:a]aresample=48000,aformat=channel_layouts=stereo,adelay=12150|12150,volume=1.5[v3]`,
  `[3:a]aresample=48000,aformat=channel_layouts=stereo,adelay=26980|26980,volume=1.4[v4]`,
  `[4:a]aresample=48000,aformat=channel_layouts=stereo,adelay=34450|34450,volume=1.4[v5]`,
  // Mix vocals together
  `[v1][v2][v3][v4][v5]amix=inputs=5:duration=longest:dropout_transition=0[vocals]`,
  // Authentic Studio Phonk Beat (trimmed to 40.2s, leveled for vocals)
  `[5:a]atrim=0:40.2,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume=0.85[music]`,
  // SFX hits
  `[6:a]aresample=48000,aformat=channel_layouts=stereo,adelay=10000|10000,volume=0.85[sfx_rise1]`,
  `[7:a]aresample=48000,aformat=channel_layouts=stereo,adelay=12150|12150,volume=1.2[sfx_drop1]`,
  `[8:a]aresample=48000,aformat=channel_layouts=stereo,adelay=25000|25000,volume=0.85[sfx_whoosh]`,
  `[7:a]aresample=48000,aformat=channel_layouts=stereo,adelay=26500|26500,volume=1.3[sfx_drop2]`,
  // Master with EBU R128 loudness normalization
  `[vocals][music][sfx_rise1][sfx_drop1][sfx_whoosh][sfx_drop2]amix=inputs=6:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1:LRA=7[out]`
].join(';');

const cmd = `"${ffmpeg}" -y -i "${vocal1}" -i "${vocal2}" -i "${vocal3}" -i "${vocal4}" -i "${vocal5}" -i "${bgMusic}" -i "${riser}" -i "${impact}" -i "${whoosh}" -filter_complex "${filter}" -map "[out]" -c:a libmp3lame -b:a 320k "${outMaster}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('✔ Master soundtrack successfully created at:', outMaster);
} catch (err) {
  console.error('Mix failed:', err);
  process.exit(1);
}
