import React, { } from 'react';
import {
  StyleSheet, TouchableOpacity, useWindowDimensions, View, Image
} from 'react-native';
import {
  ParamListBase, StackActionHelpers, StackNavigationState, StackRouter, StackRouterOptions,
} from '@react-navigation/routers';
import { createNavigatorFactory, DefaultNavigatorOptions, useNavigationBuilder } from '@react-navigation/core';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackView,
} from '@react-navigation/native-stack';
import { MainNavigationParamsList } from "./AppLinking";
import { ReactNativePaperProps } from "../props/ReactNativePaperProps";
import { Text } from "react-native-paper";

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap>
  & StackRouterOptions & ReactNativePaperProps;

const title: Record<string, string> = {
  'Map': 'Map',
  'CreateSpace': 'Add a Space',
  'Reviews': 'My Reviews',
}

function StackNavigator({
  id, initialRouteName, children, screenOptions, theme, defaultScreenOptions, screenListeners,
}: Props) {
  const { height } = useWindowDimensions();
  // Used for typing of routes & giving a fixed order to routes
  const routes: (keyof MainNavigationParamsList)[] = ['Map', 'CreateSpace', 'Reviews'];

  const menuHeight = 64;
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: theme.colors.primary,
      height: menuHeight,
      overflow: 'visible',
      boxShadow: '0px 0px 10px -4px rgba(0, 0, 0, 0.75)'
    },
    logo: { height: 50, width: 215, marginLeft: 25 },
    menu_large: {
      flex: 1,
      flexDirection: 'row',
    },
    navbarlinks: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      overflow: 'visible',
      paddingHorizontal: 40
    },
    content_container: {
      zIndex: -1,
    },
  });
  // also contains navigation
  const {
    state, descriptors, navigation, NavigationContent,
  } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap
  >(StackRouter, {
    id, children, screenOptions, initialRouteName, defaultScreenOptions, screenListeners,
  });

  const menu = (
    <View style={styles.menu_large}>
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
      <View style={styles.navbarlinks}>
        {routes.map((route) => (
          <TouchableOpacity key={route} onPress={() => navigation.navigate(route)}>

            <Text style={{ color: '#666', paddingLeft: 30, fontSize: 18 }}>{title[route]}</Text>
          </TouchableOpacity>
        ))}</View>
    </View>
  );
  return (
    <NavigationContent>
      <View style={styles.container}>
        {menu}
      </View>
      <View style={styles.content_container}>
        <NativeStackView state={state} navigation={navigation} descriptors={descriptors} />
      </View>
    </NavigationContent>
  );
}

const createStackNavigator = createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  typeof StackNavigator
>(StackNavigator);

const MainNavigator = createStackNavigator<MainNavigationParamsList>();

export default MainNavigator;
