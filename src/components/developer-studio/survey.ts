export type SurveyImage={url:string;width:number;height:number;name:string;pages:number;text:string};
export async function readSurvey(file:File,pageNumber=1):Promise<SurveyImage>{
 if(file.size>25*1024*1024)throw Error('Use a survey file smaller than 25 MB.');
 if(file.type==='application/pdf'||file.name.toLowerCase().endsWith('.pdf')){
  const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/studio/pdf.worker.min.mjs';
  const loading=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())});
  const doc=await loading.promise;
  try{const page=await doc.getPage(Math.min(pageNumber,doc.numPages)),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:Math.min(2600/base.width,2600/base.height)}),canvas=document.createElement('canvas');
   canvas.width=viewport.width;canvas.height=viewport.height;const context=canvas.getContext('2d');if(!context)throw Error('Canvas rendering is unavailable.');
   await page.render({canvas,canvasContext:context,viewport}).promise;const content=await page.getTextContent();
   return{url:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height,name:file.name,pages:doc.numPages,text:content.items.map(i=>'str'in i?i.str:'').join(' ')};
  }finally{await loading.destroy();}
 }
 if(file.type.startsWith('image/')){const url=URL.createObjectURL(file);try{const image=new Image();image.src=url;await image.decode();const canvas=document.createElement('canvas'),scale=Math.min(1,2600/Math.max(image.width,image.height));canvas.width=image.width*scale;canvas.height=image.height*scale;canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);return{url:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height,name:file.name,pages:1,text:''};}finally{URL.revokeObjectURL(url);}}
 throw Error('Choose a PDF or image for tracing. KML / JSON can import coordinates directly. Native DWG and DXF extraction needs a CAD importer.');
}

export type CropBox={x:number;y:number;w:number;h:number};
export async function suggestBoundaries(survey:SurveyImage,crop?:CropBox){
 const {detectOutlines}=await import('./boundary-detection');
 const image=new Image();image.src=survey.url;await image.decode();
 const c=crop||{x:0,y:0,w:1,h:1},scale=Math.min(1,900/Math.max(image.width*c.w,image.height*c.h));
 const canvas=document.createElement('canvas');canvas.width=Math.max(2,Math.round(image.width*c.w*scale));canvas.height=Math.max(2,Math.round(image.height*c.h*scale));
 const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Image analysis is unavailable.');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,image.width*c.x,image.height*c.y,image.width*c.w,image.height*c.h,0,0,canvas.width,canvas.height);
 const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data,ink=new Uint8Array(canvas.width*canvas.height);
 for(let i=0;i<ink.length;i++)ink[i]=(pixels[i*4]*.299+pixels[i*4+1]*.587+pixels[i*4+2]*.114)<170?1:0;
 return detectOutlines(ink,canvas.width,canvas.height).map(s=>({...s,points:s.points.map(p=>({x:(c.x+p.x/canvas.width*c.w)*200,y:(c.y+p.y/canvas.height*c.h)*200*image.height/image.width}))}));
}
