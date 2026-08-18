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
  bodetStart: require('../../assets/START BODET JAUNE.jpg'),
  bodet14: require('../../assets/RESET 14 BODET JAUNE.jpg'),
  bodet24: require('../../assets/RESET 24 BODET JAUNE.jpg'),
  bodetHide: require('../../assets/OCCULTE BODET JAUNE.jpg'),
  bodetSound: require('../../assets/KLAXON BODET JAUNE.jpg'),
  stramatelStart: require('../../assets/Stramatel gris start stop.jpg'),
  stramatelHide: require('../../assets/Stramatel gris arret occulte.jpg'),
  stramatel14: require('../../assets/Stramatel gris remise à 14.jpg'),
  stramatel24: require('../../assets/Stramatel gris remise à 24.jpg'),
  stramatelMinus: require('../../assets/mode_b_minus.jpg'),
  stramatelPlus: require('../../assets/mode_b_plus.jpg'),
  stramatelOk: require('../../assets/mode_b_c.jpg'),
  grunenwaldStart: require('../../assets/Touche start stop Grunenwald.jpg'),
  grunenwald14: require('../../assets/14 GRUN NOIR.jpg'),
  grunenwald24: require('../../assets/Touche Recharge.jpg'),
  grunenwaldReset: require('../../assets/Touche stop efface recharge.jpg'),
  grunenwaldCorrection: require('../../assets/Corection Grunenwald.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export const HOME_IMAGES: Record<ChronoMode, ImageSourcePropType> = {
  A: CONTROL_IMAGES.bodet24,
  B: CONTROL_IMAGES.stramatelStart,
  C: CONTROL_IMAGES.grunenwaldStart,
};
