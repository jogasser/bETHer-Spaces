import 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";
import { Provider as PaperProvider } from 'react-native-paper';
import {theme} from "./src/config/theme";
import AppLinking from "./src/navigation/AppLinking";
import MainNavigation from "./src/navigation/MainNavigation";

import React from 'react';
import { Platform } from 'react-native';
import axios from "axios";

export interface GlobalStyleProps {
  css: string;
}

function GlobalStyle({ css }: GlobalStyleProps) {
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.append(style);

      const leafletStyle = document.createElement('link');
      leafletStyle.rel = 'stylesheet';
      leafletStyle.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      // eslint-disable-next-line max-len
      leafletStyle.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
      leafletStyle.crossOrigin = '';
      document.head.append(leafletStyle);
    }
  }, [css]);
  return null;
}

axios.defaults.baseURL = 'https://bether.tenderribs.cc/api';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

export default function App() {
  return (
    <NavigationContainer linking={AppLinking}>
      <PaperProvider theme={theme}>
        <GlobalStyle css={''} />
        <MainNavigation />
      </PaperProvider>
    </NavigationContainer>
  );
}