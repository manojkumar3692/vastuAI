import {mkdir,copyFile} from 'node:fs/promises';
const output=new URL('../public/studio/',import.meta.url);
await mkdir(output,{recursive:true});
await copyFile(new URL('../node_modules/pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url),new URL('pdf.worker.min.mjs',output));
