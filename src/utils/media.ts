import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// 받아둔 움짤 파일 (같은 움짤을 다시 받지 않게)
const gifBlobs = new Map<string, Promise<Blob>>();

// 움짤을 띄울 때마다 첫 프레임부터 재생되게 함
// 같은 주소의 GIF는 브라우저가 재생 위치를 이어가서 중간부터 나올 수 있으므로, 매번 새 blob 주소로 띄움
// 준비되기 전에는 undefined
export function useFreshGif(src: string | undefined) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    setUrl(undefined);
    if (!src) return;
    let alive = true;
    let objectUrl: string | undefined;
    if (!gifBlobs.has(src)) gifBlobs.set(src, fetch(src).then((res) => res.blob()));
    gifBlobs.get(src)!.then(
      (blob) => {
        if (!alive) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      },
      // 못 받으면 원래 주소로라도 보여줌
      () => alive && setUrl(src),
    );
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return url;
}
