import { NavigatorScreenParams } from '@react-navigation/native';

export type ColoniesStackParamList = {
  'colonies-list': undefined;
  'colony-detail': { colonyId: number; colonyName?: string; returnTo?: 'home' };
  'colony-create': undefined;
  'colony-edit': { colonyId: number };
  'visit-new': { colonyId: number; colonyName?: string };
  'visit-detail': { visitId: number; colonyId: number };
  'visit-edit': { colonyId: number; visitId: number };
};

export type TabParamList = {
  home: undefined;
  colonies: NavigatorScreenParams<ColoniesStackParamList>;
  profile: undefined;
};
