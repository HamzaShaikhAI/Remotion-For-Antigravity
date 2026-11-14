Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Select Zira or Hazel
try {
    $synth.SelectVoice("Microsoft Zira Desktop")
} catch {
    Write-Host "Zira not found, using default voice"
}
$synth.Rate = 0

$outDir = "public\audio\seismo"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

$lines = @(
    @{ id = "seismo_01"; text = "He put a bronze ball in a dragon's mouth and told the emperor if this ever falls out, run." },
    @{ id = "seismo_02"; text = "The whole court burst out laughing." },
    @{ id = "seismo_03"; text = "You see, there were eight dragons coiled around a giant bronze jar, each holding a ball over a frog's open mouth." },
    @{ id = "seismo_04"; text = "But the emperor had the biggest army in the world and he wasn't about to run from a jar." },
    @{ id = "seismo_05"; text = "Weeks later, a ball fell, but nothing happened. Not even a ripple in the emperor's wine." },
    @{ id = "seismo_06"; text = "Now they laughed even harder." },
    @{ id = "seismo_07"; text = "The emperor called it the world's most expensive toy and threw the inventor out of the city, jar and all." },
    @{ id = "seismo_08"; text = "So he dragged it up a hill outside the walls and lived there alone." },
    @{ id = "seismo_09"; text = "Then one night a ball dropped. Then another. Then all eight at once." },
    @{ id = "seismo_10"; text = "He ran to the city gates screaming for everyone to get out." },
    @{ id = "seismo_11"; text = "Hey, it's the toy guy. Did your frogs get hungry again?" },
    @{ id = "seismo_12"; text = "The guards laughed him all the way back up the hill." },
    @{ id = "seismo_13"; text = "The next morning the palace was a pile of rubble." },
    @{ id = "seismo_14"; text = "Inside the jar hung a heavy pendulum with a rod pointing at each dragon." },
    @{ id = "seismo_15"; text = "The slightest nudge and the pendulum swung into a rod. The rod snapped the dragon's jaw open and the ball dropped." },
    @{ id = "seismo_16"; text = "One ball meant a nudge from far away." },
    @{ id = "seismo_17"; text = "All eight meant the biggest earthquake the empire had ever seen was right underneath them." }
)

foreach ($item in $lines) {
    $filePath = Join-Path $outDir "$($item.id).wav"
    Write-Host "Synthesizing $($item.id)..."
    $synth.SetOutputToWaveFile($filePath)
    $synth.Speak($item.text)
}

$synth.Dispose()
Write-Host "✔ All 17 local audio files synthesized successfully!"
