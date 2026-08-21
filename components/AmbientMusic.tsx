"use client";

import {useEffect,useRef,useState} from "react";

const TRACK="https://pixabay.com/music/download/the-peacock-299337/";

export default function AmbientMusic(){
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const[playing,setPlaying]=useState(true);
  const[ready,setReady]=useState(false);

  useEffect(()=>{
    const audio=new Audio(TRACK);
    audio.loop=true;
    audio.volume=0.12;
    audio.preload="auto";
    audio.autoplay=true;
    audioRef.current=audio;
    setReady(true);

    const start=()=>audio.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));
    start();

    const resumeAfterGesture=()=>{
      if(!audio.paused)return;
      audio.play().then(()=>setPlaying(true)).catch(()=>{});
    };

    window.addEventListener("pointerdown",resumeAfterGesture,{passive:true});
    window.addEventListener("keydown",resumeAfterGesture);
    window.addEventListener("touchstart",resumeAfterGesture,{passive:true});

    return()=>{
      window.removeEventListener("pointerdown",resumeAfterGesture);
      window.removeEventListener("keydown",resumeAfterGesture);
      window.removeEventListener("touchstart",resumeAfterGesture);
      audio.pause();
      audio.src="";
    };
  },[]);

  const toggle=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    if(audio.paused){audio.play().then(()=>setPlaying(true)).catch(()=>{});}else{audio.pause();setPlaying(false)}
  };

  if(!ready)return null;

  return <button className={`ambient-music-toggle ${playing?"is-playing":""}`} onClick={toggle} aria-label={playing?"Pause background music":"Play background music"} title={playing?"Pause music":"Play music"}>
    <span className="ambient-bars" aria-hidden="true"><i/><i/><i/></span>
    <span>{playing?"SOUND ON":"SOUND OFF"}</span>
  </button>;
}
