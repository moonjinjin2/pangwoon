interface Props {
  src: string;
  // 배경 위에 연분홍 막을 덮어 흐리게 (앨범·옷장처럼 위에 카드가 많은 화면)
  tint?: boolean;
}

// 화면 전체 배경 그림. 부모(position 지정 + 쌓임 맥락)의 맨 뒤에 깔림
// CSS background-image 대신 <img>로 그림: CSS 배경은 화면이 바뀔 때마다 캐시를 서버에 다시 확인하느라
// 미리 불러온 이미지인데도 잠깐 비어 보이지만, <img>는 이미 불러온 같은 주소의 이미지를 바로 다시 씀
export default function Backdrop({ src, tint = false }: Props) {
  return (
    <>
      <img className="backdrop" src={src} alt="" aria-hidden />
      {tint && <div className="backdrop backdrop--tint" aria-hidden />}
    </>
  );
}
