export type ChatRole = "system"|"user"|"assistant"|"tool";
export interface ChatMessage {role: ChatRole; content: string}
export interface ChatRequest {model:string; messages:ChatMessage[]; temperature?:number; maxTokens?:number}
export interface ChatChunk {text:string; finishReason?:string}
export interface EmbeddingRequest {model:string; inputs:string[]}
export interface EmbeddingResult {vectors:number[][]; dimensions:number}
export interface ModelProvider {readonly id:string; streamChat(r:ChatRequest,s?:AbortSignal):AsyncIterable<ChatChunk>; embed(r:EmbeddingRequest,s?:AbortSignal):Promise<EmbeddingResult>}
export interface ProviderConfig {apiKey:string; baseUrl?:string; headers?:Record<string,string>}
