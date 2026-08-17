"use client";
import {useEffect,useState} from "react";
import {GiwaGame} from "@/components/GiwaGame";
import {WhitelistForm} from "@/components/WhitelistForm";
import {WhitelistProgress} from "@/components/WhitelistProgress";
import {XSignal} from "@/components/XSignal";
import {SignalVerified} from "@/components/SignalVerified";

type Stage="intro"|"game"|"application"|"signal"|"verified";
type Session={applicationId:string;tileNumber:number};

export function WhitelistJourney(){
  const[stage,setStage]=useState<Stage>("intro");
  const[token,setToken]=useState("");
  const[session,setSession]=useState<Session|null>(null);
  const[ready,setReady]=useState(false);

  useEffect(()=>{
    const savedSession=sessionStorage.getItem("tile_application_session");
    const savedStage=sessionStorage.getItem("tile_journey_stage") as Stage|null;
    const savedToken=sessionStorage.getItem("tile_assembly_token")||"";
    if(savedSession){try{setSession(JSON.parse(savedSession))}catch{sessionStorage.removeItem("tile_application_session")}}
    if(savedToken){setToken(savedToken);if(!savedStage||savedStage==='game'||savedStage==='intro')setStage('application')}
    if(savedStage==='application'||savedStage==='signal'||savedStage==='verified')setStage(savedStage);
    setReady(true);
  },[]);

  function gameComplete(nextToken:string){setToken(nextToken);setStage('application');sessionStorage.setItem('tile_journey_stage','application')}
  function submitted(applicationId:string,tileNumber:number){const next={applicationId,tileNumber};setSession(next);setStage('signal');sessionStorage.setItem('tile_application_session',JSON.stringify(next));sessionStorage.setItem('tile_journey_stage','signal')}

  if(!ready)return <section className="korean-landing"/>;
  const active={game:0,application:1,signal:2,verified:3}[stage as Exclude<Stage,'intro'>] ?? 0;

  if(stage==='intro')return <section className="korean-landing cinematic-home">
    <div className="scene-vignette"/>
    <header className="cinematic-topbar">
      <div><div className="brand-lockup"><span className="brand-seal">T</span><strong>TILE</strong><span lang="ko">타일</span></div><small>1111 PIECES</small></div>
      <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="cinematic-x">𝕏&nbsp; Twitter</a>
    </header>

    <div className="cinematic-center">
      <div className="hero-medallion" aria-hidden="true">✿</div>
      <h1>TILE</h1>
      <p className="hero-subtitle">1111 ARE HIDING</p>
      <p lang="ko" className="hero-korean">한 장씩, 이야기를 완성하다.</p>
      <p className="hero-line">One tile at a time.</p>
      <button onClick={()=>setStage('game')} className="enter-wl">ENTER WHITELIST <span>›</span><small lang="ko">화이트리스트에 참여하고, 타일의 일부가 되세요.</small></button>
    </div>

    <div className="cinematic-info">
      <div><b>1111 PIECES</b><span>총 1111개의 타일</span></div>
      <div><b>KOREAN HERITAGE</b><span>기와와 한옥에서 영감을 받다</span></div>
      <div><b>ONE STORY</b><span>모두가 함께 완성하는 이야기</span></div>
      <div><b>BUILT TOGETHER</b><span>커뮤니티와 함께 만드는 문화</span></div>
    </div>
  </section>;

  return <section id="whitelist" className="korean-landing">
    <div className="scene-vignette"/>
    <div className="wl-shell">
      <header className="mb-5 flex items-center justify-between gap-4 px-1">
        <div>
          <p className="text-3xl font-black tracking-[-.05em] text-white">TILE <span lang="ko" className="wl-gold">타일</span></p>
          <p lang="ko" className="mt-1 text-xs font-semibold text-white/60">기와와 한옥에서 시작되는 1,111개의 조각</p>
        </div>
        <span className="wl-pill rounded-full px-4 py-2 text-xs font-bold">WL OPEN</span>
      </header>

      <div className="wl-glass rounded-[2rem] p-5 sm:p-8">
        <div className="mb-7 text-center">
          <p className="wl-kicker" lang="ko">한국의 기와에서 영감을 받은 NFT 컬렉션</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-.055em] text-white sm:text-6xl">GET YOUR TILE.</h2>
          <p className="wl-muted mx-auto mt-4 max-w-2xl text-sm font-medium leading-6">Complete the GIWA challenge, submit your whitelist application, share the prepared X post, then return with the link to verify your request.</p>
        </div>
        <WhitelistProgress active={active}/>
        <div className="mt-7 border-t wl-divider pt-7">
          {stage==='game'&&<GiwaGame onComplete={gameComplete}/>} 
          {stage==='application'&&token&&<WhitelistForm assemblyToken={token} onSubmitted={submitted}/>} 
          {stage==='signal'&&session&&<XSignal {...session} onVerified={()=>{setStage('verified');sessionStorage.setItem('tile_journey_stage','verified')}}/>}
          {stage==='verified'&&session&&<SignalVerified tileNumber={session.tileNumber}/>} 
        </div>
      </div>
    </div>
  </section>
}
