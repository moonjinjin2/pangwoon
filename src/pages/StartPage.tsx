import { useEffect } from 'react';
import backgroundImg from '../img/intro_background.png';
import logoImg from '../img/logo.png';
import PetalFall from '../components/PetalFall';

interface Props {
  onEnter: () => void;
}

export default function StartPage({ onEnter }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onEnter]);

  // 모바일(터치 기기)에서는 화면 아무 곳이나 탭하면 시작
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const handleClick = () => {
    if (isTouch) onEnter();
  };

  return (
    <div className="start" onClick={handleClick} style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <PetalFall />
      <img className="start__logo" src={logoImg} alt="Pangwoon" style={{ width: '50vw', maxWidth: '800px' }} />
      <p className="start__press">{isTouch ? 'TAP TO START' : 'PRESS ENTER'}</p>
    </div>
  );
}
