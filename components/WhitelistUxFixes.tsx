"use client";

import {useEffect} from "react";

export default function WhitelistUxFixes(){
  useEffect(()=>{
    const root=document;

    const normalizeInputs=()=>{
      const x=root.querySelector<HTMLInputElement>('input[name="x_username"]');
      const wallet=root.querySelector<HTMLInputElement>('input[name="wallet_address"]');
      if(x){
        x.removeAttribute('pattern');
        x.setAttribute('maxlength','16');
        x.setAttribute('autocomplete','off');
        x.oninput=()=>{
          const cursor=x.selectionStart??x.value.length;
          const hadAt=x.value.startsWith('@');
          const body=x.value.replace(/^@/,'').replace(/[^A-Za-z0-9_]/g,'').slice(0,15);
          x.value=(hadAt?'@':'')+body;
          try{x.setSelectionRange(Math.min(cursor,x.value.length),Math.min(cursor,x.value.length))}catch{}
        };
      }
      if(wallet){
        wallet.removeAttribute('pattern');
        wallet.setAttribute('maxlength','42');
        wallet.setAttribute('autocomplete','off');
        wallet.oninput=()=>{wallet.value=wallet.value.trim().replace(/\s+/g,'')};
        wallet.onblur=()=>{wallet.value=wallet.value.trim()};
      }
    };

    const enhanceSignalPanel=()=>{
      const aside=root.querySelector<HTMLElement>('.task-layout aside');
      if(!aside||aside.querySelector('[data-signal-visual]'))return;
      const oldSeal=aside.querySelector<HTMLElement>('.seal-1111');
      if(oldSeal) oldSeal.style.display='none';

      const visual=document.createElement('div');
      visual.setAttribute('data-signal-visual','true');
      visual.className='task-aside-visual';
      visual.innerHTML=`
        <div class="task-scene-sky"></div>
        <div class="task-scene-roofs task-scene-roofs-a"></div>
        <div class="task-scene-roofs task-scene-roofs-b"></div>
        <div class="task-scene-lantern task-scene-lantern-a">✿</div>
        <div class="task-scene-lantern task-scene-lantern-b">✿</div>
        <div class="task-scene-flag"><span>✿</span></div>
        <div class="task-scene-petals"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="task-scene-meta">
          <div><span class="task-meta-icon">✿</span><b>1,111</b><small>First 1,111</small></div>
          <div><span class="task-meta-roof">⌂</span><b>One roof</b><small>Stronger together</small></div>
          <div><span class="task-meta-roof">⌂</span><b>GIWA</b><small>The home we return to</small></div>
        </div>`;
      aside.appendChild(visual);
    };

    const enhanceShare=()=>{
      const panel=root.querySelector<HTMLElement>('.share-panel');
      if(!panel||panel.querySelector('[data-tile-share-image]'))return;
      const wrap=document.createElement('div');
      wrap.setAttribute('data-tile-share-image','true');
      wrap.style.margin='0 0 22px';
      wrap.style.border='1px solid rgba(200,154,82,.35)';
      wrap.style.background='rgba(10,10,8,.55)';
      wrap.style.padding='12px';

      const img=document.createElement('img');
      img.src='/og-tile.svg';
      img.alt='TILE share image';
      img.style.display='block';
      img.style.width='100%';
      img.style.height='auto';
      img.style.border='1px solid rgba(255,255,255,.08)';
      img.style.marginBottom='12px';

      const note=document.createElement('p');
      note.textContent='Add this TILE image to your X post before publishing.';
      note.style.margin='0 0 10px';
      note.style.fontSize='12px';
      note.style.opacity='.72';

      const download=document.createElement('a');
      download.href='/og-tile.svg';
      download.download='TILE-share-image.svg';
      download.textContent='DOWNLOAD POST IMAGE';
      download.style.display='inline-flex';
      download.style.alignItems='center';
      download.style.padding='11px 14px';
      download.style.border='1px solid rgba(200,154,82,.65)';
      download.style.fontSize='11px';
      download.style.fontWeight='700';
      download.style.letterSpacing='.08em';
      download.style.color='inherit';
      download.style.textDecoration='none';

      wrap.append(img,note,download);
      panel.prepend(wrap);
    };

    const refresh=()=>{normalizeInputs();enhanceSignalPanel();enhanceShare()};
    const observer=new MutationObserver(refresh);
    observer.observe(document.body,{childList:true,subtree:true});
    refresh();

    const clickHandler=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const link=target?.closest<HTMLAnchorElement>('.task a');
      if(!link)return;
      const task=link.closest<HTMLElement>('.task');
      if(!task||task.classList.contains('checked'))return;
      const check=task.querySelector<HTMLButtonElement>('.task-check');
      if(check) window.setTimeout(()=>check.click(),120);
    };
    document.addEventListener('click',clickHandler,true);

    return()=>{observer.disconnect();document.removeEventListener('click',clickHandler,true)};
  },[]);
  return null;
}
