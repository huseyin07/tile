"use client";

import {useEffect} from "react";

export default function SitePolish(){
  useEffect(()=>{
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanupFns:(()=>void)[]=[];

    const enhance=()=>{
      document.querySelector<HTMLElement>('.why1111')?.remove();
      const hero=document.querySelector<HTMLElement>('.hero');
      if(hero&&!hero.querySelector('.hero-depth')){
        const depth=document.createElement('div');depth.className='hero-depth';depth.innerHTML='<i class="hero-mist hero-mist-a"></i><i class="hero-mist hero-mist-b"></i><i class="hero-roof-silhouette"></i>';hero.prepend(depth);
      }
      if(!document.querySelector('.page-progress')){
        const progress=document.createElement('div');progress.className='page-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<i></i>';document.body.appendChild(progress);
      }
      document.querySelectorAll<HTMLElement>('.story-section,.mint-state,.wl-story,.migration-section,.faq-section,.final-cta').forEach((section,i)=>{
        if(section.querySelector(':scope > .roof-journey'))return;
        const roof=document.createElement('div');roof.className='roof-journey';roof.setAttribute('aria-hidden','true');roof.innerHTML=Array.from({length:9},(_,n)=>`<i style="--n:${n}"></i>`).join('');section.prepend(roof);section.style.setProperty('--roof-index',String(i));
      });
      const mint=document.querySelector<HTMLElement>('.mint-state');
      if(mint&&!mint.querySelector('.mint-system-line')){
        const line=document.createElement('div');line.className='mint-system-line';line.innerHTML='<span><i></i> SYSTEM READY</span><span>COLLECTION CONFIGURED</span><span>MINT WINDOW · WAITING</span>';const head=mint.querySelector('.mint-state-head');head?.after(line);
      }
      const giwa=document.querySelector<HTMLElement>('.giwa-object');
      if(giwa&&!giwa.parentElement?.querySelector('.giwa-hover-labels')){
        const labels=document.createElement('div');labels.className='giwa-hover-labels';labels.innerHTML='<span>ONE TILE</span><span>ONE ROOF</span><span>ONE CULTURE</span>';giwa.insertAdjacentElement('afterend',labels);
      }
      document.querySelectorAll<HTMLElement>('.story-copy h2,.section-intro h2,.migration-copy h2,.faq-title h2,.final-cta h2').forEach(h=>h.classList.add('kinetic-title'));
      document.querySelectorAll<HTMLElement>('.faq-list article').forEach((a,i)=>{if(!a.querySelector('.faq-seal')){const s=document.createElement('i');s.className='faq-seal';s.textContent=String(i+1).padStart(2,'0');a.appendChild(s)}});
    };
    enhance();
    const mutation=new MutationObserver(enhance);mutation.observe(document.body,{childList:true,subtree:true});cleanupFns.push(()=>mutation.disconnect());

    if(!document.querySelector('.tile-entry')){
      const entry=document.createElement('div');entry.className='tile-entry';entry.innerHTML='<div><span>✿</span><b>TILE · 기와</b><small>ONE TILE BECOMES PART OF SOMETHING GREATER</small></div>';document.body.appendChild(entry);requestAnimationFrame(()=>entry.classList.add('show'));setTimeout(()=>entry.classList.add('leave'),430);setTimeout(()=>entry.remove(),900);
    }

    let cursor:HTMLElement|null=null;
    if(!reduce&&window.matchMedia('(pointer:fine)').matches){cursor=document.createElement('div');cursor.className='tile-cursor';document.body.appendChild(cursor)}
    const onPointer=(e:PointerEvent)=>{
      if(cursor){cursor.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`;cursor.classList.toggle('active',!!(e.target as HTMLElement).closest('a,button,.story-card,.network-node,.mint-console>div,.giwa-object'))}
      const el=(e.target as HTMLElement).closest<HTMLElement>('.story-copy,.story-card,.mint-state,.wl-story,.migration-section,.faq-section,.hero-stats>div,.wl-story-step,.network-node,.faq-list article');
      if(el){const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`)}
    };
    if(!reduce)document.addEventListener('pointermove',onPointer,{passive:true});cleanupFns.push(()=>document.removeEventListener('pointermove',onPointer));cleanupFns.push(()=>cursor?.remove());

    const onClick=(e:MouseEvent)=>{const btn=(e.target as HTMLElement).closest<HTMLElement>('button,.hero-cta');if(!btn)return;const r=btn.getBoundingClientRect();const pulse=document.createElement('i');pulse.className='tap-pulse';pulse.style.left=`${e.clientX-r.left}px`;pulse.style.top=`${e.clientY-r.top}px`;btn.appendChild(pulse);setTimeout(()=>pulse.remove(),520)};
    document.addEventListener('click',onClick);cleanupFns.push(()=>document.removeEventListener('click',onClick));

    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('tile-visible');if(entry.target.classList.contains('kinetic-title'))entry.target.classList.add('kinetic-live')}}),{threshold:.12,rootMargin:'0px 0px -7%'});
    const observe=()=>document.querySelectorAll<HTMLElement>('.story-section,.mint-state,.wl-story,.migration-section,.faq-section,.kinetic-title').forEach(x=>{if(!x.dataset.polishObserved){x.dataset.polishObserved='1';if(!x.classList.contains('kinetic-title'))x.classList.add('tile-reveal');revealObserver.observe(x)}});
    observe();const obsMutation=new MutationObserver(observe);obsMutation.observe(document.body,{childList:true,subtree:true});cleanupFns.push(()=>{revealObserver.disconnect();obsMutation.disconnect()});

    let frame=0;
    const renderScroll=()=>{
      frame=0;
      const y=window.scrollY;const viewport=window.innerHeight;const doc=Math.max(1,document.documentElement.scrollHeight-viewport);const pageProgress=Math.max(0,Math.min(1,y/doc));
      document.querySelector<HTMLElement>('.page-progress')?.style.setProperty('--page-progress',String(pageProgress));
      const nav=document.querySelector<HTMLElement>('.nav');nav?.classList.toggle('nav-scrolled',y>48);
      if(reduce)return;
      const hero=document.querySelector<HTMLElement>('.hero');const hy=Math.min(y,viewport);
      if(hero){hero.style.setProperty('--tile-parallax',`${hy*.055}px`);hero.style.setProperty('--hero-depth-y',`${hy*.025}px`)}
      const sun=document.querySelector<HTMLElement>('.hero-sun');const roof=document.querySelector<HTMLElement>('.roof-pattern');const pineA=document.querySelector<HTMLElement>('.hero-pine-a');const pineB=document.querySelector<HTMLElement>('.hero-pine-b');
      if(sun)sun.style.transform=`translate3d(0,${hy*.035}px,0)`;if(roof)roof.style.transform=`translate3d(0,${-hy*.025}px,0)`;if(pineA)pineA.style.translate=`0 ${hy*.018}px`;if(pineB)pineB.style.translate=`0 ${hy*.028}px`;
      const journey=document.querySelector<HTMLElement>('.migration-section');if(journey){const r=journey.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(viewport-r.top)/(viewport+r.height*.65)));journey.style.setProperty('--journey-progress',String(progress));[...journey.querySelectorAll<HTMLElement>('.network-node')].forEach((node,i,arr)=>node.classList.toggle('scroll-active',progress>i/(Math.max(1,arr.length-1))-.06))}
      document.querySelectorAll<HTMLElement>('.roof-journey').forEach(roofEl=>{const p=roofEl.parentElement?.getBoundingClientRect();if(!p)return;roofEl.style.setProperty('--roof-progress',String(Math.max(0,Math.min(1,(viewport-p.top)/(viewport+p.height)))))});
    };
    const onScroll=()=>{if(frame)return;frame=requestAnimationFrame(renderScroll)};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});renderScroll();cleanupFns.push(()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(frame)cancelAnimationFrame(frame)});

    return()=>cleanupFns.forEach(fn=>fn());
  },[]);
  return null;
}
