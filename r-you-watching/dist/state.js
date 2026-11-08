import {investigations} from './content.js';
export function blankVersion(code='',initialized=true){return {code,graph:null,graphCode:null,output:'',initialized};}
export function newInvestigations(){return investigations.map(l=>({basic:blankVersion(l.starter),custom:blankVersion('',false),answers:{}}));}
export function newState(){return {version:2,step:0,name:'',show:null,rows:[],investigations:newInvestigations(),workspace:null};}
const previousStarters=["# Create a histogram using hist().\n# Use the rating column from rated_episodes.\n","# Inspect episode order, episode labels, and ratings.\n# Create a line graph of rating against episode_order.\n# Use the rated_episodes data frame.\n","# Sample several nonempty episode summaries.\n# Choose four words or short phrases.\n\n# Create four TRUE/FALSE columns with grepl().\n# Count descriptions mentioning each term with sum().\n\n# Build word_counts with word and count columns.\n# Use bar_graph() to graph your table.\n"];
export function restoreState(saved){
 if(saved?.version===2){
  // Refresh untouched instructional templates only; never rewrite student commands.
  saved.investigations.forEach((item,i)=>{if(item.basic.code===previousStarters[i]&&!item.basic.graph)item.basic.code=investigations[i].starter;});
  return saved;
 }
 if(saved?.version!==1)return newState();
 const state={...newState(),name:saved.name||'',show:saved.show,rows:saved.rows||[],workspace:saved.workspace,retrieved:saved.retrieved,legacyAnswers:saved.answers,legacyNotice:true};
 state.investigations.forEach((item,i)=>{item.basic={...blankVersion(saved.codes?.[i]||investigations[i].starter),graph:saved.graphs?.[i]||null,graphCode:saved.graphCode?.[i]||null};});
 // Only carry answers across when the revised question asks the same thing.
 state.investigations[0].answers.concentration=saved.answers?.[0]?.[0]||'';
 state.investigations[1].answers.standout=saved.answers?.[1]?.[1]||'';
 state.investigations[2].answers.most=saved.answers?.[2]?.[0]||'';
 state.investigations[2].answers.themes=saved.answers?.[2]?.[1]||'';
 return state;
}
export function initializeCustom(item){
 if(item.custom.initialized || !item.basic.graph || !item.basic.graphCode)return false;
 item.custom.code=item.basic.graphCode;item.custom.initialized=true;return true;
}
export function recordResult(item,version,code,result){
 const target=item[version];target.output=result.output||'Code ran successfully.';
 if(result.graph&&!result.failed){target.graph=result.graph;target.graphCode=code;}
}
export function finalVersion(item){const kind=item.custom.graph?'custom':'basic';return {kind,...item[kind]};}
export function requiredAnswers(lesson){return lesson.questions.flatMap(q=>q.reason?[q.id,q.id+'Reason']:[q.id]);}
export function answerMissing(lesson,answers){return requiredAnswers(lesson).filter(key=>!answers[key]?.trim());}
