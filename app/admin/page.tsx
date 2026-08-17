"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatTileNumber } from "@/lib/site-config";

type Application = {
  id: string; applicant_tile_number: number; x_username: string; wallet_address: string;
  social_contact: string | null; discovery_source: string; assembly_completed: boolean;
  x_post_url: string | null; x_verified_at: string | null; verification_status: string;
  status: string; created_at: string;
};

export default function Admin() {
  const [items, setItems] = useState<Application[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/applications");
    setAuthenticated(response.ok);
    if (response.ok) setItems(await response.json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password"));
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (response.ok) void load(); else setAuthenticated(false);
  }
  async function updateStatus(id: string, status: string) {
    const response = await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) setItems((all) => all.map((item) => item.id === id ? { ...item, status } : item));
  }
  const filtered = useMemo(() => items.filter((item) =>
    `${item.x_username} ${item.wallet_address} ${item.applicant_tile_number}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const count = (status: string) => items.filter((item) => item.status === status).length;

  if (authenticated !== true) return <main className="mesh flex min-h-screen items-center justify-center p-6"><form onSubmit={login} className="w-full max-w-sm border border-line bg-ink p-8"><p className="eyebrow">RESTRICTED · 관리자</p><h1 className="mt-4 text-3xl">TILE Admin</h1><input name="password" type="password" required placeholder="Admin password" className="focusable mt-8 w-full border border-line bg-transparent p-3" /><button className="mt-3 w-full bg-white p-3 text-sm font-bold text-ink">Enter</button>{authenticated === false && <p className="mt-3 text-sm text-red-300">Access denied.</p>}</form></main>;

  return (
    <main className="min-h-screen p-6 sm:p-12"><div className="mx-auto max-w-[1500px]">
      <p className="eyebrow">OPERATIONS / WHITELIST · 신청 관리</p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-5"><h1 className="text-5xl">Applications</h1><input aria-label="Search applications" className="focusable border border-line bg-transparent px-4 py-3 text-sm" placeholder="Search X, wallet, or TILE ID" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <div className="mt-12 grid grid-cols-2 border border-line md:grid-cols-5">{[["Total", items.length], ["Pending Verification", count("pending_verification")], ["Verified", count("verified")], ["Whitelisted", count("whitelisted")], ["Rejected", count("rejected")]].map(([label, value]) => <div className="border-r border-line p-5" key={label}><p className="text-xs text-steel">{label}</p><p className="mt-2 text-3xl">{value}</p></div>)}</div>
      <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[1250px] text-left text-sm"><thead className="border-b border-line text-xs text-steel"><tr>{["TILE ID", "X / Wallet", "Social", "Discovery", "Assembly", "X Post", "Verification", "Date", "Status"].map((heading) => <th className="py-4 pr-6 font-normal" key={heading}>{heading}</th>)}</tr></thead><tbody>{filtered.map((application) => <tr key={application.id} className="border-b border-line"><td className="py-4 pr-6 font-mono">#{formatTileNumber(application.applicant_tile_number)}</td><td className="max-w-56 py-4 pr-6"><span>@{application.x_username}</span><span className="mt-1 block truncate font-mono text-[10px] text-steel">{application.wallet_address}</span></td><td className="pr-6 text-steel">{application.social_contact || "—"}</td><td className="pr-6">{application.discovery_source}</td><td className="pr-6 text-xs">{application.assembly_completed ? "COMPLETE" : "INCOMPLETE"}</td><td className="pr-6">{application.x_post_url ? <a className="focusable inline-flex items-center gap-1 text-blue" href={application.x_post_url} target="_blank" rel="noopener noreferrer">Open <ArrowUpRight size={13} /></a> : "—"}</td><td className="pr-6 text-xs text-steel">{application.verification_status?.replaceAll("_", " ") || "—"}</td><td className="pr-6 text-steel">{new Date(application.created_at).toLocaleDateString()}</td><td><StatusControl application={application} update={updateStatus} /></td></tr>)}</tbody></table></div>
    </div></main>
  );
}

function StatusControl({ application, update }: { application: Application; update: (id: string, status: string) => void }) {
  const options: Record<string, string[]> = { verified: ["verified", "whitelisted", "rejected"], whitelisted: ["whitelisted", "verified"], rejected: ["rejected", "verified"] };
  if (!options[application.status]) return <span className="text-xs text-steel">{application.status.replaceAll("_", " ")}</span>;
  return <select aria-label={`Status for TILE ${application.applicant_tile_number}`} value={application.status} onChange={(event) => update(application.id, event.target.value)} className="focusable border border-line bg-ink p-2"><option value={application.status}>{application.status.replaceAll("_", " ")}</option>{options[application.status].filter((status) => status !== application.status).map((status) => <option key={status} value={status}>{status}</option>)}</select>;
}
