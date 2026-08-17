"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCw } from "lucide-react";

const initialRotations = [1, 3, 2, 1, 2, 3, 2, 1, 3];

export function TileAssembly({ onComplete }: { onComplete: (token: string) => void }) {
  const [started, setStarted] = useState(false);
  const [rotations, setRotations] = useState(initialRotations);
  const [connecting, setConnecting] = useState(false);
  const [completionToken, setCompletionToken] = useState("");
  const [error, setError] = useState("");
  const complete = rotations.every((rotation) => rotation === 0);

  async function rotate(index: number) {
    if (connecting || complete) return;
    const next = rotations.map((value, tile) => (tile === index ? (value + 1) % 4 : value));
    setRotations(next);
    if (next.every((rotation) => rotation === 0)) {
      await requestCompletionToken();
    }
  }

  async function requestCompletionToken() {
    setConnecting(true);
    setError("");
    try {
      const response = await fetch("/api/whitelist/assembly", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: true }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      sessionStorage.setItem("tile_assembly_token", payload.token);
      setCompletionToken(payload.token);
    } catch {
      setError("The assembly could not connect. Please try again.");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[.75fr_1.25fr]">
      <div>
        <p className="eyebrow">TILE ASSEMBLY · <span lang="ko">타일 조립</span></p>
        <h3 className="mt-6 text-4xl tracking-[-.04em] sm:text-5xl">Every picture begins with a piece.</h3>
        <p className="mt-6 max-w-md text-sm leading-6 text-steel">
          Rotate each architectural fragment until its lines connect into one continuous TILE.
        </p>
        {!started && (
          <button
            onClick={() => setStarted(true)}
            className="focusable mt-9 inline-flex items-center gap-8 bg-white px-6 py-4 text-xs font-bold tracking-widest text-ink"
          >
            BEGIN ASSEMBLY <span lang="ko" className="font-normal">조립 시작</span><ArrowRight size={15} />
          </button>
        )}
        {started && (
          <div aria-live="polite" className="mt-9 border-l border-blue pl-4 font-mono text-[10px] tracking-[.16em] text-blue">
            {connecting ? "ASSEMBLY COMPLETE · 조립 완료" : "CONNECTING TILE · 타일 연결 중"}
          </div>
        )}
        {completionToken && (
          <button
            onClick={() => onComplete(completionToken)}
            className="focusable mt-6 inline-flex items-center gap-8 border border-blue px-6 py-4 text-xs font-bold tracking-widest text-blue"
          >
            CONTINUE APPLICATION <span lang="ko" className="font-normal">다음 단계</span><ArrowRight size={15} />
          </button>
        )}
        {error && <div className="mt-5"><p role="alert" className="text-sm text-red-300">{error}</p><button onClick={requestCompletionToken} className="focusable mt-3 text-xs text-blue underline">Retry connection</button></div>}
      </div>

      <div className={`relative mx-auto aspect-square w-full max-w-[520px] border border-line bg-ink p-3 sm:p-5 ${!started ? "opacity-35" : ""}`}>
        <div className="pointer-events-none absolute -left-px -top-7 font-mono text-[9px] text-steel">ASSEMBLY GRID / 03×03</div>
        <div className="grid h-full grid-cols-3 gap-1.5">
          {rotations.map((rotation, index) => (
            <motion.button
              key={index}
              aria-label={`Rotate assembly tile ${index + 1}`}
              disabled={!started || connecting || complete}
              onClick={() => rotate(index)}
              animate={{ rotate: rotation * 90, scale: complete ? 0.97 : 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="focusable relative overflow-hidden border border-blue/20 bg-[#111923] disabled:cursor-default"
            >
              <span className="absolute left-1/2 top-0 h-1/2 w-px bg-blue/80" />
              <span className="absolute left-1/2 top-1/2 h-px w-1/2 bg-blue/80" />
              <span className="absolute left-[calc(50%-3px)] top-[calc(50%-3px)] h-[7px] w-[7px] border border-blue bg-ink" />
              <RotateCw className="absolute bottom-2 right-2 text-steel/30" size={12} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
