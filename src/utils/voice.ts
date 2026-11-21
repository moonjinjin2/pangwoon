// 더빙 음성 파일 (src/voice/**/*.mp3)을 빌드에 포함하고 'ep1/민지1' 같은 키로 찾음
const files = import.meta.glob<string>('../voice/**/*.mp3', { eager: true, query: '?url', import: 'default' });

// macOS에서 넣은 한글 파일 이름은 자모가 분리된 형태(NFD)라 코드에 쓴 이름(NFC)과 맞춰서 비교
const VOICES: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.slice('../voice/'.length, -'.mp3'.length).normalize('NFC'), url]),
);

// 음성 파일 주소 (없는 키면 undefined)
export function voiceUrl(key: string): string | undefined {
  const url = VOICES[key.normalize('NFC')];
  if (!url && import.meta.env.DEV) console.warn(`[voice] 음성 파일 없음: src/voice/${key}.mp3`);
  return url;
}
