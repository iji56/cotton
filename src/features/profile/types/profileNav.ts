import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type ProfileParamList = {
  ProfileMain: undefined;
  ProfileSettings: undefined;
  SettingsAddresses: undefined;
  SettingsFAQs: undefined;
  SettingsPreferences: undefined;
  SettingsSupport: undefined;
}

export type ProfileNavigation = NativeStackNavigationProp<ProfileParamList>;