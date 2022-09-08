import { Fonts } from "react-native-paper/lib/typescript/types";
import { configureFonts } from "react-native-paper";

const generalFontConfig: Fonts = {
  light: {
    fontFamily: 'sans-serif-light',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  regular: {
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: 'sans-serif-thin',
    fontWeight: 'normal',
  },
};

const fontConfig = {
  ios: generalFontConfig,
  android: generalFontConfig,
  web: generalFontConfig,
};

export const theme: ReactNativePaper.Theme = {
  colors: {
    primary: '#fff',
    accent: '#ffca28',
    text: '#000000',
    background: '#FFFFFF',
    disabled: '#48a999',
    placeholder: '#333333',
    backdrop: '#1565c0DD',
    error: '#B00020',
    notification: '#1dc5c2',
    onSurface: '#333333',
    surface: '#FFFFFF',
  },
  dark: false,
  roundness: 5,
  mode: 'adaptive',
  fonts: configureFonts(fontConfig),
  animation: { scale: 1 },
};