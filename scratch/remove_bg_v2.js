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
  console.log(`Processing ${width}x${height} image...`);

  // Mask array: 0 = unvisited, 1 = background, 2 = logo/foreground
  const mask = new Uint8Array(width * height);

  // Background threshold: border background color is around max(r,g,b) <= 18
  const BG_THRESHOLD = 18;

  function getMaxColor(x, y) {
    const idx = (y * width + x) * channels;
    return Math.max(data[idx], data[idx + 1], data[idx + 2]);
  }

  // BFS Flood Fill from outer border
  const queue = [];

  // Add all border pixels
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
    const pIdx = y * width + x;

    if (mask[pIdx] !== 0) continue;

    const maxVal = getMaxColor(x, y);

    if (maxVal <= BG_THRESHOLD) {
      mask[pIdx] = 1; // background

      // 4-neighbor expansion
      if (x > 0 && mask[pIdx - 1] === 0) queue.push(x - 1, y);
      if (x < width - 1 && mask[pIdx + 1] === 0) queue.push(x + 1, y);
      if (y > 0 && mask[pIdx - width] === 0) queue.push(x, y - 1);
      if (y < height - 1 && mask[pIdx + width] === 0) queue.push(x, y + 1);
    }
  }

  console.log(`Flood fill marked background pixels.`);

  // Expand background by 1-2 pixels to remove soft dark shadow fringing
  const finalMask = new Uint8Array(mask);
  const BG_EXPAND_THRESHOLD = 28;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pIdx = y * width + x;
      if (mask[pIdx] === 0) {
        // If neighbor is background AND this pixel is dark shadow
        const maxVal = getMaxColor(x, y);
        if (maxVal <= BG_EXPAND_THRESHOLD) {
          let bgNeighbors = 0;
          if (mask[pIdx - 1] === 1) bgNeighbors++;
          if (mask[pIdx + 1] === 1) bgNeighbors++;
          if (mask[pIdx - width] === 1) bgNeighbors++;
          if (mask[pIdx + width] === 1) bgNeighbors++;

          if (bgNeighbors > 0) {
            finalMask[pIdx] = 1; // Mark as background
          }
        }
      }
    }
  }

  const outBuffer = Buffer.from(data);

  // Apply alpha channel transparency
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const pIdx = y * width + x;

      if (finalMask[pIdx] === 1) {
        outBuffer[idx + 3] = 0; // Completely transparent
      } else {
        // Foreground pixel
        const maxVal = getMaxColor(x, y);
        // Check if on edge next to background for smooth alpha anti-aliasing
        let hasBg = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (finalMask[ny * width + nx] === 1) {
                hasBg = true;
                break;
              }
            }
          }
          if (hasBg) break;
        }

        if (hasBg && maxVal < 100) {
          // Calculate anti-aliased edge alpha
          const alpha = Math.min(255, Math.max(0, Math.round((maxVal - 15) * (255 / 60))));
          outBuffer[idx + 3] = alpha;
        } else {
          outBuffer[idx + 3] = 255; // Fully opaque
        }
      }
    }
  }

  // Trim empty margins and save high quality PNG
  await sharp(outBuffer, { raw: { width, height, channels } })
    .trim({ threshold: 5 })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved clean transparent logo to ${outputPath}`);
}

removeBackground().catch(console.error);
