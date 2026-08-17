"use client";

import { FormEvent, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight,
  Gift, Home, Link2, ShieldCheck, Sparkles, Users, WalletCards
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type Stage = "home" | "tasks" | "form" | "share" | "done";
type Session = { applicationId: string; tileNumber: number };

const faqs = [
  ["Where will TILE mint?", "TILE is planned to mint first on Robinhood Chain mainnet."],
  ["When is the mint?", "Mint date is TBA. Official updates will be shared through @TileOnGIWA."],
  ["What happens when GIWA mainnet is live?", "The collection is planned to move from Robinhood Chain to GIWA once GIWA mainnet is live."],
  ["What do TILE holders receive on GIWA?", "TILE holders will be rewarded on GIWA. Reward details will be announced separately."],
  ["Does a verified application guarantee whitelist?", "No. Verification confirms the application flow was completed. Final whitelist selection remains with the TILE team."],
];

export function WhitelistJourney() {
  const [stage, setStage] = useState<Stage>("home");
  const [checks, setChecks] = useState([false, false, false, false]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const allDone = checks.every(Boolean);
  const toggle = (i: number) => setChecks(v => v.map((x, n) => n === i ? !x : x));

  async function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/whitelist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ x_username: f.get("x_username"), wallet_address: f.get("wallet_address"), tasks_confirmed: allDone }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Application failed.");
      setSession({ applicationId: j.applicationId, tileNumber: j.tileNumber }); setStage("share");
    } catch (e) { setError(e instanceof Error ? e.message : "Application failed."); } finally { setLoading(false); }
  }

  async function verify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!session) return; setLoading(true); setError("");
    const url = String(new FormData(e.currentTarget).get("x_post_url") || "");
    try {
      const r = await fetch("/api/whitelist/verify-x", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId: session.applicationId, xPostUrl: url }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Verification failed."); setStage("done");
    } catch (e) { setError(e instanceof Error ? e.message : "Verification failed."); } finally { setLoading(false); }
  }

  const shareText = siteConfig.createSignalPost();
  const intent = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;

  return <main className="tile-site">
    <nav className="nav">
      <button className="brand" onClick={() => setStage("home")}><span className="brand-mark">✿</span><span>TILE<small>타일 · 기와</small></span></button>
      <div className="nav-links"><a href="#home">HOME</a><a href="#story">ABOUT</a><a href="#journey">ROADMAP</a><a href="#faq">FAQ</a><a href={siteConfig.xUrl} target="_blank" rel="noreferrer">𝕏</a><button className="nav-wl" onClick={() => setStage("tasks")}>JOIN WHITELIST</button></div>
    </nav>

    {stage === "home" ? <>
      <section id="home" className="hero">
        <div className="roof-pattern"/><div className="hero-sun"/><div className="hero-pine hero-pine-a"/><div className="hero-pine hero-pine-b"/><div className="hero-film"/>
        <div className="hero-copy">
          <div className="hero-emblem">✿</div><p className="hero-ko-label">시작 · BEGIN · 기와에서 시작되는 이야기</p><h1>TILE</h1>
          <p className="hero-line">THE ROOF THAT PROTECTS.<br/>THE COMMUNITY THAT BUILDS.</p>
          <div className="hero-stats">
            <div><Home/><b>1,111</b><span>UNIQUE<br/>TILEs</span></div>
            <div><Link2/><b>MINT ON</b><span>ROBINHOOD CHAIN<br/>MAINNET</span></div>
            <div><span className="giwa-g">G</span><b>MOVE TO GIWA</b><span>WHEN GIWA<br/>MAINNET IS LIVE</span></div>
            <div><Gift/><b>GIWA REWARDS</b><span>REWARDS FOR<br/>TILE HOLDERS</span></div>
          </div>
          <div className="hero-actions"><button className="hero-cta primary" onClick={() => setStage("tasks")}>JOIN WHITELIST <ArrowUpRight size={18}/></button><a className="hero-cta secondary" href="#story">LEARN MORE <ChevronDown size={18}/></a></div>
        </div>
        <div className="scroll-cue"><span>아래로 · SCROLL TO DISCOVER</span><ArrowDown size={18}/></div>
        <div className="side-rail"><b>시작</b><span/><i>연결</i><i>이동</i><i>보상</i></div>
      </section>

      <section id="story" className="story-section motif-section">
        <div className="story-copy"><p className="eyebrow">WHAT IS TILE? · 타일이란?</p><h2>ONE TILE.<br/>ONE STORY.</h2><p>In Korean architecture, <b>giwa (기와)</b> are the traditional roof tiles that protect and shape a hanok. One tile may feel small on its own. Together, they create something built to endure.</p><p><b>TILE follows the same idea.</b> 1,111 individual pieces. Each different. Each part of something bigger.</p><blockquote>한 장의 기와가 모여 하나의 지붕을 만든다.<small>One tile becomes part of something greater.</small></blockquote></div>
        <div className="story-card"><div className="giwa-object"><span>✿</span></div><div><p className="eyebrow">GIWA · 기와</p><h3>PROTECTING WHAT MATTERS.<br/>BUILDING WHAT&apos;S NEXT.</h3></div></div>
      </section>

      <section className="why1111"><div className="big-number">1111</div><div><p className="eyebrow">WHY 1111? · 왜 1111?</p><h2>NOT A CROWD.<br/>A ROOF.</h2><p>1,111 is the shape of the first TILE collection: limited enough for every piece to carry identity, large enough to form a real community. Like a hanok roof, the meaning comes from individual pieces becoming one structure.</p><span className="korean-note">서로 다른 기와, 하나의 지붕.</span></div></section>

      <section className="mint-state">
        <div className="mint-state-head"><p className="eyebrow">MINT STATUS · 민팅 상태</p><span className="live-dot"><i/> NOT LIVE</span></div>
        <div className="mint-console"><div><small>COLLECTION</small><strong>TILE</strong><span>1,111 NFTs</span></div><div><small>NETWORK</small><strong>ROBINHOOD CHAIN</strong><span>MAINNET</span></div><div><small>DATE</small><strong>TBA</strong><span>TO BE ANNOUNCED</span></div><div><small>NEXT</small><strong>GIWA</strong><span>WHEN MAINNET IS LIVE</span></div></div>
        <p className="mint-note">민팅 준비 중 · Minting is not live yet. Official updates will come from <a href={siteConfig.xUrl} target="_blank" rel="noreferrer">@TileOnGIWA</a>.</p>
      </section>

      <section className="wl-story motif-section">
        <div className="section-intro"><p className="eyebrow">THE WHITELIST JOURNEY · 화이트리스트</p><h2>FIVE MOVES.<br/>ONE APPLICATION.</h2><p>The whitelist is a short participation flow, not a puzzle. Complete the signal, leave your wallet, share TILE, then verify your post.</p></div>
        <div className="wl-story-track">{[["FOLLOW","팔로우","@TileOnGIWA",Users],["ENGAGE","참여","Like · Repost · Tag 2",Sparkles],["APPLY","신청","X + EVM Wallet",WalletCards],["SHARE","공유","Prepared X Post",ArrowUpRight],["VERIFY","확인","Paste Post URL",ShieldCheck]].map(([t,k,d,Icon]:any)=><div className="wl-story-step" key={String(t)}><span>{k}</span><Icon size={22}/><b>{t}</b><small>{d}</small></div>)}</div>
        <button className="wide-wl-cta" onClick={() => setStage("tasks")}>START WHITELIST APPLICATION <ArrowRight/></button>
      </section>

      <section id="journey" className="migration-section motif-section">
        <div className="migration-copy"><p className="eyebrow">THE NETWORK JOURNEY · 네트워크 여정</p><h2>ROBINHOOD<br/>→ GIWA</h2><p>TILE begins on Robinhood Chain mainnet. When GIWA mainnet is live, the collection is planned to move to GIWA. That is where the next chapter begins — and where TILE holders will be rewarded.</p><div className="micro-legend"><span>시작 · BEGIN</span><span>이동 · MOVE</span><span>보상 · REWARD</span></div></div>
        <div className="migration-stage"><div className="migration-track"><div className="moving-tile">✿</div></div><div className="migration-flow"><div className="network-node"><small>시작 · MINT</small><strong>ROBINHOOD<br/>CHAIN</strong><span>MAINNET · DATE TBA</span></div><div className="transfer-line"><i/><ArrowRight/><i/></div><div className="network-node active"><small>이동 · MIGRATE</small><strong>GIWA</strong><span>WHEN MAINNET IS LIVE</span></div><div className="transfer-line"><i/><ArrowRight/><i/></div><div className="network-node reward"><small>보상 · HOLD</small><strong>REWARDS</strong><span>FOR TILE HOLDERS ON GIWA</span></div></div></div>
      </section>

      <section id="faq" className="faq-section"><div className="faq-title"><p className="eyebrow">FAQ · 자주 묻는 질문</p><h2>THE IMPORTANT<br/>PARTS.</h2><p>Everything that should be clear before you apply.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><article className={openFaq===i?"open":""} key={q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>0{i+1}</span><b>{q}</b><ChevronDown/></button>{openFaq===i&&<p>{a}</p>}</article>)}</div></section>

      <section className="final-cta"><div className="foundation-mark">✿</div><div><p className="eyebrow">함께 지붕을 만들다 · BUILD THE ROOF TOGETHER</p><h2>ONE TILE AT A TIME.</h2><p>1,111 pieces. Robinhood Chain first. GIWA next.</p></div><button onClick={() => setStage("tasks")}>JOIN WHITELIST <ArrowUpRight/></button></section>

      <footer className="footer"><div className="footer-brand"><span className="brand-mark">✿</span><div><b>TILE</b><small>한 장의 기와가 모여 하나의 지붕을 만든다.</small></div></div><div className="footer-meta"><span>1,111 TILEs</span><span>ROBINHOOD → GIWA</span><a href={siteConfig.xUrl} target="_blank" rel="noreferrer">@TileOnGIWA ↗</a></div></footer>
    </> :
    <section className="wl-experience"><div className="wl-backdrop"/><div className="wl-wrap">
      <button className="close-wl" onClick={() => setStage("home")}>← BACK TO TILE</button>
      <div className="wl-heading"><p className="eyebrow">TILE WHITELIST · 화이트리스트</p><h2>{stage === "tasks" ? "COMPLETE THE SIGNAL" : stage === "form" ? "LEAVE YOUR MARK" : stage === "share" ? "SHARE TILE" : "APPLICATION VERIFIED"}</h2><div className="wl-progress">{["SIGNAL · 신호","APPLY · 신청","SHARE · 공유","VERIFY · 확인"].map((x,i)=><span className={i <= ({tasks:0,form:1,share:2,done:3} as const)[stage]?"active":""} key={x}><i className="progress-seal">✿</i>{x}</span>)}</div></div>
      {stage === "tasks" && <div className="task-layout"><aside><p className="step">STEP 01 · 신호</p><h3>Earn your place under the roof.</h3><p>Complete the X tasks, then continue with your EVM wallet.</p><div className="seal-1111">TILE<small>기와 · WHITELIST SIGNAL</small></div></aside><div className="task-list">{[["FOLLOW @TileOnGIWA","Follow the official TILE account.",siteConfig.xUrl],["LIKE THE WL POST","Like the official whitelist announcement.",siteConfig.whitelistPostUrl],["REPOST THE WL POST","Repost the whitelist announcement.",siteConfig.whitelistPostUrl],["TAG 2 FRIENDS","Reply to the WL post and tag two friends.",siteConfig.whitelistPostUrl]].map(([title,desc,url],i)=><div className={`task ${checks[i]?"checked":""}`} key={title}><button className="task-check" onClick={()=>toggle(i)}>{checks[i]?<span className="task-stamp"><Check/></span>:String(i+1).padStart(2,"0")}</button><div><b>{title}</b><p>{desc}</p></div><a href={url==="#"?undefined:url} target={url==="#"?undefined:"_blank"} rel="noreferrer">{url==="#"?"SOON":"OPEN"} <ArrowUpRight size={14}/></a></div>)}<button disabled={!allDone} className="next-step" onClick={()=>setStage("form")}>CONTINUE APPLICATION <ChevronRight/></button></div></div>}
      {stage === "form" && <form onSubmit={apply} className="application-layout"><aside><p className="step">STEP 02 · 신청</p><h3>Leave your mark.</h3><p>Enter your X username and EVM wallet. Final whitelist selection stays with the TILE team.</p></aside><div className="application-form"><label>X USERNAME<input name="x_username" required pattern="@?[A-Za-z0-9_]+" placeholder="@username"/></label><label>EVM WALLET ADDRESS<input name="wallet_address" required pattern="0x[a-fA-F0-9]{40}" placeholder="0x…"/></label>{error&&<p className="error">{error}</p>}<button disabled={loading}>{loading?"SUBMITTING…":"SUBMIT & CONTINUE"} <ChevronRight/></button></div></form>}
      {stage === "share" && session && <div className="share-layout"><aside><p className="step">STEP 03 · 공유</p><h3>Carry TILE outside.</h3><p>Share the prepared post, return and paste your X post URL.</p></aside><div className="share-panel"><pre>{shareText}</pre><a className="share-button" href={intent} target="_blank" rel="noreferrer">SHARE ON X <ArrowUpRight/></a><form onSubmit={verify}><label>YOUR X POST LINK<input name="x_post_url" required type="url" placeholder="https://x.com/username/status/..."/></label>{error&&<p className="error">{error}</p>}<button disabled={loading}>{loading?"VERIFYING…":"VERIFY & COMPLETE"} <Check/></button></form></div></div>}
      {stage === "done" && <div className="verified"><div className="verified-mark"><span>✿</span><Check/></div><p className="eyebrow">확인 완료 · VERIFIED</p><h3>YOUR TILE SIGNAL<br/>HAS BEEN RECORDED.</h3><p>Your TILE whitelist application has been verified.</p><small>Verification does not guarantee final whitelist allocation. Final selection is made by the TILE team.</small><button onClick={()=>setStage("home")}>RETURN TO TILE</button></div>}
    </div></section>}
  </main>;
}
