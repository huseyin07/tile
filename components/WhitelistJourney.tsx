"use client";

import { useEffect, useState } from "react";
import { TileAssembly } from "@/components/TileAssembly";
import { WhitelistForm } from "@/components/WhitelistForm";
import { WhitelistProgress } from "@/components/WhitelistProgress";
import { XSignal } from "@/components/XSignal";
import { SignalVerified } from "@/components/SignalVerified";

type Stage = "assembly" | "application" | "signal" | "verified";
type Session = { applicationId: string; tileNumber: number };

export function WhitelistJourney() {
  const [stage, setStage] = useState<Stage>("assembly");
  const [assemblyToken, setAssemblyToken] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("tile_assembly_token") || "";
    const savedSession = sessionStorage.getItem("tile_application_session");
    const savedStage = sessionStorage.getItem("tile_journey_stage") as Stage | null;
    setAssemblyToken(token);
    if (savedSession) {
      try { setSession(JSON.parse(savedSession)); } catch { sessionStorage.removeItem("tile_application_session"); }
    }
    if (["application", "signal", "verified"].includes(savedStage || "")) setStage(savedStage!);
    else if (token) setStage("application");
    setReady(true);
  }, []);

  function assemblyComplete(token: string) {
    setAssemblyToken(token);
    setStage("application");
    sessionStorage.setItem("tile_journey_stage", "application");
  }

  function applicationSubmitted(applicationId: string, tileNumber: number) {
    const next = { applicationId, tileNumber };
    setSession(next);
    setStage("signal");
    sessionStorage.setItem("tile_application_session", JSON.stringify(next));
    sessionStorage.setItem("tile_journey_stage", "signal");
  }

  if (!ready) return <section id="whitelist" className="min-h-[700px] border-b border-line bg-[#0b0f14]" />;
  const active = { assembly: 0, application: 1, signal: 2, verified: 3 }[stage];

  return (
    <section id="whitelist" className="border-b border-line bg-[#0b0f14]">
      <div className="section">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow">TILE ACTIVATION / WL-1111</p><h2 className="mt-5 text-5xl tracking-[-.05em] sm:text-7xl">Enter the picture.</h2></div>
          <p className="max-w-xs text-xs leading-5 text-steel">ASSEMBLY → APPLICATION → SIGNAL → VERIFIED<br /><span lang="ko">조립 · 신청 · 신호 · 확인</span></p>
        </div>
        <WhitelistProgress active={active} />
        <div className="mt-16 min-h-[560px]">
          {stage === "assembly" && <TileAssembly onComplete={assemblyComplete} />}
          {stage === "application" && <WhitelistForm assemblyToken={assemblyToken} onSubmitted={applicationSubmitted} />}
          {stage === "signal" && session && <XSignal {...session} onVerified={() => setStage("verified")} />}
          {stage === "verified" && session && <SignalVerified tileNumber={session.tileNumber} />}
        </div>
      </div>
    </section>
  );
}
