import { supabase } from '@/lib/supabase';
import { SaveImageType } from '../types/UploadListingType';

const saveImages = async ({
  listingID,
  userID,
  imagePaths,
  mimeType,
}: SaveImageType) => {
  try {
    console.log('saveImages', { listingID, userID, imagePaths });
    for (let i = 0; i < imagePaths.length; i++) {
      const url_path = imagePaths[i];
      const listing_order = i + 1;
      let payload = {};
      // if(mimeType.split('/')[0] === 'video' ){
      //   payload = {
      //     listing_id: listingID,
      //     user_id: userID,
      //     profile: false,
      //     listing_order,
      //     url_path,
      //     mime_type: mimeType,
      //     thumbnail_url: imagePaths
      //   };

      // }
      payload = {
        listing_id: listingID,
        user_id: userID,
        profile: false,
        is_deleted: false,
        listing_order,
        url_path,
        mime_type: mimeType,
      };

      console.log('payload : ', payload);
      const { data: imageSaveData, error: imageSaveError } = await supabase
        .from('images')
        .insert([payload])
        .select();

      if (imageSaveError) {
        throw new Error('There was an error saving the uploaded images.');
      }
      console.log('response  : ', imageSaveData);
    }
    return true;
  } catch (error) {
    console.log('error updating image table : ', error);
    throw error; // Propagate error to the caller
  }
};

export default saveImages;
