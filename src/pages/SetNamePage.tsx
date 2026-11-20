import { useState, type FormEvent } from 'react';
import backgroundImg from '../img/background/intro.png';
import Backdrop from '../components/Backdrop';
import Panel from '../components/ui/Panel';
import Button from '../components/ui/Button';

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
      <Backdrop src={backgroundImg} />
      <Panel className="setname__card" title="입학 원서" icon="crest">
        <form className="setname__form" onSubmit={handleSubmit} autoComplete="off">
          <p className="setname__label">이름을 입력하세요</p>
          <div className="setname__field">
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
          <Button className="setname__submit" type="submit" disabled={!name}>
            확인
          </Button>
        </form>
      </Panel>
    </div>
  );
}
