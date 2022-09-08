import React  from "react"
import {ReactNativePaperProps} from "../props/ReactNativePaperProps";
import { withTheme } from "react-native-paper";
import ReviewScreens from "../screens/ReviewScreens";
import MapScreen from "../screens/MapScreen";
import CreateSpaceScreen from "../screens/CreateSpaceScreen";
import MainNavigator from "./MainNavigator";
import SpaceScreen from "../screens/SpaceScreen";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MainNavigationParamsList} from "./AppLinking";
import CreateRatingScreen from "../screens/CreateReviewScreen";

export type MainNavigationNavProps = NativeStackNavigationProp<MainNavigationParamsList, 'Map'>;

export type MainNavigationProps = {
  navigation: MainNavigationNavProps
};

function MainNavigation({ theme }: ReactNativePaperProps) {
  return (
    <MainNavigator.Navigator initialRouteName="Map" screenOptions={{headerShown: false}} theme={theme}>
      <MainNavigator.Screen name={'Map'} component={MapScreen} />
      <MainNavigator.Screen name={'CreateSpace'} component={CreateSpaceScreen} />
      <MainNavigator.Screen name={'Reviews'} component={ReviewScreens} />
      <MainNavigator.Screen name={'Space'} component={SpaceScreen} />
      <MainNavigator.Screen name={'CreateRating'} component={CreateRatingScreen} />
    </MainNavigator.Navigator>
  );
}

export default withTheme(MainNavigation)