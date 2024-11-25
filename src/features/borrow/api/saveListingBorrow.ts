import { supabase } from "@/lib/supabase";

const saveListingBorrow = async (payload) => {
  try {
		const { data, error } = await supabase
		.from('listings_borrow')
		.insert([
			payload
		])
		.select()

    if (error) throw new Error('There was an error saving your listing.');
    if (data) return data; // Make sure data[0] contains the expected properties, including id

  } catch (error) {
    console.error(error, "Caught error");
    throw error; // Propagate the error
  }
}

export default saveListingBorrow;
