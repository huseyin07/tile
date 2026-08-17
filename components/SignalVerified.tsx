"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { formatTileNumber } from "@/lib/site-config";

export function SignalVerified({ tileNumber }: { tileNumber: number }) {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-2">
      <div>
        <div className="flex items-center gap-3 text-blue"><Check size={20} /><span className="eyebrow !text-blue">SIGNAL VERIFIED</span></div>
        <p lang="ko" className="mt-3 text-xs text-steel">신호 확인 완료</p>
        <h3 className="mt-10 font-mono text-5xl sm:text-7xl">TILE #{formatTileNumber(tileNumber)}</h3>
        <p className="mt-8 text-xl">Your whitelist request is now verified.</p>
        <p className="mt-4 max-w-xl text-sm leading-6 text-steel">X post link verified. Verification does not guarantee a whitelist allocation. Final whitelist selection is managed by the TILE team.</p>
      </div>
      <div aria-hidden="true" className="mx-auto grid aspect-square w-full max-w-[430px] grid-cols-4 gap-1 border border-line p-4">
        {Array.from({ length: 16 }, (_, index) => (
          <motion.div
            key={index}
            initial={{ x: ((index % 4) - 1.5) * 18, y: (Math.floor(index / 4) - 1.5) * 18, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.25 + (index % 5) * 0.12 }}
            transition={{ delay: index * 0.045, duration: 0.55, ease: "easeOut" }}
            className="border border-blue/50 bg-blue/30"
          />
        ))}
      </div>
    </div>
  );
}
