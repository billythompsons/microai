import type {ChatChunk,ChatRequest,EmbeddingRequest,EmbeddingResult,ModelProvider,ProviderConfig} from "./types.js";
export class OpenAICompatibleProvider implements ModelProvider {
 readonly id="openai-compatible"; constructor(private config:ProviderConfig){}
 async *streamChat(request:ChatRequest,signal?:AbortSignal):AsyncIterable<ChatChunk>{
  const response=await fetch(`${this.config.baseUrl??"https://api.openai.com/v1"}/chat/completions`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${this.config.apiKey}`,...this.config.headers},body:JSON.stringify({...request,stream:true}),signal});
  if(!response.ok||!response.body) throw new Error(`Provider request failed (${response.status})`);
  const reader=response.body.pipeThrough(new TextDecoderStream()).getReader(); let pending="";
  while(true){const {value,done}=await reader.read();if(done)break;pending+=value;const lines=pending.split("\n");pending=lines.pop()??"";for(const line of lines){if(!line.startsWith("data: ")||line==="data: [DONE]")continue;const event=JSON.parse(line.slice(6));const choice=event.choices?.[0];if(choice?.delta?.content)yield{text:choice.delta.content,finishReason:choice.finish_reason??undefined};}}
 }
 async embed(request:EmbeddingRequest,signal?:AbortSignal):Promise<EmbeddingResult>{const response=await fetch(`${this.config.baseUrl??"https://api.openai.com/v1"}/embeddings`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${this.config.apiKey}`,...this.config.headers},body:JSON.stringify({model:request.model,input:request.inputs}),signal});if(!response.ok)throw new Error(`Embedding request failed (${response.status})`);const body=await response.json() as {data:Array<{embedding:number[]}>};const vectors=body.data.map(x=>x.embedding);return{vectors,dimensions:vectors[0]?.length??0};}
}
