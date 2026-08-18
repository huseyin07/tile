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

    const observer=new MutationObserver(normalizeInputs);
    observer.observe(document.body,{childList:true,subtree:true});
    normalizeInputs();

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
