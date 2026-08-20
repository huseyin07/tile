"use client";

import {useEffect,useMemo,useState} from "react";
import {createPortal} from "react-dom";
import {ChevronLeft,ChevronRight} from "lucide-react";

export default function CollectionPreview(){
  const[active,setActive]=useState(0);
  const[mount,setMount]=useState<HTMLElement|null>(null);
  useEffect(()=>{
    const story=document.getElementById("story");
    if(!story)return;
    let node=document.getElementById("collection-preview-mount") as HTMLElement|null;
    if(!node){node=document.createElement("div");node.id="collection-preview-mount";story.after(node)}
    setMount(node);
    return()=>{node?.remove()};
  },[]);
  const items=useMemo(()=>Array.from({length:10},(_,i)=>i),[]);
  const step=(d:number)=>setActive(v=>(v+d+items.length)%items.length);
  if(!mount)return null;
  return createPortal(<section className="collection-preview" aria-label="TILE collection preview">
    <div className="collection-preview-head">
      <div><p className="eyebrow">COLLECTION PREVIEW · 컬렉션</p><h2>THE FIRST<br/>1,111.</h2></div>
      <div className="collection-preview-copy"><p>A first look at the visual language of TILE. Ten early pieces from a collection built around identity, symbols and the idea of one roof.</p><span>{String(active+1).padStart(2,"0")} / 10</span></div>
    </div>
    <div className="collection-stage">
      <button className="collection-arrow left" onClick={()=>step(-1)} aria-label="Previous NFT"><ChevronLeft/></button>
      <div className="collection-track">
        {items.map((n)=>{
          let delta=n-active;
          if(delta>5)delta-=10;if(delta<-5)delta+=10;
          const visible=Math.abs(delta)<=2;
          return <button key={n} onClick={()=>setActive(n)} className={`collection-card ${delta===0?"active":""}`} style={{"--delta":delta,"--crop-x":`${(n%5)*25}%`,"--crop-y":n<5?"0%":"100%",opacity:visible?1:0,pointerEvents:visible?"auto":"none"} as React.CSSProperties} aria-label={`Preview TILE ${n+1}`}>
            <span className="collection-art"/><span className="collection-id">TILE · PREVIEW {String(n+1).padStart(2,"0")}</span>
          </button>
        })}
      </div>
      <button className="collection-arrow right" onClick={()=>step(1)} aria-label="Next NFT"><ChevronRight/></button>
    </div>
    <div className="collection-dots">{items.map(n=><button key={n} onClick={()=>setActive(n)} className={n===active?"active":""} aria-label={`Show preview ${n+1}`}/>)}</div>
    <p className="collection-note">PREVIEW ART · FINAL COLLECTION DETAILS MAY EVOLVE BEFORE MINT</p>
  </section>,mount);
}
