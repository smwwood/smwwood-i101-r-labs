import {zipSync} from './vendor/fflate.js';
import {investigations} from './content.js';
import {finalVersion,answerMissing} from './state.js';
export function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
export function missingFields(state){
 const missing=[];if(!state.name.trim())missing.push('your name');if(!state.show)missing.push('a selected show');
 investigations.forEach((lesson,i)=>{const item=state.investigations[i],final=finalVersion(item);if(!final.graph)missing.push(`${lesson.short}: run your code to create a graph`);if(answerMissing(lesson,item.answers).length)missing.push(`${lesson.short}: complete all interpretation responses${i===0?', including your prediction reasoning':''}`);if(final.graph&&!final.graphCode?.split('\n').some(line=>line.trim()&&!line.trim().startsWith('#')))missing.push(`${lesson.short}: create a graph with your R commands`);});return missing;
}
export async function makeArchive(state){
 await import('./vendor/jspdf.umd.min.js');
 const {jsPDF}=globalThis.jspdf,pdf=new jsPDF({unit:'pt',format:'letter',compress:true});let y=46,section='R You Watching?';
 const safe=s=>String(s).replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[–—→]/g,'-');
 function page(){pdf.addPage();y=46;pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(0,75,190);pdf.text(safe(section+' / continued'),44,y);y+=25;pdf.setTextColor(23,33,43);}
 function ensure(height){if(y+height>738)page();}
 function text(value,size=10,font='helvetica',bold=false){pdf.setFont(font,bold?'bold':'normal');pdf.setFontSize(size);pdf.setTextColor(23,33,43);const lines=pdf.splitTextToSize(safe(value),524);for(const line of lines){if(y+size*1.35>738){page();pdf.setFont(font,bold?'bold':'normal');pdf.setFontSize(size);}pdf.text(line,44,y);y+=size*1.35;}y+=7;}
 function heading(title){ensure(62);pdf.setFillColor(0,97,255);pdf.rect(44,y-15,524,37,'F');pdf.setFont('helvetica','bold');pdf.setFontSize(16);pdf.setTextColor(255);pdf.text(safe(title),56,y+9);y+=42;}
 pdf.setFillColor(0,97,255);pdf.rect(0,0,612,113,'F');pdf.setFont('helvetica','normal');pdf.setTextColor(255);pdf.setFontSize(10);pdf.text('INFO-I101 / INTERACTIVE HOMEWORK',44,31);pdf.setFontSize(27);pdf.text('R You Watching?',44,67);pdf.setFontSize(11);pdf.setTextColor(223,255,113);pdf.text('Your show. Your data. Your investigation.',44,91);y=140;
 text(`Student: ${state.name}    |    Show: ${state.show.name}`,11,'helvetica',true);
 text(`Aired regular episodes: ${state.rows.length} | Data retrieved: ${state.retrieved||'bundled example'}`,9);
 text('Explore episode ratings and descriptions with R. Create a graph, customize it, and interpret what you see. The graphs and code below are the last successful versions selected for export.',10);
 text('Data: TVmaze (tvmaze.com), CC BY-SA 4.0. Cleaned and filtered episode data; average ratings are available, vote counts are not.',8);
 for(let i=0;i<3;i++){
  const lesson=investigations[i],item=state.investigations[i],final=finalVersion(item);section=lesson.title;
  if(i>0){pdf.addPage();y=48;}
  heading(lesson.title);text(lesson.intro,10);
  text(final.kind==='custom'?'Customized graph':'Basic graph fallback - customization not completed',10,'helvetica',true);
  ensure(309);pdf.addImage(final.graph,'PNG',90,y-3,432,308.57,undefined,'FAST');y+=318;
  ensure(40);text('R code that produced this graph',11,'helvetica',true);text(final.graphCode,9,'courier');
  if(final.code!==final.graphCode)text('The editor was changed after this graph was saved. The code above matches the exported graph.',9);
  ensure(40);text('Interpretation',12,'helvetica',true);
  for(const q of lesson.questions){
   pdf.setFont('helvetica','bold');pdf.setFontSize(10);const qHeight=pdf.splitTextToSize(safe(q.label),524).length*13.5+28;ensure(qHeight);
   text(q.label,10,'helvetica',true);text(item.answers[q.id],10);
   if(q.reason){ensure(40);text('Reasoning',10,'helvetica',true);text(item.answers[q.id+'Reason'],10);}
  }
 }
 for(let p=1;p<=pdf.getNumberOfPages();p++){pdf.setPage(p);pdf.setDrawColor(210,215,220);pdf.line(44,755,568,755);pdf.setFont('helvetica','normal');pdf.setFontSize(8);pdf.setTextColor(80);pdf.text(`R You Watching? | ${p} / ${pdf.getNumberOfPages()}`,44,773);}
 const files={'R_You_Watching_Homework.pdf':new Uint8Array(pdf.output('arraybuffer'))};
 ['01_episode_ratings.png','02_ratings_over_time.png','03_summary_words.png'].forEach((name,i)=>{files[name]=Uint8Array.from(atob(finalVersion(state.investigations[i]).graph.split(',')[1]),c=>c.charCodeAt(0));});
 return new Blob([zipSync(files,{level:6})],{type:'application/zip'});
}
