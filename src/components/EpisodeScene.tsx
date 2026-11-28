import { useEffect, useRef, useState, type ReactNode } from 'react';
import schoolImg from '../img/background/school.jpg';
import SettingsModal from './SettingsModal';
import MenuButton from './ui/MenuButton';
import Button from './ui/Button';
import ChoiceButton from './ui/ChoiceButton';
import Dialog from './ui/Dialog';
import Panel from './ui/Panel';
import ProgressBar from './ui/ProgressBar';
import TalkBox from './ui/TalkBox';
import { INITIAL_STATS, type StatKey, type Stats } from './StatsBox';
import { HEROINES, PLAYER_NAME, READY_BACKGROUNDS, SPEAKERS, EXPRESSIONS, portraitImage, getReplayLines, hasRisk, type Affection, type Choice, type Episode, type EpisodeLine, type Expression, type Heroine, type Poster, type Speaker } from '../utils/episode';
import { RISK_LIMIT, boostAffection, rollRisk } from '../utils/storyStats';
import { getWeekIndex } from '../utils/gameDate';
import { voiceUrl } from '../utils/voice';
import { warmImage } from '../utils/preload';
import { loadSound, playUrl, type Playback } from '../utils/audio';
import { DEFAULT_TEXT_SPEED, SETTINGS_KEYS, TEXT_SPEEDS, useStoredState } from '../utils/storage';
import DangerWarning from './DangerWarning';
import { playSound, usePlayOnce } from '../utils/sfx';
import { episodeBgm, useBgm, useLowerBgmVolume } from '../utils/bgm';

// 히로인 대사가 나오기 시작하면 낮추는 배경음악 음량 (0~100)
const EPISODE_TALK_BGM_VOLUME = 10;
// 마지막 히로인 대사 뒤로 독백·나레이션이 이만큼 이어지면 원래 음량으로 돌려놓음 (히로인이 다시 말하면 또 낮춤)
const TALK_END_LINES = 4;

// 자동 진행 시 문장이 다 나온 뒤 기다리는 시간
const AUTO_MS = 1500;

// 위험도가 100에 닿은 뒤 발각 연출을 보여주고 엔딩으로 넘어가기까지
// 위험도가 100에 닿은 대사를 다 보여준 뒤 발각 연출까지 기다리는 시간
const EXPOSE_DELAY_MS = 2000;
// 발각 연출을 보여주는 시간 (끝나면 엔딩으로)
const EXPOSED_MS = 4500;

// 지금 대사부터 몇 대사 앞까지 이미지·음성을 미리 준비할지
const PREPARE_AHEAD = 4;

const RISK_COLOR = '#ff4d6a';
// 위험도가 이 이상이면 위험도 상자 테를 붉게 강조하고 화면 가장자리도 붉게 맥박침
const RISK_WARN = 60;

// 대사가 나오며 오른 위험도 (avoided: 정신력으로 피함)
type RiskHit = { amount: number; avoided: boolean };

// 종이를 확대해서 그 지점을 화면 가운데로 (종이 밖이 보이지 않게 가장자리에서 멈춤)
function posterTransform(zoom: Poster['zoom']) {
  if (!zoom) return undefined;
  const edge = 50 / zoom.scale;
  const clamp = (v: number) => Math.min(100 - edge, Math.max(edge, v));
  return `scale(${zoom.scale}) translate(${50 - clamp(zoom.x)}%, ${50 - clamp(zoom.y)}%)`;
}

