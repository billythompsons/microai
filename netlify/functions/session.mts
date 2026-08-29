import {json,newSession,sessionHash} from './_shared.mts';
export default async(req:Request)=>{if(req.method!=='POST')return json({error:'Method not allowed'},405);const current=req.headers.get('x-microai-session')||'';if(sessionHash(current))return json({session:current});return json({session:newSession()})}
