// 금색 네 갈래 별 장식 (가운데 붉은 마름모)
export default function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden>
      <path d="M10 1 11.2 8.8 19 10 11.2 11.2 10 19 8.8 11.2 1 10 8.8 8.8z" />
      <path d="M10 7.6 12.4 10 10 12.4 7.6 10z" className="sparkle__gem" />
    </svg>
  );
}
