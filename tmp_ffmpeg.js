import { FFmpeg } from './node_modules/@ffmpeg/ffmpeg/dist/esm/index.js';
import { Worker } from 'worker_threads';

globalThis.Worker = Worker;
await (async () => {
  try {
    const ffmpeg = new FFmpeg({ log: true });
    console.log('created');
    await ffmpeg.load();
    console.log('loaded', ffmpeg.loaded);
  } catch (error) {
    console.error('load error', error);
    process.exit(1);
  }
})();
