"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

const input = "focusable mt-2 w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue focus:outline-none";

type Props = {
  assemblyToken: string;
  onSubmitted: (applicationId: string, tileNumber: number) => void;
};

export function WhitelistForm({ assemblyToken, onSubmitted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(form), accepted: form.get("accepted") === "on", assembly_token: assemblyToken };
    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onSubmitted(result.applicationId, result.tileNumber);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
      <div>
        <p className="eyebrow">STEP 02 · APPLICATION</p>
        <p lang="ko" className="mt-2 text-xs text-steel">신청</p>
        <h3 className="mt-8 text-4xl tracking-[-.04em]">Connect your details.</h3>
        <p className="mt-5 text-sm leading-6 text-steel">Your participant TILE number is assigned after this application is received.</p>
      </div>
      <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
        <label className="text-xs text-steel">X Username *<input className={input} name="x_username" required maxLength={16} pattern="@?[A-Za-z0-9_]+" placeholder="@username" /></label>
        <label className="text-xs text-steel">Wallet Address *<input className={input} name="wallet_address" required minLength={20} maxLength={128} placeholder="0x…" /></label>
        <label className="text-xs text-steel sm:col-span-2">Telegram / Discord<input className={input} name="social_contact" maxLength={128} placeholder="Optional contact" /></label>
        <label className="text-xs text-steel sm:col-span-2">Why do you want to join TILE? *<textarea className={`${input} min-h-32 resize-y`} name="reason" required minLength={10} maxLength={1000} /></label>
        <label className="text-xs text-steel sm:col-span-2">How did you discover TILE? *<select className={input} name="discovery_source" required defaultValue=""><option value="" disabled>Select a source</option>{["X", "Friend", "GIWA Community", "Telegram", "Other"].map((source) => <option key={source}>{source}</option>)}</select></label>
        <label className="flex items-start gap-3 text-xs leading-5 text-steel sm:col-span-2"><input className="focusable mt-1" type="checkbox" name="accepted" required />I understand that submitting this form does not guarantee whitelist allocation.</label>
        {error && <p role="alert" className="text-sm text-red-300 sm:col-span-2">{error}</p>}
        <button disabled={loading} className="focusable flex items-center justify-between bg-white px-5 py-4 text-xs font-bold tracking-widest text-ink disabled:opacity-50 sm:col-span-2">{loading ? "SUBMITTING…" : "SUBMIT APPLICATION"}<ArrowRight size={16} /></button>
      </form>
    </div>
  );
}
