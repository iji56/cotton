import { FavouritesType, UsermetaProfileUpdate, UsermetaReducerType } from '@/features/auth/types/usermetaReducerType';
import { UserAddressType } from '@/features/settings/types/userAddressType';
import { ReduxError } from '@/types/reduxActions';

export const usermetaAdd = (payload: UsermetaReducerType) => {
  return { type: 'usermeta/add', payload };
};

export const usermetaUpdate = (payload: UsermetaReducerType) => {
  return { type: 'usermeta/update', payload };
}

export const usermetaClear = () => {
  return { type: 'usermeta/clear' };
};

export const usermetaFavourite = (favourites: FavouritesType) => {
  return { type: 'usermeta/updateFavourite', payload: favourites };
};

export const usermetaError = (error: ReduxError) => {
  return { type: 'usermeta/error', error: error.message };
};