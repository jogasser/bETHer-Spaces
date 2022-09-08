import React  from "react"
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {Ionicons} from "@expo/vector-icons";
import {ReactNativePaperProps} from "../props/ReactNativePaperProps";
import { withTheme } from "react-native-paper";
import ReviewScreens from "../screens/ReviewScreens";
import CreateSpaceScreen from "../screens/ManageSpacesScreen";
import MapScreen from "../screens/MapScreen";
import {MainNavigationParamsList} from "./AppLinking";

const MainNavigator = createDrawerNavigator<MainNavigationParamsList>();

function MainNavigation({ theme }: ReactNativePaperProps) {
  const RequestIcon  = <Ionicons name={"search-outline"} size={25} color={theme.colors.text}/>
  const InvitesIcon  = <Ionicons name={"business-outline"} size={25} color={theme.colors.text}/>
  const EventsIcon   = <Ionicons name={"person-outline"} size={25} color={theme.colors.text}/>
  return (
    <MainNavigator.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerTitle: "bETHer Spaces",
        headerStyle: {backgroundColor: theme.colors.surface},
        drawerActiveBackgroundColor: theme.colors.surface,
        drawerActiveTintColor: theme.colors.text,
        drawerLabelStyle: {fontSize: 20, color: theme.colors.text}
      }}
    >
      <MainNavigator.Screen name={"Map"}
                            component={MapScreen}
                            options={{
                              drawerIcon: () => RequestIcon,
                              unmountOnBlur: true,
                            }} />
      <MainNavigator.Screen name={"Spaces"}
                            component={CreateSpaceScreen}
                            options={{drawerIcon: () => InvitesIcon}} />
      <MainNavigator.Screen name={"Reviews"}
                            component={ReviewScreens}
                            options={{drawerIcon: () => EventsIcon}} />
    </MainNavigator.Navigator>
  );
}

export default withTheme(MainNavigation)