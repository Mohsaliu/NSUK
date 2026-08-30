const sharp = require('sharp');
const fs = require('fs');

async function removeBackground() {
  const inputPath = 'figma_images/logo.PNG';
  const outputPath = 'public/logo.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image dimensions: ${width}x${height}, channels: ${channels}`);

  // Create a 2D array / typed array for alpha mask
  // 0 = unvisited, 1 = background (transparent), 2 = foreground (keep)
  const status = new Uint8Array(width * height);

  // Helper to get pixel RGB
  function getPixelRGB(x, y) {
    const idx = (y * width + x) * channels;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: data[idx + 3]
    };
  }

  // A pixel is considered background if it's dark (near black)
  // Let's check max(r,g,b)
  function isDark(r, g, b) {
    // Dark background threshold: max color value < 45 and max-min difference < 25
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    return maxVal < 50 && (maxVal - minVal) < 30;
  }

  // Queue for BFS flood fill starting from outer border
  const queue = [];

  // Add all border pixels to queue if they are dark
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];

    const pixelIdx = y * width + x;
    if (status[pixelIdx] !== 0) continue;

    const { r, g, b } = getPixelRGB(x, y);

    if (isDark(r, g, b)) {
      status[pixelIdx] = 1; // Mark as background

      // Check 4-neighbors
      if (x > 0 && status[pixelIdx - 1] === 0) { queue.push(x - 1, y); }
      if (x < width - 1 && status[pixelIdx + 1] === 0) { queue.push(x + 1, y); }
      if (y > 0 && status[pixelIdx - width] === 0) { queue.push(x, y - 1); }
      if (y < height - 1 && status[pixelIdx + width] === 0) { queue.push(x, y + 1); }
    }
  }

  console.log(`Flood fill completed. Processed ${head / 2} queue items.`);

  // Apply transparency and smooth anti-aliased edge transition
  const outBuffer = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const pIdx = y * width + x;

      if (status[pIdx] === 1) {
        // Background pixel -> transparent
        outBuffer[idx + 3] = 0;
      } else {
        // Check if near border for smooth anti-aliased edge
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxVal = Math.max(r, g, b);

        // If it's a dark edge pixel near background, fade alpha smoothly
        if (maxVal < 60) {
          // Check if any neighbor is background
          let hasBgNeighbor = false;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (status[ny * width + nx] === 1) {
                  hasBgNeighbor = true;
                  break;
                }
              }
            }
            if (hasBgNeighbor) break;
          }

          if (hasBgNeighbor) {
            // Smooth alpha gradient based on brightness
            const alpha = Math.min(255, Math.max(0, Math.round((maxVal - 10) * (255 / 50))));
            outBuffer[idx + 3] = alpha;
          }
        }
      }
    }
  }

  // Save with sharp, auto-trim transparent margins
  await sharp(outBuffer, { raw: { width, height, channels } })
    .trim({ threshold: 5 })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved transparent logo to ${outputPath}`);
}

removeBackground().catch(err => {
  console.error('Error removing background:', err);
  process.exit(1);
});
