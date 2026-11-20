// 버튼용 선 글리프 (12x12)
export const glyphs = {
  close: 'M3 3l6 6M9 3l-6 6',
  prev: 'M7.5 2.5 4 6l3.5 3.5',
  next: 'M4.5 2.5 8 6l-3.5 3.5',
  star: 'M6 1.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1L6 8.6l-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z',
};

export function Glyph({ grid }: { grid: string }) {
  return (
    <svg className="inv__glyph" viewBox="0 0 12 12" aria-hidden>
      <path d={grid} />
    </svg>
  );
}
