import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, withTheme } from 'react-native-paper';
import {ReactNativePaperProps} from "../props/ReactNativePaperProps";

function LoadingScreen({ theme }: ReactNativePaperProps): ReactElement {
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background,
      height: '100%',
      width: '100%',
    },
    spinner: {
      position: 'absolute',
      height: '100%',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      zIndex: 100,
    },
  });
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color='#1565c0' style={styles.spinner} animating />
    </View>
  );
}

export default withTheme(LoadingScreen);
