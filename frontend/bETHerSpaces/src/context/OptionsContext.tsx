import React, {
  createContext, ReactElement, useMemo, useState,
} from 'react';

const defaultValues = {
  temperature: 20,
  noise: 40,

}


export const OptionsContext = createContext({
  preferredEnvironment: defaultValues
});

type ErrorContextProviderProps = {
  children: React.ReactNode;
};

export default function ErrorContextProvider(
  { children }: ErrorContextProviderProps,
): ReactElement {
  return (
    <OptionsContext.Provider value={value}>
      {children}
    </OptionsContext.Provider>
  );
}
