import {LinkingOptions} from "@react-navigation/native";

export type MainNavigationParamsList = {
  Map: { spaceId: number };
  Spaces: undefined;
  Reviews: undefined;
};

const AppLinking: LinkingOptions<MainNavigationParamsList> = {
  prefixes: [],
  config: {
    screens: {
      Map: ':spaceId?',
      Spaces: '/spaces',
      Reviews: '/reviews'
    }
  }
}

export default AppLinking;