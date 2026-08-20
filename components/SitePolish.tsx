"use client";

import {useEffect} from "react";

export default function SitePolish(){
  useEffect(()=>{
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero=document.querySelector<HTMLElement>('.hero');
    const sun=document.querySelector<HTMLElement>('.hero-sun');
    const roof=document.querySelector<HTMLElement>('.roof-pattern');
    const pineA=document.querySelector<HTMLElement>('.hero-pine-a');
    const pineB=document.querySelector<HTMLElement>('.hero-pine-b');
    const onScroll=()=>{
      if(reduce||!hero)return;
      const y=Math.min(window.scrollY,window.innerHeight);
      hero.style.setProperty('--tile-parallax',`${y*.055}px`);
      if(sun)sun.style.transform=`translate3d(0,${y*.035}px,0)`;
      if(roof)roof.style.transform=`translate3d(0,${-y*.025}px,0)`;
      if(pineA)pineA.style.translate=`0 ${y*.018}px`;
      if(pineB)pineB.style.translate=`0 ${y*.028}px`;
    };
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();

    const cards=[...document.querySelectorAll<HTMLElement>('.story-copy,.story-card,.mint-state,.wl-story,.migration-section,.faq-section,.final-cta,.hero-stats>div,.wl-story-step,.network-node,.faq-list article')];
    const onPointer=(e:PointerEvent)=>{
      const el=(e.target as HTMLElement).closest<HTMLElement>('.story-copy,.story-card,.mint-state,.wl-story,.migration-section,.faq-section,.final-cta,.hero-stats>div,.wl-story-step,.network-node,.faq-list article');
      if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`);
    };
    if(!reduce)document.addEventListener('pointermove',onPointer,{passive:true});

    const reveal=[...document.querySelectorAll<HTMLElement>('.story-section,.why1111,.mint-state,.wl-story,.migration-section,.faq-section,.final-cta')];
    reveal.forEach(x=>x.classList.add('tile-reveal'));
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('tile-visible');io.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -8%'});
    reveal.forEach(x=>io.observe(x));

    return()=>{window.removeEventListener('scroll',onScroll);document.removeEventListener('pointermove',onPointer);io.disconnect();cards.forEach(x=>{x.style.removeProperty('--mx');x.style.removeProperty('--my')})};
  },[]);
  return null;
}
