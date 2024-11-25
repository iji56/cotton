export type AddListing = {
  data: any;
  uid: null | string;
  listing_name: null | string;
  listing_summary: null | string;
  price_original: null | number;
  price_borrow: null | number;
  size: null | string;
  color: null | string;
  type: null | string;
  category: null | string;
  sub_category: null | string;
  occasion: null | string;
  gender: null | string;
  borrow_length: null | number;
  fit: null | number;
  condition: null | number;
};

export type UserAddress = {
  uid: null | string;
  street_address_line_1: null | string;
  street_address_line_2: null | string;
  city: null | string;
  state: null | string;
  postal_code: null | string;
  country: null | string;
};
