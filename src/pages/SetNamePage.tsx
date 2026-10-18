import { useState, type FormEvent } from 'react';
import backgroundImg from '../img/room3.png';
import heroImg from '../img/character/hayeong.png';
import Box from '../components/Box';

const MAX_NAME_LENGTH = 10;

interface Props {
  onSubmit: (name: string) => void;
}

export default function SetNamePage({ onSubmit }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name) onSubmit(name);
  };

  return (
    <div className="setname" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <img className="setname__hero" src={heroImg} alt="주인공" />
      <Box title="Name" className="setname__box">
        <form className="setname__form" onSubmit={handleSubmit}>
          <label className="setname__label" htmlFor="player-name">이름을 입력하세요</label>
          <div className="setname__field">
            <input
              id="player-name"
              className="setname__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              autoFocus
              autoComplete="off"
            />
            <span className="setname__count">
              {name.length}/{MAX_NAME_LENGTH}
            </span>
          </div>
          <button className="setname__submit" type="submit" disabled={!name}>
            확인
          </button>
        </form>
      </Box>
    </div>
  );
}
