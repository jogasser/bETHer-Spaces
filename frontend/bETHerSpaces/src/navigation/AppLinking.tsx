import {LinkingOptions} from "@react-navigation/native";

export type MainNavigationParamsList = {
  Map: undefined;
  Spaces: undefined;
  Reviews: undefined;
};

const AppLinking: LinkingOptions<MainNavigationParamsList> = {
  prefixes: [],
  config: {
    screens: {
      Map: '',
      Spaces: '/spaces',
      Reviews: '/reviews'
    }
  }
}

export default AppLinking;