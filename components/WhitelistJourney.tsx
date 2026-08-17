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

  if(!ready)return <section className="korean-landing"><div className="wl-shell"><p className="text-center font-black">화이트리스트 준비 중…</p></div></section>;
  const active={game:0,application:1,signal:2,verified:3}[stage];

  return <section id="whitelist" className="korean-landing">
    <KoreanBackdrop/>
    <div className="wl-shell relative z-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-3xl font-black tracking-[-.05em]">TILE <span lang="ko" className="text-pink">타일</span></p>
          <p lang="ko" className="mt-1 text-xs font-black text-steel">기와에서 시작되는 1,111개의 이야기</p>
        </div>
        <span className="rounded-full border-2 border-ink bg-yellow px-4 py-2 text-xs font-black shadow-sticker">WL OPEN</span>
      </div>

      <div className="mb-6 rounded-[2rem] border-4 border-ink bg-cream/95 p-5 shadow-soft backdrop-blur-sm sm:p-7">
        <div className="mb-7 text-center">
          <p lang="ko" className="text-sm font-black text-pink">어서 와! 화이트리스트에 도전해 봐.</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-.06em] sm:text-6xl">GET YOUR TILE.</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-6 text-steel">Start with the GIWA mini-game, complete your application, post your prepared TILE signal on X, then paste the link back to verify your WL request.</p>
        </div>
        <WhitelistProgress active={active}/>
        <div className="mt-7">
          {stage==='game'&&<GiwaGame onComplete={gameComplete}/>} 
          {stage==='application'&&token&&<WhitelistForm assemblyToken={token} onSubmitted={submitted}/>} 
          {stage==='signal'&&session&&<XSignal {...session} onVerified={()=>{setStage('verified');sessionStorage.setItem('tile_journey_stage','verified')}}/>}
          {stage==='verified'&&session&&<SignalVerified tileNumber={session.tileNumber}/>} 
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-[10px] font-black text-steel">
        <span lang="ko">작은 기와 하나가 큰 그림을 만듭니다.</span>
        <span>1111 TILEs · ONE BIGGER PICTURE</span>
      </div>
    </div>
  </section>
}

function KoreanBackdrop(){return <div className="k-scene" aria-hidden="true">
  <div className="k-sun"/>
  <div className="k-cloud k-cloud-a"/>
  <div className="k-cloud k-cloud-b"/>
  <div className="k-tree"><div className="k-trunk"/><div className="k-branch b1"/><div className="k-branch b2"/><div className="k-leaves l1"/><div className="k-leaves l2"/><div className="k-leaves l3"/></div>
  <div className="k-house k-house-left"><div className="k-roof"/><div className="k-wall"><span>타일</span></div></div>
  <div className="k-house k-house-right"><div className="k-roof"/><div className="k-wall"><span>기와</span></div></div>
  <div className="k-ground"/>
</div>}
