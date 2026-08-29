class MicroAIWidget extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'})}
  connectedCallback(){
    const api=this.getAttribute('api-base')||'';
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:block;font:14px 'DM Sans',system-ui;color:#1f211d}.shell{border:1px solid #dedfd9;border-radius:18px;background:#fff;box-shadow:0 16px 55px #292b2212;overflow:hidden}.messages{min-height:170px;max-height:42vh;overflow:auto;padding:20px;background:#fafbf8}.msg{max-width:84%;padding:11px 14px;margin:0 0 12px;border-radius:13px;line-height:1.55;white-space:pre-wrap}.bot{background:#fff;border:1px solid #e3e4df}.user{margin-left:auto;background:#252722;color:#fff}.sources{font-size:11px;padding:0 20px 13px;background:#fafbf8}.sources b{display:block;margin-bottom:5px}.sources a{display:inline-block;color:#4355eb;margin:2px 13px 2px 0;text-decoration:none}.composer{padding:13px}.form{display:flex;align-items:flex-end;border:1px solid #d7d9d2;border-radius:13px;padding:7px 7px 7px 13px;gap:8px}.form:focus-within{border-color:#969a90;box-shadow:0 0 0 3px #e8eae4}.form textarea{font:14px inherit;line-height:1.45;resize:none;min-height:42px;max-height:112px;flex:1;border:0;padding:10px 0;outline:0;background:transparent}.form button{width:42px;height:42px;border:0;border-radius:10px;background:#1f211d;color:#fff;font-size:18px;cursor:pointer}.form button:disabled{opacity:.4}.meta{display:flex;justify-content:space-between;color:#858880;font-size:9px;padding:8px 4px 0}.meta strong{font-weight:600;color:#676a64}@media(max-width:600px){.messages{min-height:190px;max-height:39vh;padding:14px}.msg{max-width:91%;font-size:13px}.sources{padding:0 14px 10px}.composer{padding:9px}.meta span:first-child{display:none}}
      </style>
      <div class="shell">
        <div class="messages" aria-live="polite"><div class="msg bot">Hi. Ask me about MicroAI's architecture, ingestion, security, or roadmap. I'll answer from the project docs and cite the sources.</div></div>
        <div class="sources"></div>
        <div class="composer">
          <form class="form"><textarea maxlength="600" rows="1" placeholder="Ask the MicroAI docs…" aria-label="Ask MicroAI"></textarea><button aria-label="Send question">↑</button></form>
          <div class="meta"><span>Grounded answers · source links included</span><span><strong>8</strong> questions per visitor/day</span></div>
        </div>
      </div>`;
    const form=this.shadowRoot.querySelector('form'),input=this.shadowRoot.querySelector('textarea'),button=this.shadowRoot.querySelector('button'),messages=this.shadowRoot.querySelector('.messages'),sourceBox=this.shadowRoot.querySelector('.sources');
    input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,112)+'px'});
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
    form.addEventListener('submit',async e=>{
      e.preventDefault();const question=input.value.trim();if(question.length<2)return;
      const user=document.createElement('div');user.className='msg user';user.textContent=question;messages.append(user);input.value='';input.style.height='auto';button.disabled=true;sourceBox.innerHTML='';
      const answer=document.createElement('div');answer.className='msg bot';answer.textContent='Thinking…';messages.append(answer);messages.scrollTop=messages.scrollHeight;
      try{
        const response=await fetch(`${api}/api/chat`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question})});
        if(!response.ok){const err=await response.json();throw Error(err.error||'Request failed')}
        answer.textContent='';const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
        while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const events=buffer.split('\n\n');buffer=events.pop()||'';for(const block of events){const event=block.match(/^event: (.+)$/m)?.[1],raw=block.match(/^data: (.+)$/m)?.[1];if(!raw)continue;const data=JSON.parse(raw);if(event==='sources')sourceBox.innerHTML=`<b>Sources</b>${data.map(s=>`<a target="_blank" rel="noopener" href="${s.url}">[${s.id}] ${s.title}</a>`).join('')}`;if(event==='token')answer.textContent+=data.text;messages.scrollTop=messages.scrollHeight}}
      }catch(error){answer.textContent=error.message}finally{button.disabled=false;input.focus()}
    });
  }
}
customElements.define('microai-widget',MicroAIWidget);