interface Props {
  // 상단 창 제목에 표시 (에피소드 #0, #1 …)
  number: number;
  // 상단 창에 표시 (예: '데이트 · 민지'). 첫 부분은 태그로, 나머지는 날짜 옆에
  label: string;
  episode: Episode;
  // 'YYYY-MM-DD' (다시 보기처럼 날짜가 없으면 현재 상황 창에 날짜를 빼고 보여줌)
  date?: string;
  // 배경 이미지 주소, 또는 직접 그린 배경
  background?: string | ReactNode;
  // 주인공 대사에서도 주인공 이미지를 보여줄지 (기본은 대사만)
  showPlayer?: boolean;
  // 컬렉션에서 다시 볼 때 그때 고른 선택지 번호들 (선택지 대신 고른 대사가 바로 나오고, 호감도는 바뀌지 않음)
  replay?: number[];
  // 이번 에피소드에서 선택지로 바뀐 호감도 합계, 고른 선택지 번호들, 선택지로 바뀐 스탯 합계
  onDone: (affection: Partial<Affection>, picks?: number[], stats?: Partial<Record<StatKey, number>>) => void;
  // 설정의 게임 종료 (넘기지 않으면 설정 창에 게임 종료 버튼이 없음)
  onExit?: () => void;
  // 다시 보기 도중 설정에서 끝내고 나감 (넘기지 않으면 버튼이 없음)
  onEndReplay?: () => void;
  // 위장도·정신력(위험도)과 매력(호감도 보너스)에 쓰는 현재 스탯
  stats?: Stats;
  // 지금까지의 호감도 (호감도 조건이 있는 대사·선택지를 보여줄지 정할 때 씀)
  affection?: Affection;
  // 위험도가 100에 닿아 정체가 들켰을 때 (넘기지 않으면 들켜도 계속 진행)
  onExposed?: () => void;
}

