import fs from 'fs';
import { PDFDocument, PDFName, PDFStream } from 'pdf-lib';
const path = 'C:\\Users\\HP\\Downloads\\Photo.pdf';
const data = fs.readFileSync(path);
const pdfDoc = await PDFDocument.load(data);
console.log('pages', pdfDoc.getPageCount());
const pages = pdfDoc.getPages();
for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const node = page.node;
  const contents = node.get(PDFName.of('Contents'));
  const resources = node.get(PDFName.of('Resources'));
  console.log(`page ${i+1} contents raw type:`, contents?.constructor.name);
  console.log(`page ${i+1} resources raw type:`, resources?.constructor.name);
  if (contents) {
    const contentsObj = pdfDoc.context.lookup(contents);
    console.log(' contents object type:', contentsObj.constructor.name);
    console.log(' contents object keys:', Object.keys(contentsObj));
    if (contentsObj && typeof contentsObj.getContents === 'function') {
      const data = contentsObj.getContents();
      console.log(' contents stream head:', data.slice(0,200).toString());
    } else if (contentsObj && contentsObj.contents) {
      const data = contentsObj.contents;
      console.log(' contents stream head:', data.slice(0,200).toString());
    }
  }
  if (resources) {
    const resourcesObj = pdfDoc.context.lookup(resources);
    console.log(' resources object type:', resourcesObj.constructor.name);
    if (resourcesObj.dict) {
      const entries = [...resourcesObj.dict.entries()].map(([k,v]) => [k.value(), v.constructor.name]);
      console.log(' resources entries:', entries);
      const xobj = resourcesObj.dict.get(PDFName.of('XObject'));
      const xobjObj = xobj ? pdfDoc.context.lookup(xobj) : null;
      console.log(' xobject type:', xobjObj && xobjObj.constructor.name);
      if (xobjObj && xobjObj.dict) {
        const xentries = [...xobjObj.dict.entries()].map(([k,v]) => [k.value(), v.constructor.name]);
        console.log(' xobject entries:', xentries);
        const firstEntry = xentries[0];
        if (firstEntry) {
          const imgRef = xobjObj.dict.get(PDFName.of(firstEntry[0].slice(1)));
          const imgObj = imgRef ? pdfDoc.context.lookup(imgRef) : null;
          if (imgObj) {
            console.log(' first XObject image type:', imgObj.constructor.name);
            const subtype = imgObj.dict.get(PDFName.of('Subtype'));
            const filter = imgObj.dict.get(PDFName.of('Filter'));
            const width = imgObj.dict.get(PDFName.of('Width'))?.value;
            const height = imgObj.dict.get(PDFName.of('Height'))?.value;
            console.log(' image subtype', subtype && subtype.value);
            console.log(' image filter', filter && filter.toString());
            console.log(' image width/height', width, height);
          }
        }
      }
    } else {
      console.log(' resources has no dict');
    }
  }
}
const objs = pdfDoc.context.enumerateIndirectObjects();
let imgCount = 0;
for (const [ref, obj] of objs) {
  if (obj instanceof PDFStream) {
    const dict = obj.dict;
    const subtype = dict.get(PDFName.of('Subtype'));
    if (subtype && subtype.value === 'Image') {
      const filter = dict.get(PDFName.of('Filter'));
      console.log('Image', ref.toString(), 'filter', filter && filter.constructor.name, filter && filter.toString());
      imgCount++;
    }
  }
}
console.log('found images', imgCount);
