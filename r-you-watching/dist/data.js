export const columns = ['name','season','number','episode_order','episode_label','airdate','runtime','rating','summary'];
export function plainText(html) {
 const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
 doc.querySelectorAll('script,style,iframe,object').forEach(el=>el.remove());
 return (doc.body.textContent || '').replace(/\s+/g,' ').trim();
}
export function cleanEpisodes(raw, now = new Date()) {
 return raw.filter(e => Number.isInteger(e.season) && e.season > 0 && Number.isInteger(e.number) && e.number > 0 && (!e.type || e.type === 'regular') && (e.airstamp ? Date.parse(e.airstamp) <= now.getTime() : e.airdate && e.airdate < now.toISOString().slice(0,10)))
 .sort((a,b)=>a.season-b.season || a.number-b.number)
 .map((e,i)=>({name:String(e.name || ''), season:e.season, number:e.number, episode_order:i+1, episode_label:`S${String(e.season).padStart(2,'0')}E${String(e.number).padStart(2,'0')}`,airdate:e.airdate || '', runtime:Number.isFinite(e.runtime)?e.runtime:null, rating:Number.isFinite(e.rating?.average) && e.rating.average>=0 && e.rating.average<=10?e.rating.average:null, summary:plainText(e.summary)}));
}
export function quality(rows) {return {total:rows.length, ratings:rows.filter(e=>e.rating!==null).length, summaries:rows.filter(e=>e.summary.trim()).length,seasons:new Set(rows.map(e=>e.season)).size};}
export function csv(rows) {
 const cell=v=>'"'+String(v??'').replace(/^[=+@\-]/,"'$&").replaceAll('"','""')+'"';
 return '\ufeff'+[columns.join(','),...rows.map(row=>columns.map(c=>cell(row[c])).join(','))].join('\r\n');
}
export async function api(path) {
 let response;
 try {response=await fetch(`https://api.tvmaze.com${path}`,{signal:AbortSignal.timeout(20000)});} catch {throw Error('TVmaze could not be reached. Check your connection, try again, or use the bundled example.');}
 if(response.status===429) throw Error('TVmaze is busy (rate limit). Wait a few seconds, then try again.');
 if(!response.ok) throw Error(`TVmaze could not load this request (${response.status}). Please try another show or the example.`);
 return response.json();
}
export function rData(rows) {
 const numeric=new Set(['season','number','episode_order','runtime','rating']);
 return 'episodes <- data.frame('+columns.map(c=>c+' = '+(rows.length?'c('+rows.map(r=>r[c]===null?'NA_real_':numeric.has(c)?r[c]:JSON.stringify(r[c])).join(',')+')':numeric.has(c)?'numeric()':'character()')).join(',')+', stringsAsFactors = FALSE)\nrated_episodes <- episodes[is.finite(episodes$rating), , drop = FALSE]';
}
