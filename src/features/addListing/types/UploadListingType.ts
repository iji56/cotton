export type ImageType = {
  base64: string;
  fileName: string;
  fileSize: number;
  height: number;
  type: string;
  uri: string;
  width: number;
};

export type SaveListingType = {
  borrow_length: number | null;
  category: string | null;
  color: string | null;
  condition: number | null;
  fit: number | null;
  gender: string | null;
  listing_name: string | null;
  listing_summary: string | null;
  occasion: string | null;
  price_borrow: number | null;
  price_original: number | null;
  size: string | null;
  type: string | null;
  user_id: string | null | undefined;
};

export type SaveImageType = {
  listingID: string;
  userID: string;
  imagePaths: string[];
  mimeType: string;
};

export type SaveVideoType = {
  listingID: string;
  userID: string;
  videoPath: string;
  thumbnailPath: string;
  mimeType: string;
};
