import EpisodeScene from './EpisodeScene';
import { getDateLabel, type Episode } from '../utils/episode';
import { NAME_KEY, getCollectedNumber, load, loadChoices } from '../utils/storage';

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
      playerName={load(NAME_KEY) ?? ''}
      replay={loadChoices(episode.id) ?? []}
      onDone={onClose}
    />
  );
}
