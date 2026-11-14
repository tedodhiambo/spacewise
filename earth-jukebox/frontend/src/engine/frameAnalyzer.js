export function analyzeEicFrame(ctx, width, height, mode) {
  const pixels = ctx.getImageData(0, 0, width, height).data;
  let totalSignal = 0;
  let weightedX = 0;
  let sampleCount = 0;

  // Sample every 16th pixel (stride of 64 bytes) for zero-lag performance
  for (let i = 0; i < pixels.length; i += 64) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    let signal = 0;

    if (mode === 'heat') {
      // Red/Orange = warm (+), Blue = cool (-)
      signal = Math.max(0, r - b);
    } else if (mode === 'co2') {
      // Carbon plumes glow bright red/orange/yellow
      signal = r * 0.7 + g * 0.3;
    } else if (mode === 'ice') {
      // Sea ice appears as bright white pixels
      const isWhiteIce = r > 180 && g > 180 && b > 180;
      signal = isWhiteIce ? 255 : 0;
    }

    totalSignal += signal;
    sampleCount++;

    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    weightedX += x * signal;
  }

  const avgSignal = totalSignal / sampleCount;
  const normalized = Math.min(Math.max(avgSignal / 180, 0), 1);

  // For sea ice, shrinking ice (lower white pixel count) raises pitch tension
  const finalIntensity = mode === 'ice' ? 1 - normalized : normalized;

  const pan = totalSignal > 0
    ? ((weightedX / totalSignal) / width) * 2 - 1
    : 0;

  return {
    intensity: finalIntensity,
    pan: Math.min(Math.max(pan, -1), 1)
  };
}
