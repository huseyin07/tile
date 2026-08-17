"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatTileNumber, siteConfig } from "@/lib/site-config";

type Props = { applicationId: string; tileNumber: number; onVerified: () => void };

export function XSignal({ applicationId, tileNumber, onVerified }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const post = siteConfig.createSignalPost(tileNumber);
  const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(post)}`;

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const xPostUrl = String(new FormData(event.currentTarget).get("x_post_url") || "");
    try {
      const response = await fetch("/api/whitelist/verify-x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, xPostUrl }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      sessionStorage.setItem("tile_journey_stage", "verified");
      onVerified();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Signal verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
      <div>
        <p className="eyebrow">STEP 03 · SIGNAL TILE</p>
        <p lang="ko" className="mt-2 text-xs text-steel">신호 전송</p>
        <div className="mt-12 border-l border-blue pl-5">
          <span className="text-[10px] tracking-widest text-steel">YOUR TILE</span>
          <strong className="mt-2 block font-mono text-3xl">TILE #{formatTileNumber(tileNumber)}</strong>
          <span lang="ko" className="mt-2 block text-[10px] text-steel">참가자 식별 번호</span>
        </div>
      </div>
      <div>
        <h3 className="text-4xl tracking-[-.04em] sm:text-5xl">Complete your TILE signal.</h3>
        <p className="mt-5 max-w-xl text-sm leading-6 text-steel">
          Share your TILE activation on X, then return here with the post link to verify your application.
        </p>
        <a
          href={intentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focusable mt-8 inline-flex items-center gap-12 bg-white px-6 py-4 text-xs font-bold tracking-widest text-ink"
        >
          POST ON X <ArrowUpRight size={16} />
        </a>
        <form onSubmit={verify} className="mt-12 border-t border-line pt-8">
          <label className="text-xs text-steel">
            VERIFY SIGNAL <span lang="ko" className="ml-2">신호 확인</span>
            <input
              required
              name="x_post_url"
              type="url"
              placeholder="https://x.com/username/status/..."
              className="focusable mt-3 w-full border border-line bg-transparent px-4 py-4 text-sm placeholder:text-slate-600 focus:border-blue focus:outline-none"
            />
          </label>
          <p className="mt-3 text-xs leading-5 text-steel">We verify the post URL and account ownership. Content is checked only when X API access is configured.</p>
          {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          <button disabled={loading} className="focusable mt-6 border border-blue px-6 py-4 text-xs font-bold tracking-widest text-blue disabled:opacity-50">
            {loading ? "VERIFYING…" : "VERIFY SIGNAL"}
          </button>
        </form>
      </div>
    </div>
  );
}
