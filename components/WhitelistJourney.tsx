"use client";

import {FormEvent,useMemo,useState} from "react";
import {ArrowLeft,ArrowUpRight,Check,ChevronRight} from "lucide-react";
import {formatTileNumber,siteConfig} from "@/lib/site-config";

type Stage="intro"|"game"|"application"|"signal"|"verified";
type Session={applicationId:string;tileNumber:number};
const giwa=[{id:"flower",mark:"✿",ko:"꽃기와"},{id:"moon",mark:"☾",ko:"달기와"},{id:"star",mark:"✦",ko:"별기와"},{id:"sun",mark:"☀",ko:"해기와"}];
const rounds=["flower","moon","star"];

export function WhitelistJourney(){
 const[stage,setStage]=useState<Stage>("intro");
 const[round,setRound]=useState(0);const[wrong,setWrong]=useState("");
 const[token,setToken]=useState("");const[session,setSession]=useState<Session|null>(null);
 const[loading,setLoading]=useState(false);const[error,setError]=useState("");
 const target=useMemo(()=>giwa.find(x=>x.id===rounds[round])!,[round]);

 async function choose(id:string){if(loading)return;if(id!==target.id){setWrong(id);setTimeout(()=>setWrong(""),420);return}if(round<2){setRound(v=>v+1);return}setLoading(true);setError("");try{const r=await fetch('/api/whitelist/assembly',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({completed:true})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Could not unlock whitelist.');setToken(j.token);setStage('application')}catch(e){setError(e instanceof Error?e.message:'Could not unlock whitelist.')}finally{setLoading(false)}}

 async function apply(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const f=new FormData(e.currentTarget);const body={...Object.fromEntries(f),accepted:f.get('accepted')==='on',assembly_token:token};try{const r=await fetch('/api/whitelist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Application failed.');setSession({applicationId:j.applicationId,tileNumber:j.tileNumber});setStage('signal')}catch(e){setError(e instanceof Error?e.message:'Application failed.')}finally{setLoading(false)}}

 async function verify(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!session)return;setLoading(true);setError("");const url=String(new FormData(e.currentTarget).get('x_post_url')||'');try{const r=await fetch('/api/whitelist/verify-x',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({applicationId:session.applicationId,xPostUrl:url})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Verification failed.');setStage('verified')}catch(e){setError(e instanceof Error?e.message:'Verification failed.')}finally{setLoading(false)}}

 const post=session?siteConfig.createSignalPost(session.tileNumber):"";const intent=`https://x.com/intent/post?text=${encodeURIComponent(post)}`;
 return <main className={`tile-world stage-${stage}`}>
  <div className="world-shade"/><div className="world-grain"/>
  <header className="world-header"><button className="tile-brand" onClick={()=>setStage('intro')}><span className="tile-seal">T</span><span><b>TILE</b><small>타일 · 1111</small></span></button><a className="x-chip" href={siteConfig.xUrl} target="_blank" rel="noreferrer">𝕏</a></header>

  {stage==='intro'&&<section className="hero-ritual"><div className="hero-emblem">✿</div><p className="overline">A KOREAN-BORN NFT COLLECTION</p><h1>TILE</h1><p className="hero-count">1111 ARE HIDING</p><p className="hero-ko">한 장씩, 이야기를 완성하다.</p><button className="stone-cta" onClick={()=>setStage('game')}><span>ENTER WHITELIST</span><ChevronRight/><small>기와를 찾고, 당신의 타일을 남기세요</small></button><div className="hero-meta"><span>1111 PIECES</span><span>KOREAN HERITAGE</span><span>ONE STORY</span></div></section>}

  {stage!=='intro'&&<section className="ritual-shell"><button className="back-link" onClick={()=>setStage('intro')}><ArrowLeft size={15}/> RETURN TO COURTYARD</button><div className="ritual-head"><div><p className="overline">WHITELIST RITUAL · 화이트리스트</p><h2>{stage==='game'?'READ THE ROOF':stage==='application'?'LEAVE YOUR MARK':stage==='signal'?'SEND THE SIGNAL':'YOUR TILE IS MARKED'}</h2></div><div className="ritual-progress">{['GIWA','APPLY','SIGNAL','DONE'].map((s,i)=><span key={s} className={i<={game:0,application:1,signal:2,verified:3}[stage]?'on':''}>{String(i+1).padStart(2,'0')} {s}</span>)}</div></div>

   {stage==='game'&&<div className="ritual-grid"><aside className="story-panel"><p className="chapter">01 · 기와</p><h3>Find the tile hidden in the roof.</h3><p>A hanok roof is made one giwa at a time. Choose the requested symbol three times to unlock your application.</p><div className="target-plaque"><small>ROUND {round+1} / 3 · FIND</small><strong>{target.mark}</strong><span>{target.ko}</span></div></aside><div><div className="roof-choice-grid">{giwa.map(t=><button key={t.id} className={`roof-choice ${wrong===t.id?'wrong':''}`} onClick={()=>choose(t.id)}><span className="roof-ridge"/><b>{t.mark}</b><span>{t.ko}</span><small>GIWA</small>{rounds.slice(0,round).includes(t.id)&&<Check className="picked" size={18}/>}</button>)}</div>{error&&<p className="ritual-error">{error}</p>}</div></div>}

   {stage==='application'&&<form onSubmit={apply} className="ritual-grid"><aside className="story-panel"><p className="chapter">02 · 신청</p><h3>Leave your mark in TILE.</h3><p>Your application receives a participant TILE number before the X signal step.</p><div className="number-plaque"><strong>1111</strong><small>PIECES · ONE STORY</small></div></aside><div className="form-grid"><Field label="X USERNAME *"><input name="x_username" required maxLength={16} pattern="@?[A-Za-z0-9_]+" placeholder="@username"/></Field><Field label="WALLET ADDRESS *"><input name="wallet_address" required minLength={20} maxLength={128} placeholder="0x…"/></Field><Field wide label="TELEGRAM / DISCORD"><input name="social_contact" maxLength={128} placeholder="Optional"/></Field><Field wide label="WHY TILE? *"><textarea name="reason" required minLength={10} maxLength={1000} placeholder="Tell us something real…"/></Field><Field wide label="HOW DID YOU FIND TILE? *"><select name="discovery_source" required defaultValue=""><option value="" disabled>Select one</option><option>X</option><option>Friend</option><option>GIWA Community</option><option>Telegram</option><option>Other</option></select></Field><label className="consent"><input type="checkbox" name="accepted" required/> I understand that applying does not guarantee whitelist allocation.</label>{error&&<p className="ritual-error wide">{error}</p>}<button className="ritual-button wide" disabled={loading}>{loading?'SUBMITTING…':'SUBMIT APPLICATION'}<ChevronRight/></button></div></form>}

   {stage==='signal'&&session&&<div className="ritual-grid"><aside className="story-panel"><p className="chapter">03 · 신호</p><h3>Carry your TILE beyond the courtyard.</h3><p>Your application is recorded. Share the prepared signal on X, then return with the post link.</p><div className="id-plaque"><small>YOUR PARTICIPANT TILE</small><strong>TILE #{formatTileNumber(session.tileNumber)}</strong></div></aside><div className="signal-panel"><pre>{post}</pre><a className="ritual-button inline" href={intent} target="_blank" rel="noreferrer">POST ON X <ArrowUpRight size={17}/></a><form onSubmit={verify} className="verify-form"><Field label="PASTE YOUR X POST LINK"><input name="x_post_url" required type="url" placeholder="https://x.com/username/status/..."/></Field>{error&&<p className="ritual-error">{error}</p>}<button className="ritual-button" disabled={loading}>{loading?'VERIFYING…':'VERIFY WL REQUEST'}<Check size={17}/></button></form></div></div>}

   {stage==='verified'&&session&&<div className="done-stage"><div className="done-seal">✿</div><p className="overline">SIGNAL VERIFIED · 확인 완료</p><h3>TILE #{formatTileNumber(session.tileNumber)}</h3><p>Your whitelist request is verified.</p><small>Final whitelist allocation remains subject to TILE team selection.</small></div>}
  </section>}
 </main>
}

function Field({label,wide,children}:{label:string;wide?:boolean;children:React.ReactNode}){return <label className={`field ${wide?'wide':''}`}><span>{label}</span>{children}</label>}
