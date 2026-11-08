let database;
async function db() {
 if(database) return database;
 database=await new Promise((resolve,reject)=>{const r=indexedDB.open('r-you-watching',1);r.onupgradeneeded=()=>r.result.createObjectStore('progress');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 return database;
}
export async function readProgress(){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('progress').objectStore('progress').get('assignment');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function writeProgress(state){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('progress','readwrite');tx.objectStore('progress').put(state,'assignment');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
