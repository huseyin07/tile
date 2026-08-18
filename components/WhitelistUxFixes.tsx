"use client";

import {useEffect} from "react";

const signalPanelCss=`
.task-layout aside{position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:430px}
.task-layout aside>h3,.task-layout aside>.step,.task-layout aside>p{position:relative;z-index:3}
.task-aside-visual{position:relative;flex:1;min-height:245px;margin-top:18px;overflow:hidden;border:1px solid rgba(213,170,92,.24);background:linear-gradient(180deg,rgba(255,185,92,.16),rgba(9,10,8,.04) 42%,rgba(6,7,6,.78)),url('https://ak-d.tripcdn.com/images/100p11000000r4rhv9EF4.jpg?proc=source%2Ftrip') center 57%/cover no-repeat;box-shadow:inset 0 0 70px rgba(0,0,0,.42)}
.task-aside-visual:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 58% 22%,rgba(255,194,105,.25),transparent 28%),linear-gradient(90deg,rgba(8,9,7,.18),transparent 50%,rgba(5,6,5,.24));pointer-events:none}
.task-scene-sky{position:absolute;left:56%;top:10%;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(255,206,124,.26),rgba(255,183,77,.06) 44%,transparent 70%);filter:blur(2px);animation:signalSun 5.5s ease-in-out infinite}
.task-scene-roofs{position:absolute;bottom:55px;width:58%;height:64px;border-top:3px solid rgba(217,173,95,.32);border-radius:50% 50% 0 0;opacity:.55;filter:drop-shadow(0 -5px 12px rgba(0,0,0,.45))}
.task-scene-roofs-a{left:-10%;transform:rotate(-4deg)}.task-scene-roofs-b{right:-13%;bottom:74px;transform:rotate(4deg) scale(.8)}
.task-scene-lantern{position:absolute;bottom:63px;display:grid;place-items:center;width:34px;height:48px;border:1px solid rgba(224,179,91,.58);background:radial-gradient(circle,#d8a44b 0 22%,#4e3719 42%,#17130c 72%);color:#f6d18a;font-size:.72rem;box-shadow:0 0 25px rgba(211,155,65,.26);animation:signalLantern 4s ease-in-out infinite}
.task-scene-lantern-a{left:9%}.task-scene-lantern-b{left:36%;bottom:50px;transform:scale(.72);animation-delay:-1.7s}
.task-scene-flag{position:absolute;right:10%;top:20%;width:54px;height:92px;border:1px solid rgba(213,170,92,.35);background:linear-gradient(180deg,rgba(16,17,14,.94),rgba(44,34,20,.88));box-shadow:0 10px 25px rgba(0,0,0,.36);animation:signalFlag 4.8s ease-in-out infinite;transform-origin:top center}
.task-scene-flag:before{content:'';position:absolute;left:50%;top:-16px;width:1px;height:16px;background:#b98a42}.task-scene-flag span{display:grid;place-items:center;height:100%;color:#d9ad5f;font-size:1.6rem}
.task-scene-petals i{position:absolute;width:5px;height:9px;border-radius:70% 0 70% 0;background:#d8ae67;opacity:.55;animation:signalPetal 7s linear infinite}.task-scene-petals i:nth-child(1){left:14%;top:18%;animation-delay:-1s}.task-scene-petals i:nth-child(2){left:32%;top:7%;animation-delay:-4s}.task-scene-petals i:nth-child(3){left:47%;top:28%;animation-delay:-2.6s}.task-scene-petals i:nth-child(4){left:66%;top:12%;animation-delay:-5.2s}.task-scene-petals i:nth-child(5){left:78%;top:31%;animation-delay:-3.4s}.task-scene-petals i:nth-child(6){left:90%;top:8%;animation-delay:-6.1s}
.task-scene-meta{position:absolute;left:10px;right:10px;bottom:10px;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(213,170,92,.22);background:rgba(8,9,7,.82);backdrop-filter:blur(8px)}
.task-scene-meta>div{display:grid;grid-template-columns:auto 1fr;column-gap:8px;align-items:center;padding:10px 11px;border-right:1px solid rgba(213,170,92,.15)}.task-scene-meta>div:last-child{border-right:0}.task-scene-meta span{grid-row:1/3;display:grid;place-items:center;width:28px;height:28px;border:1px solid rgba(213,170,92,.45);border-radius:50%;color:#d8ad61}.task-scene-meta b{font-family:Georgia,serif;font-size:.78rem;font-weight:400;color:#e7c784}.task-scene-meta small{font-size:.43rem;color:rgba(255,255,255,.48)}
@keyframes signalSun{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.08)}}
@keyframes signalLantern{0%,100%{filter:brightness(.9)}50%{filter:brightness(1.18)}}
@keyframes signalFlag{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@keyframes signalPetal{0%{transform:translate(0,-18px) rotate(0);opacity:0}12%{opacity:.7}100%{transform:translate(42px,190px) rotate(320deg);opacity:0}}
@media(max-width:980px){.task-layout aside{min-height:auto}.task-aside-visual{min-height:300px}.task-scene-meta{grid-template-columns:repeat(3,1fr)}}
@media(max-width:620px){.task-aside-visual{min-height:260px}.task-scene-meta>div{padding:8px 6px}.task-scene-meta small{display:none}.task-scene-meta b{font-size:.66rem}.task-scene-flag{right:8%;transform:scale(.85)}}
@media(prefers-reduced-motion:reduce){.task-aside-visual *{animation:none!important}}
`;

