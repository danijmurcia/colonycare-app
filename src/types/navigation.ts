import { NavigatorScreenParams } from '@react-navigation/native';
import type { Visit } from './visit';

export type ColoniesStackParamList = {
  'colonies-list': undefined;
  'colony-detail': { colonyId: number; colonyName?: string; returnTo?: 'home' };
  'colony-create': undefined;
  'colony-edit': { colonyId: number };
  'visit-new': { colonyId: number; colonyName?: string };
  'visit-detail': { visit: Visit };
};

export type TabParamList = {
  home: undefined;
  colonies: NavigatorScreenParams<ColoniesStackParamList>;
  profile: undefined;
};
