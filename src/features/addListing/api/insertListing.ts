import { supabase } from '@/lib/supabase';
import { uploadListingImage } from './uploadImage';
import { Image } from 'react-native-image-crop-picker';
import { uploadListingVideo } from './uploadVideo';
import { updateListingVideo } from './uploadListingVideo';
import saveImages from './saveImages';
import saveVideo from './saveVideo';

export const insertNewListing = async ({
  userId,
  name,
  brand,
  description,
  originalPrice,
  borrowPrice,
  salePrice,
  size,
  color,
  type,
  category,
  subCategory,
  microCategory,
  occasion,
  gender,
  fit,
  condition,
  length,
  addressId,
  lendPeriod,
  availability,
  // startDate,
  // endDate,
  images,
  sell,
}: {
  userId: string;
  name: string;
  brand: string;
  description: string;
  originalPrice: number;
  borrowPrice: number;
  salePrice: number;
  size: string;
  color: string[];
  type: string;
  category: string;
  subCategory: string;
  microCategory: string;
  occasion: string[];
  gender: string;
  fit: number;
  condition: number;
  length: number;
  addressId: string;
  lendPeriod: string[];
  availability: string[];
  // startDate: string;
  // endDate: string;
  images: Image[];
  sell: boolean;
}) => {
  const payload = {
    p_user_id: userId,
    p_listing_name: name,
    p_brand: brand,
    p_listing_summary: description,
    p_price_original: originalPrice,
    p_price_borrow: borrowPrice,
    p_price_sale: salePrice,
    p_size: size,
    p_color: color,
    p_type: type,
    p_category: category,
    p_sub_category: subCategory,
    p_occasion: occasion,
    p_gender: gender,
    p_fit: fit,
    p_condition: condition,
    p_length: length,
    p_address_id: addressId,
    p_period_to_lend: lendPeriod,
    p_unavailable_date: availability,
    p_is_sell: sell,
    p_micro_category: microCategory,
  };
  console.log('payload : ', payload);
  const { data, error } = await supabase.rpc('insert_listing', payload);

  if (error) {
    console.log('error inserting new listing : ', error);
    throw new Error(error.message);
  }
  if (data) {
    console.log('insert listing', images);
    for (let i = 0; i < images.length; i++) {
      let fileType: 'video' | 'image' =
        images[i].mime.split('/')[0] === 'video' ? 'video' : 'image';

      let response;
      if (fileType === 'image') {
        response = await uploadListingImage(images[i].path, data);
        if (response) {
          console.log('upload image link : ', response);
          await saveImages({
            listingID: data,
            userID: userId,
            imagePaths: [response],
            mimeType: images[i].mime,
          });
        }
      } else {
        const { videoPath, thumbnailPath } = await uploadListingVideo(
          images[i].path,
          data,
        );
        if (videoPath && thumbnailPath) {
          console.log('upload video link : ', response);
          await saveVideo({
            listingID: data,
            userID: userId,
            videoPath,
            thumbnailPath,
            mimeType: images[i].mime,
          });
        }
      }
    }
  }

  return data;
};
