import EpisodeScene from './EpisodeScene';
import { getDateLabel, type Affection, type Episode } from '../utils/episode';
import { PROGRESS_KEYS, getCollectedNumber, loadChoices, loadJSON } from '../utils/storage';

interface Props {
  episode: Episode;
  onClose: () => void;
}

// 컬렉션·데이트 화면에서 본 에피소드를 다시 봄 (그때 고른 선택지 대사가 바로 나오고, 호감도·스탯은 그대로)
export default function EpisodeReplay({ episode, onClose }: Props) {
  const partner = getDateLabel(episode)?.split(' · ')[0];
  return (
    <EpisodeScene
      number={getCollectedNumber(episode.id) ?? 0}
      label={['다시 보기', partner].filter(Boolean).join(' · ')}
      episode={{ icon: '💗', ...episode }}
      replay={loadChoices(episode.id) ?? []}
      // 호감도 조건이 있는 대사는 지금 호감도 기준으로 보여줌
      affection={loadJSON<Affection>(PROGRESS_KEYS.affection, { minji: 0, siyeong: 0, emily: 0 })}
      onDone={onClose}
      onEndReplay={onClose}
    />
  );
}
