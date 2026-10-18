export default function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className ? `calendar-icon ${className}` : 'calendar-icon'} viewBox="0 0 16 16" aria-hidden>
      <path d="M1 3h14v12H1z M1 6h14" />
      <path d="M4 1v4 M12 1v4" />
      <path className="calendar-icon__dots" d="M4 9h2v2H4z M7 9h2v2H7z M10 9h2v2h-2z M4 12h2v2H4z M7 12h2v2H7z" />
    </svg>
  );
}
