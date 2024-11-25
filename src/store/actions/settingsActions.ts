import { SettingsReducerType } from '@/features/settings/types/settingsReducerType';
import { ReduxError } from '@/types/reduxActions';

export const settingsAdd = (payload: SettingsReducerType) => {
  return { type: 'settings/add', payload };
};

export const settingsUpdate = (payload: SettingsReducerType) => {
  return { type: 'settings/update', payload };
};

export const settingsClear = () => {
  return { type: 'settings/clear' };
};

export const settingsError = (error: ReduxError) => {
  return { type: 'settings/error', error: error.message }
}