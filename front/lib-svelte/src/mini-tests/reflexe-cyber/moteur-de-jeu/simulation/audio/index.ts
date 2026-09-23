import { sonothèque } from './sonotheque';

export type Son =
  'bon-réflexe' | 'mauvais-réflexe' | 'palier-20s' | 'notification' | 'saisie-clavier' | 'tic<=10s' | 'tic<=3s';

type FenêtreAvecWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let contexteAudio: AudioContext | undefined;

const breakpointMd = '48em';
const audioActivéSurÉcran = () => window.matchMedia(`(min-width: ${breakpointMd})`).matches;

export const prépareAudio = (): AudioContext | undefined => {
  if (!audioActivéSurÉcran()) return;

  const ConstructeurAudioContext = window.AudioContext || (window as FenêtreAvecWebkitAudioContext).webkitAudioContext;
  if (!ConstructeurAudioContext) return;

  contexteAudio ??= new ConstructeurAudioContext();
  if (contexteAudio.state === 'suspended') {
    void contexteAudio.resume().catch(() => undefined);
  }
  return contexteAudio;
};

export type ParamètresTonalité = {
  contexte: AudioContext;
  fréquence: number;
  fréquenceFinale: number;
  décalageDébut: number;
  durée: number;
  duréeAttaque: number;
  délaiArrêt: number;
  volume: number;
  type: OscillatorType;
};

const joueTonalité = ({
  contexte,
  fréquence,
  fréquenceFinale,
  décalageDébut,
  durée,
  duréeAttaque,
  délaiArrêt,
  volume,
  type,
}: ParamètresTonalité) => {
  const début = contexte.currentTime + décalageDébut;
  const oscillateur = contexte.createOscillator();
  const gain = contexte.createGain();
  oscillateur.type = type;
  oscillateur.frequency.setValueAtTime(fréquence, début);
  oscillateur.frequency.exponentialRampToValueAtTime(fréquenceFinale, début + durée);
  gain.gain.setValueAtTime(0.0001, début);
  gain.gain.exponentialRampToValueAtTime(volume, début + duréeAttaque);
  gain.gain.exponentialRampToValueAtTime(0.0001, début + durée);
  oscillateur.connect(gain);
  gain.connect(contexte.destination);
  oscillateur.start(début);
  oscillateur.stop(début + durée + délaiArrêt);
};

export const joueSon = (son: Son) => {
  const contexte = prépareAudio();
  if (!contexte || contexte.state !== 'running') return;

  sonothèque[son].forEach((paramètres) => joueTonalité({ contexte, ...paramètres }));
};
