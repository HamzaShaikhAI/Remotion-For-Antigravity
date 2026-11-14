Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

try {
    $synth.SelectVoice("Microsoft Zira Desktop")
} catch {
    Write-Host "Zira not found, using default voice"
}
$synth.Rate = 0

$outDir = "public\audio\neutron_raw"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

$lines = @(
    @{ id = "neutron_01"; text = "Imagine floating in deep space holding an ordinary kitchen teaspoon. Harmless, right? Well, dip that spoon into a neutron star, and things get terrifying." },
    @{ id = "neutron_02"; text = "Because a single teaspoon of this material weighs roughly five billion kilograms. That is the entire mass of Mount Everest, packed into five milliliters." },
    @{ id = "neutron_03"; text = "How can anything be this dense? It all starts when a massive star runs out of fuel. Without outward nuclear pressure, gravity violently crushes the entire core inward." },
    @{ id = "neutron_04"; text = "In everyday atoms, ninety-nine percent of the volume is completely empty space. But here, electrons are hammered directly into protons, fusing into solid neutrons." },
    @{ id = "neutron_05"; text = "The result is a city-sized atomic nucleus spinning hundreds of times per second, with surface gravity two hundred billion times stronger than Earth." },
    @{ id = "neutron_06"; text = "If you dropped that teaspoon from just one meter high, it would strike the surface at millions of kilometers per hour, unleashing the fury of a nuclear bomb." },
    @{ id = "neutron_07"; text = "In this bizarre cosmic graveyard, the rules of ordinary matter completely shatter. The universe isn't just strange—it's denser than we can possibly imagine." }
)

foreach ($item in $lines) {
    $filePath = Join-Path $outDir "$($item.id).wav"
    Write-Host "Synthesizing $($item.id)..."
    $synth.SetOutputToWaveFile($filePath)
    $synth.Speak($item.text)
}

$synth.Dispose()
Write-Host "✔ All 7 neutron narration files synthesized successfully!"
