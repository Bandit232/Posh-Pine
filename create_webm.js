import fs from 'fs';
import path from 'path';
import { once } from 'events';
import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gif-encoder';

const framesDir = path.resolve('./public/assets/photo-frames');
const outPath = path.resolve('./public/assets/photo-animation.gif');
const files = fs.readdirSync(framesDir).filter(file => file.endsWith('.jpg')).sort();

if (!files.length) {
  console.error('No frame images found in', framesDir);
  process.exit(1);
}

console.log('Found frames:', files.length);
console.log('Loading first image...');
const firstImg = await loadImage(path.join(framesDir, files[0]));
const sourceWidth = firstImg.width;
const sourceHeight = firstImg.height;
console.log('Source image dimensions:', sourceWidth, 'x', sourceHeight);

const maxDimension = 1200;
const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
const width = Math.round(sourceWidth * scale);
const height = Math.round(sourceHeight * scale);

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const fps = 2;
const delayMs = Math.round(1000 / fps);
const encoder = new GIFEncoder(width, height, { highWaterMark: 1024 * 1024 * 10 });
const writeStream = fs.createWriteStream(outPath);

encoder.on('readable', () => {
  let chunk;
  while ((chunk = encoder.read()) !== null) {
    if (!writeStream.write(chunk)) {
      encoder.pause();
      return;
    }
  }
});

writeStream.on('drain', () => encoder.resume());
writeStream.on('error', error => encoder.emit('error', error));
encoder.on('end', () => writeStream.end());
encoder.on('error', error => {
  console.error('GIF encoder error:', error.message);
  process.exit(1);
});

encoder.setRepeat(0); // loop forever
encoder.setDelay(delayMs);
encoder.setQuality(10);
encoder.writeHeader();

console.log('Generating GIF animation at', outPath);
console.log('Output dimensions:', width, 'x', height);
console.log('Frame delay:', delayMs, 'ms');

for (let i = 0; i < files.length; i++) {
  const filePath = path.join(framesDir, files[i]);
  console.log('Processing', files[i]);
  const img = await loadImage(filePath);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  encoder.addFrame(imageData.data);
}

encoder.finish();
await once(writeStream, 'finish');
console.log('Animation written to', outPath);
