import {rData} from './data.js';
let webR, shelter;
export async function initialize(rows, workspace){
 if(webR) {try {webR.close();}catch{}}
 const {WebR}=await import('https://webr.r-wasm.org/v0.6.0/webr.mjs');
 webR=new WebR({channelType:2});
 await webR.init();
 shelter=await new webR.Shelter();
 const response=await fetch('./i101_helpers_homework.R');
 if(!response.ok)throw Error('The R helper file could not be loaded.');
 await webR.evalRVoid(await response.text());
 await webR.evalRVoid(rData(rows));
 if(workspace){await webR.FS.writeFile('/home/web_user/progress.RData',workspace);await webR.evalRVoid('load("/home/web_user/progress.RData", envir = .GlobalEnv)');}
}
export async function execute(code){
 try {
 const result=await shelter.captureR(code,{withAutoprint:true,captureGraphics:{width:1008,height:720,bg:'white'}});
 const errors=result.output.filter(o=>o.type==='error');
 let graph=null;
 if(!errors.length && result.images.length){
  const bitmap=result.images.at(-1);const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;canvas.getContext('2d').drawImage(bitmap,0,0);graph=canvas.toDataURL('image/png');
 }
 result.images.forEach(i=>i.close());
 const output=result.output.map(o=> typeof o.data==='string'?o.data:o.data?.message || JSON.stringify(o.data)).join('\n');
 await webR.evalRVoid('save.image("/home/web_user/progress.RData")');
 const workspace=await webR.FS.readFile('/home/web_user/progress.RData');
 return {graph,output,failed:errors.length>0,workspace};
 }finally{await shelter.purge();}
}
