const sharp = require('sharp');

async function removeBackgroundV3() {
  const inputPath = 'figma_images/logo.PNG';
  const outputPath = 'public/logo.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Processing ${width}x${height} image with V3 algorithm...`);

  // Mask array: 0 = foreground/logo, 1 = background/shadow
  const mask = new Uint8Array(width * height);

  // The logo graphic has a bright white outer rim (RGB > ~110).
  // Everything outside that rim (the background & ground shadow) has max(r,g,b) < ~90.
  // Exception: the speed lines on left and banner at bottom have orange (r > 150, g > 80).
  // So a pixel is foreground if:
  // 1) Brightness > 90
  // OR 2) Has strong color (e.g. Orange: r > 120 and g > 50, or Green: g > 80 and g > r)
  // OR 3) Is inside the logo boundaries (surrounded by white/orange/green rims).

  function isForegroundPixel(r, g, b) {
    const maxVal = Math.max(r, g, b);
    // Bright white/grey rim or letters
    if (maxVal > 85) return true;
    // Orange elements (speed lines, 'ly', banner)
    if (r > 100 && g > 40) return true;
    // Green trees
    if (g > 60 && g > r) return true;
    return false;
  }

  // BFS Flood Fill from outer border: stop whenever we hit a foreground pixel
  const queue = [];

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

    const idx = pIdx * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    if (!isForegroundPixel(r, g, b)) {
      mask[pIdx] = 1; // Mark as background

      if (x > 0 && mask[pIdx - 1] === 0) queue.push(x - 1, y);
      if (x < width - 1 && mask[pIdx + 1] === 0) queue.push(x + 1, y);
      if (y > 0 && mask[pIdx - width] === 0) queue.push(x, y - 1);
      if (y < height - 1 && mask[pIdx + width] === 0) queue.push(x, y + 1);
    }
  }

  console.log(`Flood fill completed.`);

  const outBuffer = Buffer.from(data);

  // Set alpha: background = 0, foreground = 255
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const idx = pIdx * channels;

      if (mask[pIdx] === 1) {
        outBuffer[idx + 3] = 0; // Transparent
      } else {
        outBuffer[idx + 3] = 255; // Fully Opaque
      }
    }
  }

  // Trim transparent padding and save high quality PNG
  await sharp(outBuffer, { raw: { width, height, channels } })
    .trim({ threshold: 5 })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved V3 transparent logo to ${outputPath}`);
}

removeBackgroundV3().catch(console.error);
