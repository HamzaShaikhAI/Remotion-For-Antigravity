# Vox Editorial & Audio Pacing Guardrails (`vox-editorial.md`)

This specification defines the mandatory tone, pacing, syllabic density, and sound synchronization rules for automated voiceover scripts and Remotion motion graphics pipelines.

---

## 1. Tone & Voice Persona

The Vox editorial voice is **conversational, inquisitive, evidence-driven, and relentlessly clear**. It treats the audience as intelligent peers who appreciate deep technical precision, but abhors pretentious academic jargon and marketing hype.

- **Anchor with Questions:** Start segments with concrete physical anomalies or counter-intuitive puzzles (e.g., *"Why does a $600 graphics card from 2013 suddenly stop running games when the silicon inside is still perfectly healthy?"*).
- **Physicalize the Abstract:** Translate abstract software architectures into tactile physical metaphors (e.g., translation layers as real-time language interpreters, descriptor heaps as physical mailbox racks, bitcode lowering as disassembling and re-machining precision engine parts).
- **Rhythm & Dynamics:** Alternate between dense analytical observations and short, punchy 3-to-5 word conclusions. Never speak in unbroken monotone paragraphs.

---

## 2. Syllabic Density & Delivery Targets

Natural spoken narration requires strict syllable-per-second constraints to allow the viewer's eyes to absorb on-screen diagrams without cognitive overload:

| Metric | Target Window | Maximum Threshold | Notes |
| :--- | :--- | :--- | :--- |
| **Syllable Density** | **3.8 – 4.5 syllables / sec** | 5.0 syllables / sec | Over 5.0 syllables/sec sounds rushed and robotic. |
| **Words Per Minute (WPM)**| **130 – 150 WPM** | 165 WPM | Broadcast documentary baseline. |
| **Words per 10s Scene** | **20 – 25 words** | 28 words | Leaves visual breathing room for motion graphics. |
| **Max Sentence Length** | **14 – 20 words** | 24 words | Break long sentences with em-dashes or periods. |

---

## 3. Pacing Markers & Remotion Audio Synchronization

Audio-first animation requires deterministic timecodes. Visual animations MUST synchronize to the voiceover timestamps rather than forcing audio into arbitrary visual durations:

```
Scene Timeline (30fps example):
[Frame 0..9]    -> 0.3s Pre-roll visual lead-in (silence / ambient riser)
[Frame 10..N]   -> Voice narration track active (<Audio src={staticFile('...')} />)
[Frame N..N+15] -> 0.5s Post-speech breathing buffer (visual dwell before cut)
```

### Key Audio Trigger Rules:
1. **Pre-Roll Buffer (0.3s / 9-10 frames):** Always grant 9–10 frames of motion setup before speech begins so graphic cards and titles establish presence.
2. **Post-Roll Breathing Buffer (0.5s / 15 frames):** Never cut a scene the instant speech ends. Always extend `<Series.Sequence durationInFrames={exactVoiceFrames + 15}>` to allow reverb tails to decay naturally.
3. **SFX Placement & Ducking:**
   - Visual pop-ins: Mount `rea sfx pop` at exact graphic entrance frame (`frame === 15`).
   - Kinetic camera sweeps / wipes: Mount `rea sfx whoosh` 3 frames before visual midpoint.
   - Volume hierarchy: Voiceover at `0dB` (`volume={1.0}`), background music ducked to `-18dB` (`volume={0.15}`), and UI SFX at `-12dB` (`volume={0.25}`).

---

## 4. Banned Cliché Phrasing & Words

The following phrases dilute authority and are **strictly banned** in REA voice scripts:

### Banned Fluff & Hyperbole:
- ❌ *"In today's fast-paced world"* / *"In the modern era"*
- ❌ *"Game changer"* / *"Revolutionary breakthrough"*
- ❌ *"Delve into"* / *"Dive deep"* / *"Unpack this"*
- ❌ *"At the end of the day"* / *"Needless to say"*
- ❌ *"A testament to"* / *"Pushing the boundaries"*
- ❌ *"Furthermore, it is important to note that"*

### Banned Weak Fillers:
- ❌ *"Basically"* / *"Actually"* / *"Literally"* / *"Virtually"*
- ❌ *"Just imagine"* / *"Believe it or not"*

---

## 5. Automated CLI Validation Rules (`rea validate-script`)

When `rea` compiles or validates a narration script:
1. **Syllable Count Audit:** Count total syllables $\div$ duration. Flag warning if $> 4.8$ or $< 3.2$.
2. **Cliché Scanner:** Scan text case-insensitively against the banned phrase blacklist. Abort compilation if violations are detected.
3. **Punctuation Pacing:** Ensure every comma introduces an estimated 0.25s pause, and periods introduce a 0.5s pause in calculated duration estimations.
