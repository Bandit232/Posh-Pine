import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName, PDFDict, PDFStream } from 'pdf-lib';

const pdfPath = 'C:\\Users\\HP\\Downloads\\Photo.pdf';
const outputDir = path.resolve('./public/assets/photo-frames');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const data = fs.readFileSync(pdfPath);
const pdfDoc = await PDFDocument.load(data);
const pages = pdfDoc.getPages();

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const resourcesRef = page.node.get(PDFName.of('Resources'));
  const resources = pdfDoc.context.lookup(resourcesRef);
  const xobjRef = resources.dict.get(PDFName.of('XObject'));
  const xobj = pdfDoc.context.lookup(xobjRef);
  console.log('page', i+1, 'xobj type', xobj && xobj.constructor.name, 'entries', xobj && [...xobj.dict.entries()].map(([k]) => k.value()));
  if (!xobj || !xobj.dict) continue;
  for (const [key, ref] of xobj.dict.entries()) {
    const name = key.value();
    const imgObj = pdfDoc.context.lookup(ref);
    console.log(' page', i+1, 'xobj', name, 'obj type', imgObj && imgObj.constructor.name);
    if (!imgObj || !imgObj.dict || typeof imgObj.contents === 'undefined') continue;
    const subtype = imgObj.dict.get(PDFName.of('Subtype'));
    console.log('  subtype', subtype && subtype.toString());
    if (!subtype || subtype.toString() !== '/Image') continue;
    const filter = imgObj.dict.get(PDFName.of('Filter'));
    const filterValue = filter ? filter.toString() : 'none';
    let ext = 'bin';
    const imgBytes = imgObj.contents;
    if (filterValue === '/DCTDecode') {
      ext = 'jpg';
    } else if (filterValue === '/JPXDecode') {
      ext = 'jp2';
    } else if (filterValue === '/FlateDecode') {
      ext = 'png';
    }
    const outPath = path.join(outputDir, `page-${(i+1).toString().padStart(2,'0')}-${name.slice(1)}.${ext}`);
    console.log('  writing', outPath, 'bytes', imgBytes?.length, 'filter', filterValue);
    fs.writeFileSync(outPath, imgBytes);
    console.log('saved', outPath, 'filter', filterValue);
  }
}
console.log('done');
