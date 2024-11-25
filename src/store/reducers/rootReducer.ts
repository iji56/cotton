import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authReducer';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import settingsReducer from './settingsReducer';
import usermetaReducer from './usermetaReducer';

export type RootState = ReturnType<typeof rootReducer>;

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'usermeta', 'settings'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  usermeta: usermetaReducer,
  settings: settingsReducer,
});

export default persistReducer(rootPersistConfig, rootReducer);
