import fs from 'fs';
import path from 'path';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const framesDir = path.resolve('./public/assets/photo-frames');
const outPath = path.resolve('./public/assets/photo-animation.mp4');
const files = fs.readdirSync(framesDir).filter(file => file.endsWith('.jpg')).sort();
if (!files.length) {
  throw new Error('No frame images found in ' + framesDir);
}

const ffmpeg = new FFmpeg({ log: true });
await ffmpeg.load();

for (let i = 0; i < files.length; i++) {
  const fileName = files[i];
  const frameName = `frame-${String(i+1).padStart(2, '0')}.jpg`;
  const filePath = path.join(framesDir, fileName);
  const data = fs.readFileSync(filePath);
  ffmpeg.FS('writeFile', frameName, new Uint8Array(data));
  console.log('added frame', frameName);
}

const inputPattern = 'frame-%02d.jpg';
await ffmpeg.run(
  '-framerate', '1',
  '-i', inputPattern,
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-vf', 'scale=640:-2',
  'photo_animation.mp4'
);
const data = ffmpeg.FS('readFile', 'photo_animation.mp4');
fs.writeFileSync(outPath, Buffer.from(data));
console.log('video written to', outPath);
