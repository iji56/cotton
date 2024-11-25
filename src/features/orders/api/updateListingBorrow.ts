import { supabase } from "@/lib/supabase";

const updateListingBorrow = async (ids) => {
  try {
    const errors = [];
    const results = [];

    for (const id of ids) {
      const { data, error } = await supabase
        .from('listings_borrow')
        .update({ status: 'paid out' })
        .match({ id });

      if (error) {
        errors.push(error);
      } else {
        results.push(data);
      }
    }

    if (errors.length > 0) {
      throw new Error('There were errors updating your listings.');
    }
    return results;
  } catch (error) {
    console.error(error, "Caught error");
    throw error; // Propagate the error
  }
}

export default updateListingBorrow;