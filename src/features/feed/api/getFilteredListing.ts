import { supabase } from '@/lib/supabase';
import { ListingItem } from '../types/supabaseListings';
import { occasionFilters } from '../utils/filters';

export const getFilteredListings = async (
  search_term: any[],
  uid: string,
): Promise<ListingItem[] | null> => {
  console.log('params : ', search_term);
  try {
    // when no filter
    if (search_term.length === 1 && search_term[0].trim() === '') {
      // if user enter empty spaces
      const payload = {
        search_term: '',
        p_user_id: uid,
      };

      console.log('first time all listing Payload : ', payload);
      // when search with no filter
      const { data, error } = await supabase.rpc(
        'search_clothes_and_people',
        payload,
      );

      if (error) {
        console.log('search_clothes_and_people : ', error);
        throw new Error(error.message);
      }

      console.log('clothes and peoples data : ', data);
      return data;
    } else if (
      search_term.flat().length === 1 ||
      (search_term.flat().length === 2 && search_term.flat()[1] == '')
    ) {
      const payload = {
        search_term: search_term[0],
        p_user_id: uid,
      };

      console.log('search_clothes_and_people Payload : ', payload);
      // when search with no filter
      const { data, error } = await supabase.rpc(
        'search_clothes_and_people',
        payload,
      );

      if (error) {
        console.log('search_clothes_and_people : ', error);
        throw new Error(error.message);
      }

      console.log('clothes and peoples data : ');
      return data;
    } else if (
      search_term.length > 0 &&
      search_term.includes(occasionFilters[0])
    ) {
      const payload = {
        search_term: search_term[0],
        p_user_id: uid,
      };

      console.log('search_by_people Payload : ', payload);
      // if user search by people
      const { data, error } = await supabase.rpc('search_by_people', payload);

      if (error) {
        console.log('Error filtering  search_by_people: ', error);
        throw new Error(error.message);
      }

      console.log('people data : ');
      return data;
    } else {
      // if user select only filter or filter with occasion
      const color = search_term[3];
      const colors = color?.map((color: string) => color.toLowerCase());

      const payload = {
        search_term: search_term[0].toLowerCase(),
        p_user_id: uid,
        filter_type: search_term[1]?.length > 0 ? search_term[1] : null,
        filter_brand: search_term[2]?.length > 0 ? search_term[2] : null,
        filter_colors: colors?.length > 0 ? colors : null,
        filter_size: search_term[4]?.length > 0 ? search_term[4] : null,
        filter_occasion: search_term[6]?.toLowerCase() || '',
        user_latitude: search_term[5] > 0 ? null : null,
        user_longitude: search_term[5] > 0 ? null : null,
        max_distance_km: search_term[5] || 0,
      };

      console.log('search_clothes_with_distance payload ', payload);
      const { data, error } = await supabase.rpc(
        'search_clothes_with_distance',
        payload,
      );

      if (error) {
        console.log('Error filtering search_clothes_with_distance : ', error);
        throw new Error(error.message);
      }

      if (data === null) {
        return [];
      }

      return data;
    }
  } catch (error: any) {
    console.log('Erro : getting search_clothes_with_distance : ', error);
    return null;
  }
};
