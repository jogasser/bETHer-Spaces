import {LinkingOptions} from "@react-navigation/native";

export type MainNavigationParamsList = {
  Map: { spaceId?: number };
  CreateSpace: undefined;
  Space: { spaceId: number };
  Reviews: undefined;
  CreateRating: { spaceId: number }
};

const AppLinking: LinkingOptions<MainNavigationParamsList> = {
  prefixes: [],
  config: {
    screens: {
      Map: ':spaceId?',
      CreateSpace: '/spaces/new',
      Reviews: '/reviews',
      Space: '/spaces/:spaceId',
      CreateRating: '/space/:spaceId/rating'
    }
  }
}

export default AppLinking;