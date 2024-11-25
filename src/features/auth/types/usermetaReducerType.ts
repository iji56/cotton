import { Dispatch, SetStateAction } from "react";

/**
 * favourites is from listings_favourite table
 * user_picture is from images table
 */
export type UsermetaReducerType = {
  id: null | string;
  email: null | string;
  user_name: null | string;
  first_name: null | string;
  last_name: null | string;
  street_address_line_1: null | string;
  street_address_line_2: null | string;
  city: null | string;
  state: null | string;
  postal_code: null | string;
  country: null | string;
  stripe_id: null | string;
  stripe_account_id: null | string;
  stripe_customer_id: null | string;
  bio: null | string;
  gender: null | string;
  height: null | number;
  weight: null | number;
  body_type: null | string;
  onboarding_complete: null | boolean,
  account_paused: null | boolean;
  is_pause: boolean,
  is_deleted: boolean,
  favourites: null | {
    id: null | string;
  }[];
  profile_image_url: null |string;
  error?: null | string;
}

export type FavouritesType = {
  id: null | string;
}

export type UserPictureType = {
  id: null | string;
  url: null | string;
}

export type UsermetaProfileUpdate = {
  userName: null | string;
  firstName: null | string;
  bio: null | string;
}

export type PropType = {
  index: number,
  setIndex: Dispatch<SetStateAction<number>>
}