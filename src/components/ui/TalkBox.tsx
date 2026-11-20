import type { ReactNode } from 'react';
import Panel from './Panel';
import Ribbon from './Ribbon';

interface Props {
  // 말하는 사람 이름 (없으면 나레이션: 이름표 없이 흐린 글씨)
  speaker?: ReactNode;
  // 이름표 앞 얼굴 아이콘
  face?: ReactNode;
  // 주인공 대사는 이름표 색을 구분
  player?: boolean;
  // 다음 대사로 넘길 수 있을 때 ▼ 표시
  showNext?: boolean;
  // 대화창 안 오른쪽 아래 버튼들 (자동·로그·스킵 등)
  controls?: ReactNode;
  className?: string;
  children?: ReactNode;
}

// 이름표 리본이 달린 하단 대화창 (메인·에피소드 공용)
export default function TalkBox({ speaker, face, player = false, showNext = true, controls, className, children }: Props) {
  return (
    <Panel className={className ? `g-talk ${className}` : 'g-talk'}>
      {speaker && (
        <Ribbon variant="tag" className={player ? 'g-talk__speaker g-talk__speaker--player' : 'g-talk__speaker'}>
          {face}
          {speaker}
        </Ribbon>
      )}
      <p className={speaker ? 'g-talk__line' : 'g-talk__line g-talk__line--narration'}>{children}</p>
      <span className={showNext ? 'g-talk__next' : 'g-talk__next g-talk__next--hidden'} aria-hidden />
      {controls}
    </Panel>
  );
}
