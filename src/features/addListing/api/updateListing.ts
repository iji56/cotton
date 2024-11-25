import { supabase } from '@/lib/supabase';
import { ImagePickerType } from '../types/ImagePickerType';
import { Image } from 'react-native-image-crop-picker';
import { uploadListingImage } from './uploadImage';
import saveImages from './saveImages';
import { uploadListingVideo } from './uploadVideo';
import { updateListingVideo } from './uploadListingVideo';
import saveVideo from './saveVideo';

export const updateListing = async ({
  pId,
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
  pId: string;
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
  images: Image[] | null;
  sell: boolean;
}) => {
  const payload = {
    p_id: pId,
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
  const { data, error } = await supabase.rpc('update_listing', payload);

  if (error) {
    console.log('error updating listing : ', error);
    throw new Error(error.message);
  } else {
    if (images) {
      for (let i = 0; i < images.length; i++) {
        if (!images[i]?.oldImage) {
          let fileType: 'video' | 'image' =
            images[i].mime.split('/')[0] === 'video' ? 'video' : 'image';

          let response;

          if (fileType === 'image') {
            response = await uploadListingImage(images[i].path, pId);
            if (response) {
              console.log('upload image link : ', response);
              await saveImages({
                listingID: pId,
                userID: userId,
                imagePaths: [response],
                mimeType: images[i].mime,
              });
            }
          } else {
            const { videoPath, thumbnailPath } = await uploadListingVideo(
              images[i].path,
              pId,
            );
            console.log('videoPath', videoPath, 'thumbnailPath', thumbnailPath);
            if (response) {
              console.log('upload video link : ', response);
              await saveVideo({
                listingID: pId,
                userID: userId,
                videoPath,
                thumbnailPath,
                mimeType: images[i].mime,
              });
              //   await updateListingVideo(pId, response);
            }
          }
        }
      }
    }
  }

  return data;
};
