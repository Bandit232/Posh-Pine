import fs from 'fs';
import path from 'path';
import CanvasPkg from 'canvas';
const { createCanvas, DOMMatrix, Image, CanvasRenderingContext2D, CanvasGradient, CanvasPattern, ImageData } = CanvasPkg;
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

global.DOMMatrix = DOMMatrix;
global.Image = Image;
global.ImageData = ImageData;
global.HTMLCanvasElement = createCanvas(1, 1).constructor;
global.OffscreenCanvas = createCanvas(1, 1).constructor;
global.CanvasRenderingContext2D = CanvasRenderingContext2D;
global.CanvasGradient = CanvasGradient;
global.CanvasPattern = CanvasPattern;

const pdfPath = 'C:\\Users\\HP\\Downloads\\Photo.pdf';
const outputDir = path.resolve('./public/assets/photo-frames');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const data = new Uint8Array(fs.readFileSync(pdfPath));
const loadingTask = pdfjsLib.getDocument({ data });
const pdf = await loadingTask.promise;
console.log('pages', pdf.numPages);

const CanvasFactory = {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  },
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 2 });
  const canvasAndContext = CanvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
    canvasFactory: CanvasFactory,
  };
  await page.render(renderContext).promise;
  const filePath = path.join(outputDir, `page-${pageNum.toString().padStart(2, '0')}.png`);
  const buffer = canvasAndContext.canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  console.log('wrote', filePath);
}
console.log('render complete');
