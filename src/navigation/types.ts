import { NavigatorScreenParams } from '@react-navigation/native';

export type ColoniesStackParamList = {
  'colonies-list': undefined;
  'colony-detail': { colonyId: number; colonyName?: string };
  'colony-create': undefined;
  'visit-new': { colonyId: number; colonyName?: string };
};

export type TabParamList = {
  home: undefined;
  colonies: NavigatorScreenParams<ColoniesStackParamList>;
  profile: undefined;
};
