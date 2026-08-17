"use client";

import {FormEvent,useEffect,useState} from "react";
import {Search,X} from "lucide-react";

type Lookup={found:boolean;tileNumber?:number;xUsername?:string;wallet?:string;status?:string;verificationStatus?:string;error?:string};

export default function SiteEnhancements(){
  const[open,setOpen]=useState(false);const[result,setResult]=useState<Lookup|null>(null);const[loading,setLoading]=useState(false);
  useEffect(()=>{const onScroll=()=>document.documentElement.style.setProperty("--tile-night",String(Math.min(.72,window.scrollY/2500)));onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
  async function find(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setResult(null);const wallet=String(new FormData(e.currentTarget).get("wallet")||"");try{const r=await fetch(`/api/whitelist/lookup?wallet=${encodeURIComponent(wallet)}`);setResult(await r.json())}finally{setLoading(false)}}
  const short=(w?:string)=>w?`${w.slice(0,7)}…${w.slice(-5)}`:"—";
  return <>
    <section className="tile-manifesto"><p>정체성 · IDENTITY</p><div><strong>INDIVIDUAL<br/>BY DESIGN.</strong><strong>CONNECTED<br/>BY CULTURE.</strong><strong>BUILT<br/>TO MOVE.</strong></div><small>각자의 기와, 하나의 문화, 다음 네트워크로.</small></section>
    <div className="tile-utility-bar"><button onClick={()=>setOpen(true)}><Search size={14}/> CHECK MY APPLICATION</button></div>
    {open&&<div className="tile-modal-shell" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="tile-modal"><button className="tile-modal-close" onClick={()=>setOpen(false)}><X/></button><p className="eyebrow">신청 조회 · APPLICATION LOOKUP</p><h2>FIND YOUR<br/>TILE SIGNAL.</h2><form onSubmit={find}><label>EVM WALLET<input name="wallet" required pattern="0x[a-fA-F0-9]{40}" placeholder="0x…"/></label><button disabled={loading}>{loading?"SEARCHING…":"CHECK APPLICATION"}</button></form>{result&&<div className={`lookup-result ${result.found?"found":""}`}>{result.found?<><div className="lookup-seal">확인</div><p>APPLICATION FOUND</p><dl><div><dt>TILE SIGNAL</dt><dd>#{String(result.tileNumber).padStart(4,"0")}</dd></div><div><dt>X ACCOUNT</dt><dd>@{result.xUsername}</dd></div><div><dt>WALLET</dt><dd>{short(result.wallet)}</dd></div><div><dt>X SIGNAL</dt><dd>{result.status==="pending_verification"?"PENDING":"VERIFIED ✓"}</dd></div><div><dt>FINAL WL</dt><dd>{result.status==="whitelisted"?"WHITELISTED ✓":result.status==="rejected"?"NOT SELECTED":"PENDING"}</dd></div></dl></>:<><p>{result.error||"NO APPLICATION FOUND"}</p><small>Check the EVM wallet and try again.</small></>}</div>}</div></div>}
  </>;
}
