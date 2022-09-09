import React, {createContext, ReactElement, useEffect, useState} from 'react';
import LoadingScreen from "../screens/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'bETHerSpacesOptionsStorage';

export interface MeasurementOptions {
  temperature: number,
  pressure: number,
  humidity: number,
  light: number,
  oxidised: number,
  reduced: number,
  nh3: number,
  pm1: number,
  pm25: number,
  pm10: number,
}

const defaultValues: MeasurementOptions = {
  temperature: 25,
  pressure: 690,
  humidity: 60,
  light: 10,
  oxidised: 2,
  reduced: 0.5,
  nh3: 0.5,
  pm1: 0.5,
  pm25: 0.5,
  pm10: 0.5,
}

export const OptionsContext = createContext({
  preferredEnvironment: defaultValues
});

type ErrorContextProviderProps = {
  children: React.ReactNode;
};

export default function OptionsContextProvider(
  { children }: ErrorContextProviderProps,
): ReactElement {
  const [envValue, setEnvValue] = useState<MeasurementOptions>();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(async value => {
        if(value == null) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultValues));
          setEnvValue(defaultValues);
        } else {
          setEnvValue(JSON.parse(value))
        }
      })
  }, [STORAGE_KEY])

  if(envValue == null) {
    return <LoadingScreen />
  } else {
    return (
      <OptionsContext.Provider value={{ preferredEnvironment: envValue }}>
        {children}
      </OptionsContext.Provider>
    );
  }
}
