import { SUPABASE_URL } from "@env";

export const createStorageURL = (data: string, bucket: string) => {
  const supabaseUrl = SUPABASE_URL
  const storageURL = `${supabaseUrl}/storage/v1/object/public`;

  return `${storageURL}/${bucket}/${data}`;
};

export const imageBaseUrl = "https://hrnylgxecwjrlbnqbodg.supabase.co/storage/v1/object/public/listings/";
export const listingVideoBaseUrl = "https://hrnylgxecwjrlbnqbodg.supabase.co/storage/v1/object/public/listing_videos/";