export default function WhitelistUxFixes(){
  useEffect(()=>{
    const root=document;
    if(!document.getElementById('tile-signal-panel-css')){
      const style=document.createElement('style');style.id='tile-signal-panel-css';style.textContent=signalPanelCss;document.head.appendChild(style);
    }

    const normalizeInputs=()=>{
      const x=root.querySelector<HTMLInputElement>('input[name="x_username"]');
      const wallet=root.querySelector<HTMLInputElement>('input[name="wallet_address"]');
      if(x){
        x.removeAttribute('pattern');x.setAttribute('maxlength','16');x.setAttribute('autocomplete','off');
        x.oninput=()=>{const cursor=x.selectionStart??x.value.length;const hadAt=x.value.startsWith('@');const body=x.value.replace(/^@/,'').replace(/[^A-Za-z0-9_]/g,'').slice(0,15);x.value=(hadAt?'@':'')+body;try{x.setSelectionRange(Math.min(cursor,x.value.length),Math.min(cursor,x.value.length))}catch{}};
      }
      if(wallet){wallet.removeAttribute('pattern');wallet.setAttribute('maxlength','42');wallet.setAttribute('autocomplete','off');wallet.oninput=()=>{wallet.value=wallet.value.trim().replace(/\s+/g,'')};wallet.onblur=()=>{wallet.value=wallet.value.trim()};}
    };

    const enhanceSignalPanel=()=>{
      const aside=root.querySelector<HTMLElement>('.task-layout aside');if(!aside||aside.querySelector('[data-signal-visual]'))return;
      const oldSeal=aside.querySelector<HTMLElement>('.seal-1111');if(oldSeal) oldSeal.style.display='none';
      const visual=document.createElement('div');visual.setAttribute('data-signal-visual','true');visual.className='task-aside-visual';visual.innerHTML=`<div class="task-scene-sky"></div><div class="task-scene-roofs task-scene-roofs-a"></div><div class="task-scene-roofs task-scene-roofs-b"></div><div class="task-scene-lantern task-scene-lantern-a">✿</div><div class="task-scene-lantern task-scene-lantern-b">✿</div><div class="task-scene-flag"><span>✿</span></div><div class="task-scene-petals"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="task-scene-meta"><div><span class="task-meta-icon">✿</span><b>1,111</b><small>First 1,111</small></div><div><span class="task-meta-roof">⌂</span><b>One roof</b><small>Stronger together</small></div><div><span class="task-meta-roof">⌂</span><b>GIWA</b><small>The home we return to</small></div></div>`;aside.appendChild(visual);
    };

    const enhanceShare=()=>{
      const panel=root.querySelector<HTMLElement>('.share-panel');if(!panel||panel.querySelector('[data-tile-share-image]'))return;
      const wrap=document.createElement('div');wrap.setAttribute('data-tile-share-image','true');wrap.style.margin='0 0 22px';wrap.style.border='1px solid rgba(200,154,82,.35)';wrap.style.background='rgba(10,10,8,.55)';wrap.style.padding='12px';
      const img=document.createElement('img');img.src='/og-tile.svg';img.alt='TILE share image';img.style.display='block';img.style.width='100%';img.style.height='auto';img.style.border='1px solid rgba(255,255,255,.08)';img.style.marginBottom='12px';
      const note=document.createElement('p');note.textContent='Add this TILE image to your X post before publishing.';note.style.margin='0 0 10px';note.style.fontSize='12px';note.style.opacity='.72';
      const download=document.createElement('a');download.href='/og-tile.svg';download.download='TILE-share-image.svg';download.textContent='DOWNLOAD POST IMAGE';download.style.display='inline-flex';download.style.alignItems='center';download.style.padding='11px 14px';download.style.border='1px solid rgba(200,154,82,.65)';download.style.fontSize='11px';download.style.fontWeight='700';download.style.letterSpacing='.08em';download.style.color='inherit';download.style.textDecoration='none';wrap.append(img,note,download);panel.prepend(wrap);
    };

    const refresh=()=>{normalizeInputs();enhanceSignalPanel();enhanceShare()};const observer=new MutationObserver(refresh);observer.observe(document.body,{childList:true,subtree:true});refresh();
    const clickHandler=(event:MouseEvent)=>{const target=event.target as HTMLElement|null;const link=target?.closest<HTMLAnchorElement>('.task a');if(!link)return;const task=link.closest<HTMLElement>('.task');if(!task||task.classList.contains('checked'))return;const check=task.querySelector<HTMLButtonElement>('.task-check');if(check)window.setTimeout(()=>check.click(),120)};document.addEventListener('click',clickHandler,true);
    return()=>{observer.disconnect();document.removeEventListener('click',clickHandler,true)};
  },[]);
  return null;
}
