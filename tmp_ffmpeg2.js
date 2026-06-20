import { FFmpeg } from './node_modules/@ffmpeg/ffmpeg/dist/esm/index.js';
import { Worker } from 'worker_threads';

globalThis.Worker = Worker;
if (!globalThis.self) globalThis.self = globalThis;
if (!globalThis.btoa) globalThis.btoa = str => Buffer.from(str, 'binary').toString('base64');
if (!globalThis.atob) globalThis.atob = str => Buffer.from(str, 'base64').toString('binary');

let keepAlive = setInterval(() => {}, 1000);
(async () => {
  try {
    const ffmpeg = new FFmpeg({ log: true });
    console.log('created');
    await ffmpeg.load();
    console.log('loaded', ffmpeg.loaded);
    clearInterval(keepAlive);
    process.exit(0);
  } catch (error) {
    console.error('load error', error);
    clearInterval(keepAlive);
    process.exit(1);
  }
})();
