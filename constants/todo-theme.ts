import { ColorSchemeName } from 'react-native';

import { Priority } from '@/types/todo';

export type TodoTheme = {
  accent: string;
  accentSoft: string;
  accentStrong: string;
  background: string;
  border: string;
  card: string;
  danger: string;
  dangerSoft: string;
  heroGradient: [string, string, string];
  inputBackground: string;
  overlayStrong: string;
  placeholder: string;
  shadow: string;
  subtext: string;
  success: string;
  successBorder: string;
  successSoft: string;
  text: string;
};

const lightTheme: TodoTheme = {
  accent: '#0F766E',
  accentSoft: '#D7F3EE',
  accentStrong: '#0B5E58',
  background: '#F4F7F6',
  border: '#E2E8E6',
  card: '#FCFDFC',
  danger: '#B42318',
  dangerSoft: '#FEE4E2',
  heroGradient: ['#EEF7F4', '#DDEDE8', '#F8FBFA'],
  inputBackground: '#F3F6F5',
  overlayStrong: 'rgba(15, 118, 110, 0.08)',
  placeholder: '#8A9692',
  shadow: '#0F172A',
  subtext: '#5E6C68',
  success: '#15803D',
  successBorder: '#B7E4C1',
  successSoft: '#DCFCE7',
  text: '#11211D',
};

const darkTheme: TodoTheme = {
  accent: '#2DD4BF',
  accentSoft: '#133C38',
  accentStrong: '#7DEBDD',
  background: '#09110F',
  border: '#1D2A27',
  card: '#101A18',
  danger: '#F97066',
  dangerSoft: '#3A1717',
  heroGradient: ['#102523', '#0D1B1A', '#132F2B'],
  inputBackground: '#16211F',
  overlayStrong: 'rgba(125, 235, 221, 0.08)',
  placeholder: '#6D7D78',
  shadow: '#000000',
  subtext: '#A4B3AF',
  success: '#4ADE80',
  successBorder: '#1F6F46',
  successSoft: '#123320',
  text: '#F5FBF9',
};

export function getThemePalette(colorScheme: ColorSchemeName): TodoTheme {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

export function getPriorityColors(priority: Priority, theme: TodoTheme) {
  switch (priority) {
    case 'High':
      return {
        background: theme.dangerSoft,
        text: theme.danger,
      };
    case 'Low':
      return {
        background: theme.successSoft,
        text: theme.success,
      };
    default:
      return {
        background: theme.accentSoft,
        text: theme.accentStrong,
      };
  }
}
