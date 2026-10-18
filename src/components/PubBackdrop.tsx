import barImg from '../img/bar_background.png';

// 신입생 OT 호프집 배경: 호프집 사진을 보랏빛 밤 분위기로 바꾸고 네온사인·현수막을 얹음
export default function PubBackdrop() {
  return (
    <div className="pub" aria-hidden>
      <div className="pub__photo" style={{ backgroundImage: `url(${barImg})` }} />
      <div className="pub__tint" />
      <div className="pub__vignette" />
    </div>
  );
}
