import { useState, type FormEvent } from 'react';
import { HeartMark } from '../components/Icon';

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
    <div className="setname">
      <section className="setname__card">
        <header className="setname__head">
          <HeartMark />
          <h2 className="setname__title">Name</h2>
        </header>
        <form className="setname__form" onSubmit={handleSubmit} autoComplete="off">
          <p className="setname__label">이름을 입력하세요</p>
          <div className="setname__field">
            <HeartMark className="setname__mark" />
            <input
              id="hero-tag"
              name="hero-tag"
              aria-label="이름을 입력하세요"
              className="setname__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
            />
            <span className="setname__count">
              {name.length} / {MAX_NAME_LENGTH}
            </span>
          </div>
          <button className="setname__submit" type="submit" disabled={!name}>
            <HeartMark />
            확인
          </button>
        </form>
      </section>
    </div>
  );
}