export default function EpisodeScene({ number, label, episode, date, background = episode.background ?? schoolImg, showPlayer = false, replay, onDone, onExit, onEndReplay, stats = INITIAL_STATS, affection: baseAffection, onExposed }: Props) {
  // 선택지를 고르면 그 답변 대사가 끼워지므로 대사 목록을 상태로 관리
  const [lines, setLines] = useState(() => (replay ? getReplayLines(episode.lines, replay) : episode.lines));
  // 고른 선택지 번호 (나온 순서대로 기록해 다시 보기에 씀)
  const [picks, setPicks] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [affection, setAffection] = useState<Partial<Affection>>({});
  // 선택지로 바뀐 스탯 합계 (에피소드를 무사히 끝내면 반영)
  // 호감도 조건을 만족하는 대사·선택지인지 (지금까지의 호감도 + 이번 에피소드에서 오른 호감도)
  const visible = (l: { when?: (affection: Affection) => boolean }) => {
    if (!l.when) return true;
    const total = Object.fromEntries(HEROINES.map((h) => [h, (baseAffection?.[h] ?? 0) + (affection[h] ?? 0)])) as Affection;
    return l.when(total);
  };
  // from 번째부터 처음으로 보이는 대사 (없으면 -1)
  const nextVisible = (from: number, current = lines) => current.findIndex((l, i) => i >= from && visible(l));
  const [statChanges, setStatChanges] = useState<Partial<Record<StatKey, number>>>({});
  // 이번 에피소드의 위험도 (다시 보기에서는 오르지 않음)
  const hitRisk = (l: EpisodeLine): RiskHit | null => (l.risk && !replay ? rollRisk(l.risk, stats.disguise, stats.mental) : null);
  // total: 쌓인 위험도 · last: 방금 대사에서 오른 위험도 (다음 대사로 넘어가면 사라짐)
  const [risk, setRisk] = useState(() => {
    const hit = hitRisk(lines[0]);
    return { total: Math.min(RISK_LIMIT, hit?.amount ?? 0), last: hit };
  });
  const showRisk = !replay && hasRisk(episode.lines);
  // 위험도가 100에 닿음 (잠시 대사를 넘길 수 없고, 배드엔딩 장면이 있으면 그 장면을 본 뒤 발각 연출)
  const caughtAt = (total: number) => total >= RISK_LIMIT && !!onExposed;
  const caught = caughtAt(risk.total);
  // 배드엔딩 장면을 보는 중
  const [badEnd, setBadEnd] = useState(false);
  // 발각 연출 중
  const [exposed, setExposed] = useState(false);
  usePlayOnce('exposed', exposed);
  // 대사를 넘길 수 없는 동안 (들킨 직후 · 발각 연출 중)
  const blocked = (caught && !badEnd) || exposed;
  // 방금 고른 선택지의 호감도 변화 (다음 대사로 넘어가면 사라짐)
  const [feedback, setFeedback] = useState<Partial<Affection> | null>(null);
  const [auto, setAuto] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // 선택지에서 강조된 항목 (방향키·마우스로 고르고 Enter/Space로 선택)
  const [choiceIndex, setChoiceIndex] = useState(0);
  // 설정에서 고른 텍스트 속도·음량 (에피소드 도중에도 우측 상단 설정에서 바꿀 수 있음)
  const [textSpeed, setTextSpeed] = useStoredState(SETTINGS_KEYS.textSpeed, DEFAULT_TEXT_SPEED);
  const [volume, setVolume] = useStoredState(SETTINGS_KEYS.bgmVolume, 50);
  const [voiceVolume, setVoiceVolume] = useStoredState(SETTINGS_KEYS.voiceVolume, 80);
  // 지금 재생 중인 더빙 음성 (자동 진행은 음성이 끝날 때까지 기다림)
  const voiceRef = useRef<Playback[]>([]);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const typeMs = (TEXT_SPEEDS.find((s) => s.key === textSpeed) ?? TEXT_SPEEDS[1]).ms;

  const fill = (text: string) => text.split('{name}').join(PLAYER_NAME);
  const nameOf = (speaker: keyof typeof SPEAKERS) => SPEAKERS[speaker].name;

  const line = lines[index];
  const text = fill(line.text);
  const speaker = line.speaker && SPEAKERS[line.speaker];
  const speakerName = line.speaker ? nameOf(line.speaker) : line.name;
  // 주인공은 이미지 없이 대사만 나오고 (showPlayer면 주인공 이미지도 보여줌),
  // 히로인 이미지는 주인공 대사·나레이션 중에도 유지해 번갈아 깜박이지 않게 함
  const portraitOf = (l: (typeof lines)[number]) => (l.speaker && (showPlayer || l.speaker !== 'player') ? l.speaker : undefined);
  // 이번 장면의 시작: 배경이 바뀌거나(장면 전환) 이미지를 내리는 대사. 그보다 앞에서 나온 캐릭터는 이어서 보여주지 않음
  let sceneStart = index;
  while (sceneStart > 0 && !lines[sceneStart].background && !lines[sceneStart].hidePortrait) sceneStart--;
  // 이번 장면의 무대: 보통은 마지막으로 말한 캐릭터 1명
  // 대사에 stage가 있으면 그 대사부터 지정한 캐릭터들을 같이 세우고,
  // 그중 누가 말하는 동안 유지함 (무대에 없는 캐릭터가 말하면 다시 그 캐릭터 1명)
  let stage: Speaker[] = [];
  // 캐릭터별 표정: 이번 장면에서 그 캐릭터가 마지막으로 말한 대사의 표정
  const expressions: Partial<Record<Speaker, Expression>> = {};
  for (let i = sceneStart; i <= index; i++) {
    const s = portraitOf(lines[i]);
    if (s && !stage.includes(s)) stage = [s];
    if (lines[i].stage) stage = lines[i].stage!;
    if (s) expressions[s] = lines[i].expression;
  }
  // 이번 장면에 이미 등장한 캐릭터가 있으면 이미지 없는 주인공 대사 중에도 계속 보여줌
  const portraitVisible = stage.length > 0 && !!speaker;
  // 아직 아무도 등장하지 않았으면 다음에 등장할 캐릭터를 투명하게 깔아둠 (첫 등장도 페이드인)
  const upcoming = lines.slice(index).map(portraitOf).find(Boolean);
  const shownSpeakers = stage.length > 0 ? stage : upcoming ? [upcoming] : [];
  // 1명이면 가운데, 2명이면 좌우, 3명이면 좌·중·우 (화면 너비 기준 %)
  const stagePositions = [[50], [50], [30, 70], [28, 50, 72]][Math.min(shownSpeakers.length, 3)];
  // 에피소드 배경음악 (곡이 없는 에피소드는 무음)
  // 히로인과 대화하는 동안은 대사·더빙이 잘 들리게 설정의 배경음악 음량을 10으로 낮춤
  // 마지막 히로인 대사 뒤로 독백·나레이션이 TALK_END_LINES줄 이어지면 원래 음량으로 (설정이 10보다 작으면 계속 그대로)
  const isHeroine = (l: EpisodeLine) => !!l.speaker && (HEROINES as readonly string[]).includes(l.speaker);
  let lastHeroineLine = index;
  while (lastHeroineLine >= 0 && !isHeroine(lines[lastHeroineLine])) lastHeroineLine--;
  const talking = lastHeroineLine >= 0 && lines.slice(lastHeroineLine + 1, index + 1).filter(visible).length < TALK_END_LINES;
  useBgm(episodeBgm(episode) ?? null);
  useLowerBgmVolume(talking, EPISODE_TALK_BGM_VOLUME);
  const typing = typed < text.length;
  // 지금 보이는 선택지 (호감도 조건을 만족하지 않는 선택지는 숨김)
  const options = line.choices?.filter(visible);
  const choosing = !typing && !!options;
  // 시스템 오류 효과: 오류 대사마다 창을 새로 띄움
  const systemError = line.effect === 'system-error';

  // 새 대사가 나올 때마다 대사 출력 소리 (개발 모드 StrictMode에서 두 번 울리지 않게 마지막 대사를 기억)
  const spokenLine = useRef<EpisodeLine | null>(null);
  useEffect(() => {
    if (spokenLine.current === line || !text) return;
    spokenLine.current = line;
    playSound('speech');
  }, [line, text]);
  const poster = line.poster;
  // 일러스트(CG): 마지막으로 지정된 cg (그 사이에 배경이 바뀌었거나 null로 지웠으면 없음)
  let cg: string | undefined;
  for (let i = index; i >= 0; i--) {
    if (lines[i].cg !== undefined) {
      cg = lines[i].cg ?? undefined;
      break;
    }
    if (lines[i].background) break;
  }
  // 장면 전환: 지금까지 나온 대사 중 마지막으로 지정된 배경 (없으면 에피소드 배경)
  let lineBackground: string | undefined;
  for (let i = index; !lineBackground && i >= 0; i--) lineBackground = lines[i].background;
  // TODO(임시): 뱀파이어 테마 배경이 준비될 때까지 준비된 배경(READY_BACKGROUNDS) 말고는 모두 school.jpg로 (에피소드·대사별 배경 지정은 그대로 둠)
  const pickedBackground = lineBackground ?? background;
  const shownBackground = typeof pickedBackground === 'string' && !READY_BACKGROUNDS.has(pickedBackground) ? schoolImg : pickedBackground;

  // 캐릭터 이미지를 미리 불러와서 처음 등장할 때 비어 보이지 않게 함
  useEffect(() => {
    const images = [...Object.values(SPEAKERS).map((s) => s.image), ...Object.values(EXPRESSIONS).flatMap((e) => Object.values(e))];
    for (const image of images) {
      const img = new Image();
      img.src = image;
      img.decode().catch(() => { });
    }
  }, []);

  // 대사가 바뀌면 그 대사의 더빙 음성을 재생 (넘기면 이전 음성은 끊음)
  // 여러 개면 동시에 재생하고, 모두 끝나야 자동 진행
  // 다음 몇 대사에 나올 일러스트·배경·종이 이미지와 음성을 미리 준비해 둠 (나오는 순간 멈칫하지 않게)
  useEffect(() => {
    for (const l of lines.slice(index, index + PREPARE_AHEAD)) {
      for (const url of [l.cg, l.background, l.poster?.image]) if (url) warmImage(url);
      const keys = typeof l.voice === 'string' ? [l.voice] : (l.voice ?? []);
      for (const key of keys) {
        const url = voiceUrl(key);
        if (url) loadSound(url);
      }
    }
  }, [lines, index]);

  useEffect(() => {
    const keys = typeof line.voice === 'string' ? [line.voice] : (line.voice ?? []);
    const urls = keys.map(voiceUrl).filter((url): url is string => !!url);
    if (urls.length === 0) return;
    // 브라우저가 자동 재생을 막거나 파일이 없으면 음성 없이 끝난 것으로 처리됨
    const playbacks = urls.map((url) => playUrl(url, { volume: voiceVolume / 100 }));
    voiceRef.current = playbacks;
    let alive = true;
    setVoicePlaying(true);
    Promise.all(playbacks.map((p) => p.ended)).then(() => {
      if (alive) setVoicePlaying(false);
    });
    return () => {
      alive = false;
      for (const playback of playbacks) playback.stop();
      voiceRef.current = [];
      setVoicePlaying(false);
    };
  }, [line]);

  // 재생 중에 음성 음량을 바꾸면 바로 반영
  useEffect(() => {
    for (const playback of voiceRef.current) playback.setVolume(voiceVolume / 100);
  }, [voiceVolume]);

  // 한 글자씩 타이핑
  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => setTyped((t) => t + 1), typeMs);
    return () => clearTimeout(timer);
  }, [typing, typed, typeMs]);

  // 호감도 변화를 더하고 (오르는 호감도에는 매력 보너스) 화면에 표시
  const gainAffection = (changes: Partial<Affection>[]) => {
    const gained: Partial<Affection> = {};
    for (const change of changes) {
      for (const [key, value] of Object.entries(change) as [Heroine, number][]) {
        gained[key] = (gained[key] ?? 0) + boostAffection(value, stats.charm);
      }
    }
    if (Object.keys(gained).length === 0) return;
    setAffection((prev) => {
      const sum = { ...prev };
      for (const [key, value] of Object.entries(gained) as [Heroine, number][]) {
        sum[key] = (sum[key] ?? 0) + value;
      }
      return sum;
    });
    // 다시 보기에서는 호감도가 바뀌지 않으므로 표시하지 않음
    if (!replay) {
      setFeedback(gained);
      if (Object.values(gained).some((v) => v > 0)) playSound('likability');
    }
  };

  // target 번째 대사로 이동하며 그 사이(건너뛴 대사 포함)에 나온 위험·호감도를 반영
  const moveTo = (target: number, current = lines) => {
    let total = risk.total;
    let last: RiskHit | null = null;
    const changes: Partial<Affection>[] = [];
    for (let i = index + 1; i <= target; i++) {
      if (!visible(current[i])) continue;
      const hit = hitRisk(current[i]);
      if (hit) {
        total += hit.amount;
        last = hit;
      }
      if (current[i].affection && !replay) changes.push(current[i].affection!);
    }
    total = Math.max(0, Math.min(RISK_LIMIT, total));
    setRisk({ total, last });
    gainAffection(changes);
    setIndex(target);
    setTyped(0);
    return total;
  };

  const next = (current = lines) => {
    const target = nextVisible(index + 1, current);
    if (target === -1) finish();
    else moveTo(target, current);
  };

  // 배드엔딩 장면이 끝나면 발각 연출로
  const finish = () => (badEnd ? setExposed(true) : onDone(affection, picks, statChanges));

  // 다음 대사로 (마지막 대사였으면 에피소드 종료)
  const proceed = () => {
    if (nextVisible(index + 1) !== -1) {
      setFeedback(null);
      next();
    } else {
      finish();
    }
  };

  // 타이핑 중이면 문장을 바로 다 보여주고, 아니면 다음 대사로 (선택지가 떠 있으면 무시)
  const advance = () => {
    if (blocked) {
      return;
    } else if (typing) {
      setTyped(text.length);
    } else if (!choosing) {
      proceed();
    }
  };

  // 다음 선택지까지 건너뜀 (더 없으면 에피소드 종료)
  const skip = () => {
    if (choosing || blocked) return;
    const target = lines.findIndex((l, i) => i >= index && l.choices && visible(l));
    if (target === -1) {
      // 남은 대사의 위험도도 반영해서, 100에 닿으면 마지막 대사에서 들킴
      let last = lines.length - 1;
      while (last > index && !visible(lines[last])) last--;
      const total = badEnd || last === index ? 0 : moveTo(last);
      if (caughtAt(total)) setTyped(Infinity);
      else finish();
      return;
    }
    setFeedback(null);
    moveTo(target);
    setTyped(Infinity);
  };

  // 호감도가 오르는 선택지 (고르면 호감도 효과음만 나게 클릭음·대사 출력음을 뺌)
  const raisesAffection = (choice: Choice) => !replay && Object.values(choice.affection).some((v) => v > 0);

  const choose = (choice: Choice) => {
    setChoiceIndex(0);
    setPicks((prev) => [...prev, line.choices!.indexOf(choice)]);
    // 에피소드를 끝내는 선택지면 남은 대사를 버림
    const current = [...lines.slice(0, index + 1), ...choice.reply, ...(choice.ends ? [] : lines.slice(index + 1))];
    setLines(current);
    // 바로 이어지는 대사는 출력음 없이 (이미 울린 것으로 기억)
    if (raisesAffection(choice)) spokenLine.current = current[index + 1] ?? null;
    gainAffection([choice.affection]);
    if (choice.stats && !replay) {
      setStatChanges((prev) => {
        const sum = { ...prev };
        for (const [key, value] of Object.entries(choice.stats!) as [StatKey, number][]) sum[key] = (sum[key] ?? 0) + value;
        return sum;
      });
    }
    next(current);
  };

  // 위험도가 100에 닿으면 그 대사를 다 보여주고 잠시 뒤 배드엔딩 장면(없으면 바로 발각 연출), 연출이 끝나면 엔딩으로
  useEffect(() => {
    if (!caught || typing || exposed || badEnd) return;
    const timer = setTimeout(() => {
      const badEnding = lines[index].badEnding ?? episode.badEnding;
      if (!badEnding) {
        setExposed(true);
        return;
      }
      // 남은 대사 대신 배드엔딩 장면으로
      setBadEnd(true);
      setLines((prev) => [...prev.slice(0, index + 1), ...badEnding]);
      setIndex(index + 1);
      setTyped(0);
      setFeedback(null);
      setRisk((prev) => ({ ...prev, last: null }));
    }, EXPOSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [caught, typing, exposed, badEnd, episode, index]);

  useEffect(() => {
    if (!exposed) return;
    const timer = setTimeout(() => onExposed?.(), EXPOSED_MS);
    return () => clearTimeout(timer);
  }, [exposed, onExposed]);

  // 자동 진행
  useEffect(() => {
    if (blocked || !auto || typing || voicePlaying || choosing || logOpen || settingsOpen) return;
    const timer = setTimeout(advance, AUTO_MS);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 설정 창은 Esc를 직접 받아 닫힘
      if (settingsOpen || blocked) return;
      if (logOpen) {
        if (e.key === 'Escape') setLogOpen(false);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        skip();
      } else if (choosing && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const count = options!.length;
        setChoiceIndex((prev) => (prev + (e.key === 'ArrowUp' ? count - 1 : 1)) % count);
      } else if (choosing && e.key === 'Enter') {
        // 스페이스는 대사 넘기기용이라 연타하다 선택지가 골라지지 않게 Enter로만 선택
        e.preventDefault();
        choose(options![choiceIndex]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advance();
      } else if (choosing) {
        // 숫자 키로 선택
        const choice = options![Number(e.key) - 1];
        if (choice) choose(choice);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const [tag, ...labelRest] = label.split(' · ');
  const dateText = date && `${Number(date.split('-')[1])}월 ${getWeekIndex(date) + 1}주차`;
  const subtitle = [dateText, labelRest.join(' · ')].filter(Boolean).join(' · ');

  const feedbackItems = feedback ? (Object.entries(feedback) as [Heroine, number][]).filter(([, v]) => v !== 0) : [];

  return (
    <div className="episode" onClick={advance}>
      {typeof shownBackground === 'string' ? (
        // 배경이 바뀌면 새로 그려서 페이드인
        <img key={shownBackground} className="episode__bg" src={shownBackground} alt="" aria-hidden />
      ) : (
        shownBackground
      )}

      {/* 일러스트(CG): 원본보다 크게 늘리지 않게 대사창 위에 액자로 띄우고, 남는 화면은 같은 그림을 흐리게 깔아 채움 (바뀌면 새로 그려서 등장) */}
      {cg && (
        <>
          <img key={`backdrop-${cg}`} className="episode__cg-backdrop" src={cg} alt="" aria-hidden />
          <div className="episode__cg" aria-hidden>
            <img key={cg} className="episode__cg-img" src={cg} alt="" />
          </div>
        </>
      )}

      <div className="episode__cast" hidden={!!cg}>
        {shownSpeakers.map((s, i) => (
          <img
            key={s}
            className={`episode__character episode__character--${s}${portraitVisible ? ' episode__character--shown' : ''}`}
            style={{ left: `${stagePositions[i]}%` }}
            src={portraitImage(s, expressions[s])}
            alt=""
          />
        ))}
      </div>

      {(line.dim || poster) && <div className="episode__dim" aria-hidden />}

      {poster && (
        <div className="poster" aria-hidden>
          <div key={poster.image} className="poster__paper">
            <div className="poster__sheet" style={{ transform: posterTransform(poster.zoom) }}>
              <img className="poster__image" src={poster.image} alt="" />
            </div>
          </div>
        </div>
      )}

      {/* 위험도가 높으면 체력 경고처럼 화면 가장자리가 붉게 맥박침 */}
      {showRisk && risk.total >= RISK_WARN && <DangerWarning />}

      <div className="g-episode__menu" onClick={(e) => e.stopPropagation()}>
        {/* 에피소드 위험도 (100이면 정체 발각): 눈에 잘 띄게 설정 버튼 왼쪽에 따로 */}
        {showRisk && (
          <div className={risk.total >= RISK_WARN ? 'g-episode__risk g-episode__risk--high' : 'g-episode__risk'}>
            <span className="g-episode__risk-head">
              <span className="g-episode__risk-label">⚠ 위험도</span>
              <span className="g-episode__risk-value">
                <strong>{risk.total}</strong> / {RISK_LIMIT}
              </span>
            </span>
            <ProgressBar className="g-episode__risk-bar" value={risk.total} max={RISK_LIMIT} color={RISK_COLOR} />
          </div>
        )}
        <MenuButton icon="gear" label="설정" onClick={() => setSettingsOpen(true)} />
      </div>

      <div className="g-episode__status" onClick={(e) => e.stopPropagation()}>
        <Panel title={`EPISODE #${number}`} icon="book" extra={<span className="g-episode__tag">{tag}</span>}>
          <strong className="g-episode__title">{episode.title}</strong>
          <span className="g-episode__sub">{subtitle}</span>
        </Panel>
      </div>

      {(feedbackItems.length > 0 || risk.last) && (
        <div className="g-episode__affection">
          {risk.last &&
            (risk.last.avoided ? (
              <span className="g-episode__affection--up">🛡 정신력으로 버텼다! 위험 회피</span>
            ) : risk.last.amount < 0 ? (
              <span className="g-episode__affection--down">💧 진정했다! 위험도 {risk.last.amount}</span>
            ) : (
              <span className="g-episode__affection--risk">⚠ 위험도 +{risk.last.amount}</span>
            ))}
          {feedbackItems.map(([key, value]) => (
            <span key={key} className={value > 0 ? 'g-episode__affection--up' : 'g-episode__affection--down'}>
              {value > 0 ? '♥' : '💔'} {SPEAKERS[key].name} 호감도 {value > 0 ? '+' : ''}
              {value}
            </span>
          ))}
        </div>
      )}

      {choosing && (
        <div className="g-episode__choices" onClick={(e) => e.stopPropagation()}>
          <Panel title="선택" icon="sparkle">
            <ul className="g-choices">
              {options!.map((choice, i) => (
                <li key={i}>
                  <ChoiceButton
                    number={i + 1}
                    selected={choiceIndex === i}
                    silent={raisesAffection(choice)}
                    onSelect={() => setChoiceIndex(i)}
                    onClick={() => choose(choice)}
                  >
                    {fill(choice.text)}
                  </ChoiceButton>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {systemError && (
        <div className="sys-error">
          <div key={index} className="sys-error__window" role="alert">
            <div className="sys-error__title">⚠ SYSTEM ERROR</div>
            <p className="sys-error__text">
              {text.slice(0, typed)}
              <span className="sys-error__cursor" aria-hidden>_</span>
            </p>
          </div>
        </div>
      )}

      <TalkBox
        className="g-episode__talk"
        speaker={speakerName}
        player={line.speaker === 'player'}
        // 캐릭터면 이름표 앞에 얼굴 (이미지 없는 NPC는 이름만)
        face={
          line.speaker && (
            <span className={`g-talk__face face face--${line.speaker}`} style={{ backgroundImage: `url(${SPEAKERS[line.speaker].image})` }} aria-hidden />
          )
        }
        showNext={!typing && !choosing}
        controls={
          <div className="g-talk__controls" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" active={auto} onClick={() => setAuto(!auto)}>
              <svg viewBox="0 0 10 10" aria-hidden>
                <path d="M2 1l7 4-7 4z" />
              </svg>
              자동
            </Button>
            <Button variant="ghost" data-sfx="page" onClick={() => setLogOpen(true)}>
              <svg viewBox="0 0 10 10" aria-hidden>
                <path d="M1 2h8v1.2H1zM1 4.4h8v1.2H1zM1 6.8h8V8H1z" />
              </svg>
              로그
            </Button>
            <Button variant="ghost" onClick={skip} disabled={choosing} title="ESC">
              <svg viewBox="0 0 10 10" aria-hidden>
                <path d="M0 1.5l5 3.5-5 3.5zM5 1.5l5 3.5-5 3.5z" />
              </svg>
              스킵
            </Button>
          </div>
        }
      >
        {systemError ? '' : text.slice(0, typed)}
      </TalkBox>

      {exposed && (
        <div className="g-episode__exposed" role="alert" onClick={(e) => e.stopPropagation()}>
          <p className="g-episode__exposed-tag">RISK {RISK_LIMIT}</p>
          <p className="g-episode__exposed-title">정체가 들켰다...!</p>
        </div>
      )}

      {settingsOpen && (
        <SettingsModal
          volume={volume}
          onChangeVolume={setVolume}
          voiceVolume={voiceVolume}
          onChangeVoiceVolume={setVoiceVolume}
          textSpeed={textSpeed}
          onChangeTextSpeed={setTextSpeed}
          onExit={onExit}
          onEndReplay={onEndReplay}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {logOpen && (
        <Dialog title="로그" icon="book" onClose={() => setLogOpen(false)} closeOnBackdrop className="g-log">
          <ol className="g-log__list">
            {lines.slice(0, index + 1).map((l, i) => (
              <li key={i} className="g-log__item">
                {(l.speaker || l.name) && <span className="g-log__name">{l.speaker ? nameOf(l.speaker) : l.name}</span>}
                <p className={l.speaker || l.name ? 'g-log__text' : 'g-log__text g-log__text--narration'}>
                  {l.effect === 'system-error' && '[SYSTEM ERROR] '}
                  {fill(l.text)}
                </p>
              </li>
            ))}
          </ol>
        </Dialog>
      )}
    </div>
  );
}
