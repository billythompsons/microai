import {createHmac,timingSafeEqual} from "node:crypto";
interface Claims{sub:string;workspaceId:string;role:"owner"|"admin"|"member"|"viewer";exp:number}
const sign=(p:string,s:string)=>createHmac("sha256",s).update(p).digest("base64url");
export const issueSession=(c:Claims,s:string)=>{const p=Buffer.from(JSON.stringify(c)).toString("base64url");return `${p}.${sign(p,s)}`};
export const readSession=(t:string,s:string):Claims|null=>{const [p,x]=t.split(".");if(!p||!x)return null;const e=sign(p,s);if(x.length!==e.length||!timingSafeEqual(Buffer.from(x),Buffer.from(e)))return null;const c=JSON.parse(Buffer.from(p,"base64url").toString()) as Claims;return c.exp>Date.now()/1000?c:null};
export default async function handler(){return new Response(JSON.stringify({error:"Authentication UI is not enabled in Phase 1"}),{status:501,headers:{"content-type":"application/json","cache-control":"no-store"}})}
