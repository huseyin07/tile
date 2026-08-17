"use client";

import {FormEvent,useState} from "react";
import {ArrowDown,ArrowUpRight,Check,ChevronRight} from "lucide-react";
import {siteConfig} from "@/lib/site-config";

type Stage="home"|"tasks"|"form"|"share"|"done";
type Session={applicationId:string;tileNumber:number};

export function WhitelistJourney(){
 const[stage,setStage]=useState<Stage>("home");
 const[checks,setChecks]=useState([false,false,false,false]);
 const[session,setSession]=useState<Session|null>(null);
 const[loading,setLoading]=useState(false);const[error,setError]=useState("");
 const allDone=checks.every(Boolean);
 const toggle=(i:number)=>setChecks(v=>v.map((x,n)=>n===i?!x:x));

 async function apply(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const f=new FormData(e.currentTarget);try{const r=await fetch('/api/whitelist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({x_username:f.get('x_username'),wallet_address:f.get('wallet_address'),tasks_confirmed:allDone})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Application failed.');setSession({applicationId:j.applicationId,tileNumber:j.tileNumber});setStage('share')}catch(e){setError(e instanceof Error?e.message:'Application failed.')}finally{setLoading(false)}}
 async function verify(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!session)return;setLoading(true);setError("");const url=String(new FormData(e.currentTarget).get('x_post_url')||'');try{const r=await fetch('/api/whitelist/verify-x',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({applicationId:session.applicationId,xPostUrl:url})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Verification failed.');setStage('done')}catch(e){setError(e instanceof Error?e.message:'Verification failed.')}finally{setLoading(false)}}
 const shareText=siteConfig.createSignalPost();const intent=`https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;

 return <main className="tile-site">
  <nav className="nav"><button onClick={()=>setStage('home')} className="brand"><span className="brand-mark">T</span><span>TILE<small>타일</small></span></button><div className="nav-links"><a href="#story">STORY</a><a href="#journey">JOURNEY</a><a href={siteConfig.xUrl} target="_blank" rel="noreferrer">𝕏</a><button onClick={()=>setStage('tasks')}>WHITELIST</button></div></nav>

  {stage==='home'?<>
   <section className="hero"><div className="hero-film"/><div className="hero-copy"><p className="eyebrow">기와 · KOREAN ROOF TILE</p><h1><span>TILE</span><em>1111</em></h1><p className="hero-line">ONE TILE AT A TIME.</p><p className="hero-ko">한 장의 기와가 모여 하나의 지붕을 만든다.</p><button className="hero-cta" onClick={()=>setStage('tasks')}>ENTER WHITELIST <ChevronRight/></button></div><div className="scroll-cue"><ArrowDown size={15}/> DISCOVER THE STORY</div></section>

   <section id="story" className="story-section"><div className="story-number">01</div><div className="story-copy"><p className="eyebrow dark">WHAT IS TILE? · 타일이란?</p><h2>ONE PIECE.<br/>SOMETHING BIGGER.</h2><p>In Korean architecture, <b>giwa (기와)</b> are the traditional roof tiles that shape the silhouette of a hanok. One tile may seem small. Together, they create something built to last.</p><p><b>TILE is built on the same idea.</b> 1,111 individual pieces. Each different. Each part of something bigger.</p><blockquote>한 장의 기와가 모여 하나의 지붕을 만든다.<small>One tile becomes part of something greater.</small></blockquote></div><div className="story-visual"><div className="giwa-object"><span>T</span></div><p>GIWA · 기와<br/><small>TRADITION → DIGITAL CULTURE</small></p></div></section>

   <section id="journey" className="journey"><div className="journey-head"><p className="eyebrow">THE JOURNEY · 여정</p><h2>FROM ONE ROOF<br/>TO THE NEXT.</h2></div><div className="journey-track"><article><span>01</span><small>ORIGIN</small><h3>1,111 TILEs</h3><p>A collection inspired by Korean giwa culture.</p></article><article><span>02</span><small>MINT</small><h3>Robinhood Chain</h3><p>Minting on Robinhood Chain mainnet. Date: TBA.</p></article><article><span>03</span><small>NEXT CHAPTER</small><h3>GIWA</h3><p>Planned for GIWA when mainnet is live.</p></article><article><span>04</span><small>HOLD</small><h3>Rewards</h3><p>TILE holders will be rewarded on GIWA.</p></article></div></section>

   <section className="wl-banner"><p className="eyebrow">WHITELIST IS OPEN</p><h2>CLAIM YOUR PLACE<br/>UNDER THE ROOF.</h2><button onClick={()=>setStage('tasks')}>START WL APPLICATION <ArrowUpRight/></button><span>화이트리스트 신청</span></section>
  </>:
  <section className="wl-experience"><div className="wl-backdrop"/><div className="wl-wrap"><button className="close-wl" onClick={()=>setStage('home')}>← BACK TO TILE</button><div className="wl-heading"><p className="eyebrow">TILE WHITELIST · 화이트리스트</p><h2>{stage==='tasks'?'THE SIGNAL':stage==='form'?'YOUR MARK':stage==='share'?'SHARE TILE':'APPLICATION VERIFIED'}</h2><div className="wl-progress">{['TASKS','APPLY','SHARE','VERIFY'].map((x,i)=><span className={i<={tasks:0,form:1,share:2,done:3}[stage]?'active':''} key={x}>0{i+1} {x}</span>)}</div></div>

   {stage==='tasks'&&<div className="task-layout"><aside><p className="step">STEP 01 · 신호</p><h3>Show us you found TILE.</h3><p>Complete the four X tasks. The main whitelist post will be linked here when it goes live.</p><div className="seal-1111">1111<small>PIECES</small></div></aside><div className="task-list">{[
    ['FOLLOW @TileOnGIWA','Follow the official TILE account.',siteConfig.xUrl],
    ['LIKE THE WL POST','Like the official whitelist announcement.',siteConfig.whitelistPostUrl],
    ['REPOST THE WL POST','Repost the whitelist announcement.',siteConfig.whitelistPostUrl],
    ['TAG 2 FRIENDS','Reply to the WL post and tag two friends.',siteConfig.whitelistPostUrl]
   ].map(([title,desc,url],i)=><div className={`task ${checks[i]?'checked':''}`} key={title}><button className="task-check" onClick={()=>toggle(i)}>{checks[i]?<Check/>:String(i+1).padStart(2,'0')}</button><div><b>{title}</b><p>{desc}</p></div><a href={url==='#'?undefined:url} target={url==='#'?undefined:'_blank'} rel="noreferrer" aria-disabled={url==='#'}>{url==='#'?'SOON':'OPEN'} <ArrowUpRight size={14}/></a></div>)}<button disabled={!allDone} className="next-step" onClick={()=>setStage('form')}>CONTINUE APPLICATION <ChevronRight/></button></div></div>}

   {stage==='form'&&<form onSubmit={apply} className="application-layout"><aside><p className="step">STEP 02 · 신청</p><h3>Leave your mark.</h3><p>Only your X identity and EVM wallet are needed. Final whitelist selection remains with the TILE team.</p></aside><div className="application-form"><label>X USERNAME<input name="x_username" required pattern="@?[A-Za-z0-9_]+" placeholder="@username"/></label><label>EVM WALLET ADDRESS<input name="wallet_address" required pattern="0x[a-fA-F0-9]{40}" placeholder="0x…"/></label>{error&&<p className="error">{error}</p>}<button disabled={loading}>{loading?'SUBMITTING…':'SUBMIT & CONTINUE'} <ChevronRight/></button></div></form>}

   {stage==='share'&&session&&<div className="share-layout"><aside><p className="step">STEP 03 · 공유</p><h3>Carry TILE outside.</h3><p>Share the prepared post on X. Then return here with your post URL to finish verification.</p></aside><div className="share-panel"><pre>{shareText}</pre><a className="share-button" href={intent} target="_blank" rel="noreferrer">SHARE ON X <ArrowUpRight/></a><form onSubmit={verify}><label>YOUR X POST LINK<input name="x_post_url" required type="url" placeholder="https://x.com/username/status/..."/></label>{error&&<p className="error">{error}</p>}<button disabled={loading}>{loading?'VERIFYING…':'VERIFY & COMPLETE'} <Check/></button></form></div></div>}

   {stage==='done'&&<div className="verified"><div className="verified-mark"><Check/></div><p className="eyebrow">확인 완료 · VERIFIED</p><h3>YOU'RE IN THE RECORD.</h3><p>Your TILE whitelist application has been verified.</p><small>Verification does not guarantee final whitelist allocation. Final selection is made by the TILE team.</small><button onClick={()=>setStage('home')}>RETURN TO TILE</button></div>}
  </div></section>}
 </main>
}
