const DIMENSIONS = 384;
const tokenPattern = /[a-z0-9]+/g;
function hash(value:string, seed:number){let h=seed|0;for(let i=0;i<value.length;i++){h=Math.imul(h^value.charCodeAt(i),16777619)}return h>>>0}
export function localEmbedding(text:string):number[]{
 const vector=Array<number>(DIMENSIONS).fill(0); const words=(text.toLowerCase().match(tokenPattern)??[]);
 for(let i=0;i<words.length;i++){const word=words[i];for(const feature of [word,`${words[i-1]??""}_${word}`,`${word}_${words[i+1]??""}`]){const a=hash(feature,2166136261),b=hash(feature,2246822519);vector[a%DIMENSIONS]+=(b&1)?1:-1;}}
 const norm=Math.sqrt(vector.reduce((sum,x)=>sum+x*x,0))||1;return vector.map(x=>Number((x/norm).toFixed(7)));
}
export const vectorLiteral=(values:number[])=>`[${values.join(",")}]`;
export function chunkText(text:string,maxChars=1200,overlap=180):string[]{const clean=text.replace(/\r/g,"").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();if(!clean)return[];const chunks=[];let at=0;while(at<clean.length){let end=Math.min(clean.length,at+maxChars);if(end<clean.length){const split=Math.max(clean.lastIndexOf("\n\n",end),clean.lastIndexOf(". ",end));if(split>at+maxChars*.55)end=split+1;}chunks.push(clean.slice(at,end).trim());if(end>=clean.length)break;at=Math.max(end-overlap,at+1);}return chunks;}
