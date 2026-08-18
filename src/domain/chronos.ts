import type { ImageSourcePropType } from 'react-native';

import type { ChronoMode } from '../types';

export type ChronoTheme = {
  accent: string;
  panel: string;
  surface: string;
  textOnAccent: string;
};

export const CHRONO_MODES: ChronoMode[] = ['A', 'B', 'C'];

export const CHRONO_LABELS: Record<ChronoMode, string> = {
  A: 'BODET',
  B: 'STRAMATEL',
  C: 'GRUNENWALD',
};

export const CHRONO_DESCRIPTIONS: Record<ChronoMode, string> = {
  A: 'Console jaune',
  B: 'Console grise',
  C: 'Console noire',
};

export const CHRONO_SUMMARIES: Record<ChronoMode, string> = {
  A: 'Pupitre avec masquage, klaxon et correction locale.',
  B: 'Pupitre à double affichage avec rappel 14/24 et correction dédiée.',
  C: 'Pupitre compact avec reset, recharge et masquage intégrés.',
};

export const CHRONO_THEME: Record<ChronoMode, ChronoTheme> = {
  A: {
    accent: '#facc15',
    panel: '#1f2937',
    surface: '#312e1f',
    textOnAccent: '#1f2937',
  },
  B: {
    accent: '#94a3b8',
    panel: '#111827',
    surface: '#1f2937',
    textOnAccent: '#111827',
  },
  C: {
    accent: '#f97316',
    panel: '#09090b',
    surface: '#18181b',
    textOnAccent: '#ffffff',
  },
};

export const CONTROL_IMAGES = {
  bodetStart: require('../../assets/controls/bodet/start.jpg'),
  bodet14: require('../../assets/controls/bodet/reset-14.jpg'),
  bodet24: require('../../assets/controls/bodet/reset-24.jpg'),
  bodetHide: require('../../assets/controls/bodet/hide.jpg'),
  bodetSound: require('../../assets/controls/bodet/buzzer.jpg'),
  bodetCorrectionMinus: require('../../assets/controls/bodet/correction-minus.jpg'),
  bodetCorrectionPlus: require('../../assets/controls/bodet/correction-plus.jpg'),
  bodetCorrectionOk: require('../../assets/controls/bodet/correction-ok.jpg'),
  stramatelStart: require('../../assets/controls/stramatel/start-stop.jpg'),
  stramatelHide: require('../../assets/controls/stramatel/hide-stop.jpg'),
  stramatel14: require('../../assets/controls/stramatel/reset-14.jpg'),
  stramatel24: require('../../assets/controls/stramatel/reset-24.jpg'),
  grunenwaldStart: require('../../assets/controls/grunenwald/start-stop.jpg'),
  grunenwald14: require('../../assets/controls/grunenwald/reset-14.jpg'),
  grunenwald24: require('../../assets/controls/grunenwald/recharge-24.jpg'),
  grunenwaldReset: require('../../assets/controls/grunenwald/stop-clear-recharge.jpg'),
  grunenwaldCorrection: require('../../assets/controls/grunenwald/correction.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export const HOME_IMAGES: Record<ChronoMode, ImageSourcePropType> = {
  A: CONTROL_IMAGES.bodet24,
  B: CONTROL_IMAGES.stramatelStart,
  C: CONTROL_IMAGES.grunenwaldStart,
};
