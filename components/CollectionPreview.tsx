"use client";

import {useEffect,useMemo,useState,type CSSProperties} from "react";
import {createPortal} from "react-dom";
import {ChevronLeft,ChevronRight} from "lucide-react";

const COLS=5;
const ROWS=4;
const TOTAL=19;

export default function CollectionPreview(){
  const[active,setActive]=useState(0);
  const[mount,setMount]=useState<HTMLElement|null>(null);
  useEffect(()=>{
    let node=document.getElementById("collection-preview-mount") as HTMLElement|null;

    const sync=()=>{
      const whitelistOpen=Boolean(document.querySelector(".wl-experience"));
      const story=document.getElementById("story");

      if(whitelistOpen||!story){
        if(node)node.style.display="none";
        return;
      }

      if(!node){
        node=document.createElement("div");
        node.id="collection-preview-mount";
        story.after(node);
        setMount(node);
      }else{
        if(node.previousElementSibling!==story)story.after(node);
        node.style.display="";
        setMount(node);
      }
    };

    sync();
    const observer=new MutationObserver(sync);
    observer.observe(document.body,{childList:true,subtree:true});
    return()=>{observer.disconnect();node?.remove()};
  },[]);

  const items=useMemo(()=>Array.from({length:TOTAL},(_,i)=>i),[]);
  const step=(d:number)=>setActive(v=>(v+d+items.length)%items.length);
  if(!mount)return null;

  return createPortal(<section className="collection-preview" aria-label="TILE collection preview">
    <div className="collection-preview-head">
      <div><p className="eyebrow">COLLECTION PREVIEW · 컬렉션</p><h2>THE FIRST<br/>1,111.</h2></div>
      <div className="collection-preview-copy"><p>A first look at the visual language of TILE. Nineteen early pieces from a collection built around identity, symbols and the idea of one roof.</p><span>{String(active+1).padStart(2,"0")} / {TOTAL}</span></div>
    </div>
    <div className="collection-stage">
      <button className="collection-arrow left" onClick={()=>step(-1)} aria-label="Previous NFT"><ChevronLeft/></button>
      <div className="collection-track">
        {items.map((n)=>{
          let delta=n-active;
          const half=Math.floor(items.length/2);
          if(delta>half)delta-=items.length;
          if(delta<-half)delta+=items.length;
          const distance=Math.abs(delta);
          const visible=distance<=2;
          const col=n%COLS;
          const row=Math.floor(n/COLS);
          const x=(col/(COLS-1))*100;
          const y=(row/(ROWS-1))*100;
          const style={
            "--delta":delta,
            "--distance":distance,
            "--crop-x":`${x}%`,
            "--crop-y":`${y}%`,
            opacity:visible?1:0,
            pointerEvents:visible?"auto":"none"
          } as CSSProperties;
          return <button key={n} onClick={()=>setActive(n)} className={`collection-card ${delta===0?"active":""}`} style={style} aria-label={`Preview TILE ${n+1}`}>
            <span className="collection-art"/>
            <span className="collection-id">TILE · PREVIEW {String(n+1).padStart(2,"0")}</span>
          </button>
        })}
      </div>
      <button className="collection-arrow right" onClick={()=>step(1)} aria-label="Next NFT"><ChevronRight/></button>
    </div>
    <div className="collection-dots">{items.map(n=><button key={n} onClick={()=>setActive(n)} className={n===active?"active":""} aria-label={`Show preview ${n+1}`}/>)}</div>
    <p className="collection-note">PREVIEW ART · FINAL COLLECTION DETAILS MAY EVOLVE BEFORE MINT</p>
  </section>,mount);
}
