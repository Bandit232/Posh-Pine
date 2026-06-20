import fs from 'fs';
import zlib from 'zlib';
import { PDFDocument, PDFName } from 'pdf-lib';
const file = 'C:\\Users\\HP\\Downloads\\Photo.pdf';
const data = fs.readFileSync(file);
const pdfDoc = await PDFDocument.load(data);
const page = pdfDoc.getPages()[0];
const contents = page.node.get(PDFName.of('Contents'));
const contentsObj = pdfDoc.context.lookup(contents);
const raw = contentsObj.contents;
console.log('raw len', raw.length, 'first 50', raw.slice(0,50));
let decoded = raw;
try {
  decoded = zlib.inflateSync(raw);
  console.log('decoded len', decoded.length);
  const txt = decoded.toString('latin1');
  console.log(txt.slice(0,1200));
} catch (e) {
  console.log('decompress failed', e.message);
}
