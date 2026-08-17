"use client";
import {useEffect,useState} from "react";
import {GiwaGame} from "@/components/GiwaGame";
import {WhitelistForm} from "@/components/WhitelistForm";
import {WhitelistProgress} from "@/components/WhitelistProgress";
import {XSignal} from "@/components/XSignal";
import {SignalVerified} from "@/components/SignalVerified";

type Stage="game"|"application"|"signal"|"verified";
type Session={applicationId:string;tileNumber:number};

export function WhitelistJourney(){
  const[stage,setStage]=useState<Stage>("game");
  const[token,setToken]=useState("");
  const[session,setSession]=useState<Session|null>(null);
  const[ready,setReady]=useState(false);

  useEffect(()=>{
    const savedSession=sessionStorage.getItem("tile_application_session");
    const savedStage=sessionStorage.getItem("tile_journey_stage") as Stage|null;
    const savedToken=sessionStorage.getItem("tile_assembly_token")||"";
    if(savedSession){try{setSession(JSON.parse(savedSession))}catch{sessionStorage.removeItem("tile_application_session")}}
    if(savedToken){setToken(savedToken);if(!savedStage||savedStage==='game')setStage('application')}
    if(savedStage==='application'||savedStage==='signal'||savedStage==='verified')setStage(savedStage);
    setReady(true);
  },[]);

  function gameComplete(nextToken:string){setToken(nextToken);setStage('application');sessionStorage.setItem('tile_journey_stage','application')}
  function submitted(applicationId:string,tileNumber:number){const next={applicationId,tileNumber};setSession(next);setStage('signal');sessionStorage.setItem('tile_application_session',JSON.stringify(next));sessionStorage.setItem('tile_journey_stage','signal')}

  if(!ready)return <section className="korean-landing"><div className="wl-shell"><div className="wl-glass rounded-3xl p-8 text-center font-bold">화이트리스트 준비 중…</div></div></section>;
  const active={game:0,application:1,signal:2,verified:3}[stage];

  return <section id="whitelist" className="korean-landing">
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
          <h1 className="mt-3 text-4xl font-black tracking-[-.055em] text-white sm:text-6xl">GET YOUR TILE.</h1>
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

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 text-[10px] font-semibold text-white/55">
        <span lang="ko">한 장의 기와, 하나의 조각.</span>
        <span>1111 TILEs · ONE BIGGER PICTURE</span>
      </footer>
    </div>
  </section>
}
