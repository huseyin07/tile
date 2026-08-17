const steps = [
  ["ASSEMBLE", "타일 조립"],
  ["APPLICATION", "신청"],
  ["SIGNAL", "신호"],
  ["VERIFIED", "확인 완료"],
];

export function WhitelistProgress({ active }: { active: number }) {
  return (
    <ol aria-label="Whitelist activation progress" className="grid grid-cols-4 border-y border-line">
      {steps.map(([english, korean], index) => (
        <li
          key={english}
          aria-current={active === index ? "step" : undefined}
          className={`relative border-r border-line px-2 py-4 last:border-r-0 sm:px-5 ${
            index <= active ? "text-white" : "text-slate-600"
          }`}
        >
          {active === index && <span className="absolute inset-x-0 -top-px h-px bg-blue" />}
          <span className="font-mono text-[9px] text-blue">0{index + 1}</span>
          <span className="mt-2 block text-[9px] tracking-[.12em] sm:text-xs">{english}</span>
          <span lang="ko" className="mt-1 hidden text-[10px] text-steel sm:block">{korean}</span>
        </li>
      ))}
    </ol>
  );
}
