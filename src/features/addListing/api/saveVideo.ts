import { supabase } from '@/lib/supabase';
import { SaveVideoType } from '../types/UploadListingType';

const saveVideo = async ({
  listingID,
  userID,
  videoPath,
  thumbnailPath,
  mimeType,
}: SaveVideoType) => {
  try {
    console.log('saveVideo', { listingID, userID, videoPath, thumbnailPath });
    const listing_order = 1;
    let payload = {};

    payload = {
      listing_id: listingID,
      user_id: userID,
      profile: false,
      is_deleted: false,
      listing_order,
      url_path: videoPath,
      thumbnail_path: thumbnailPath,
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
    return true;
  } catch (error) {
    console.log('error updating image table : ', error);
    throw error; // Propagate error to the caller
  }
};

export default saveVideo;
