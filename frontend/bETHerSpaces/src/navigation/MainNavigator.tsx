import React, {useState} from 'react';
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
import {Portal, Text} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import { Bearing, FadeView } from 'react-native-fadeview-wrapper';

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
  const { width } = useWindowDimensions();
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
    collapsed_menu_active: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: theme.colors.surface,
    },
    collapsed_menu_top: {
      width: '100%',
      alignItems: 'flex-end',
      height: menuHeight,
      justifyContent: 'center',
    },
    collapsed_menu_entry_wrapper: {
      alignItems: 'flex-start',
      borderColor: theme.colors.primary,
      borderTopWidth: 1,
    },
    menu_button: {
      flexDirection: 'row',
      height: menuHeight,
      alignItems: 'center',
      paddingRight: 18,
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
      flex: 1,
      backgroundColor: '#FFFFFF',
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

  const [menuVisible, setMenuVisible] = useState(false);

  const menu = width < 620
    ? (
      <View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menu_button}>
          <Ionicons name="menu-sharp" size={40} color={theme.colors.text} />
        </TouchableOpacity>
        <Portal>
          <FadeView
            visible={menuVisible}
            duration={300}
            entranceBearing={Bearing.Center}
            fadeOutScale={1}
            style={styles.collapsed_menu_active}
          >
            <View style={styles.collapsed_menu_top}>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.menu_button}>
                <Ionicons name="menu-sharp" size={40} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.collapsed_menu_entry_wrapper}>
              {routes.map((route) => (
                <TouchableOpacity key={route} onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate(route)
                }} style={{paddingVertical: 10}}>
                  <Text style={{ color: '#666', paddingLeft: 30, fontSize: 18 }}>{title[route]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </FadeView>
        </Portal>
      </View>
)
    : (
    <View style={styles.menu_large}>
      <View style={styles.navbarlinks}>
        {routes.map((route) => (
          <TouchableOpacity key={route} onPress={() => navigation.navigate(route)}>
            <Text style={{ color: '#666', paddingLeft: 30, fontSize: 18 }}>{title[route]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  return (
    <NavigationContent>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
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
