import { Dispatch, SetStateAction } from 'react';

export interface ImageInfo {
  url_path: string;
  image_url: string;
  thumbnail_url: string;
  profile?: string; // Assuming 'profile' might not be present in all image info objects
}

export interface UserInfo {
  city: string;
  id: string;
  images: ImageInfo[];
  user_name: string;
  user_picture?: string;
}

export interface ListingItem {
  created_at: string;
  listing_id: string;
  id: string;
  images: ImageInfo[]; // Assuming this follows the same structure as user.images
  listing_name: string;
  occasion: string;
  price_borrow: number;
  price_original: number;
  size: string;
  type: string | null; // Since 'type' can be null
  user_id: string;
  user_name: string;
  email: string;
  city: string;
  user_picture: string;
  brand: string;
  listing_purchased_status: string;
  listing_borrow_status: string;
  listing_image_url?: string;
  user_profile_image: string;
}

export interface FilterProps {
  data: any[];
  selectedFilter: string | string[];
  stateUpdate: Dispatch<SetStateAction<any>>;
}

export interface FilterOptions {
  color: string[];
  brand: string[];
  size: string[];
  type: string[];
  check: any; // if include check box in future
  distance: number;
  microCategories: string[];
}

export interface ListingSearch {
  listing_image_url: string;
  user_name: string;
  city: string;
  user_id: string;
  user_profile_image: string;
}

export type SingleListing = {
  uid: null | string;
  listing_name: null | string;
  listing_summary: null | string;
  price_original: null | number;
  price_borrow: null | number;
  size: null | string;
  type: null | string;
  category: null | string;
  sub_category: null | string;
  occasion: null | string;
  borrow_length: null | string;
  availability: null | ListingAvailability[];
  cover_image: null | string;
  owner_id: null | string;
  owner_name: null | string;
  owner_image: null | string;
  color: null | string;
  fit: null | number;
  length: null | number;
  condition: null | number;
  location: null | string;
};

export type ListingAvailability = {
  month: string;
  dates: number[];
};
