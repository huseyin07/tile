"use client";

import {useEffect,useRef,useState} from "react";

const TRACK="https://pixabay.com/music/download/the-peacock-299337/";

export default function AmbientMusic(){
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const[playing,setPlaying]=useState(false);
  const[ready,setReady]=useState(false);

  useEffect(()=>{
    const audio=new Audio(TRACK);
    audio.loop=true;
    audio.volume=0.12;
    audio.preload="none";
    audioRef.current=audio;
    setReady(true);

    const tryStart=()=>{
      audio.play().then(()=>setPlaying(true)).catch(()=>{});
      window.removeEventListener("pointerdown",tryStart);
      window.removeEventListener("keydown",tryStart);
      window.removeEventListener("touchstart",tryStart);
    };

    window.addEventListener("pointerdown",tryStart,{once:true});
    window.addEventListener("keydown",tryStart,{once:true});
    window.addEventListener("touchstart",tryStart,{once:true,passive:true});

    return()=>{
      window.removeEventListener("pointerdown",tryStart);
      window.removeEventListener("keydown",tryStart);
      window.removeEventListener("touchstart",tryStart);
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
