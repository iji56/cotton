import { supabase } from '@/lib/supabase';
import { Image } from 'react-native-image-crop-picker';
import { uploadUserImage } from './uploadImage';
import { errorToast } from '@/lib/toastConfig';

type PropType = {
  uid: string;
  userImage: Image;
  email: string;
  password: string;
  username: string;
  name: string;
  gender: string;
  city?: string;
  postalCode?: string;
  state?: string;
  street?: string;
};

export const baseUrl =
  'https://hrnylgxecwjrlbnqbodg.supabase.co/storage/v1/object/public/user_profile/';

export const signup = async (payload: PropType) => {
  console.log('payload  : ', payload);

  return uploadUserImage(
    payload.userImage.sourceURL! ?? payload.userImage.path!,
    payload.uid,
  ).then(async imagePath => {
    if (imagePath) {
      console.log(imagePath);

      await supabase.rpc('insert_user_profile_image', {
        p_user_id: payload.uid,
        p_url_path: `${imagePath}`,
      });

      const { data, error } = await supabase.rpc('update_user_meta', {
        p_id: payload.uid,
        p_street_address_line_1: payload.street || '',
        p_street_address_line_2: payload.city || '',
        p_city: payload.city || '',
        p_state: payload.state || '',
        p_postal_code: payload.postalCode || '',
        p_name: payload.name,
        p_user_name: payload.username,
        p_gender: payload.gender,
      });
      if (error) {
        console.log(error);
        errorToast(error?.message);
        throw new Error(error.message);
      }

      // const { data, error } = await supabase.rpc('insert_user_meta', {
      //     p_id: payload.uid,
      //     p_street_address_line_1: payload.street || '',
      //     p_street_address_line_2: payload.city || '',
      //     p_city: payload.city || '',
      //     p_state: payload.state || '',
      //     p_postal_code: payload.postalCode || '',
      //     p_name: payload.name,
      //     p_user_name: payload.username,
      //     p_gender: payload.gender,
      //     p_email: payload.email,
      //     p_notification_token: ''
      // });
      // if (error) {
      //     console.log("error while inserting new user meta : ", error)
      //     errorToast(error?.message)
      //     throw new Error(error.message)
      // }

      console.log('data : ', data);
      return data;
    }
  });
};
