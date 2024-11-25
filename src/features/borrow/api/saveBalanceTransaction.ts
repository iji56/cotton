import { supabase } from "@/lib/supabase";

const saveBalanceTransaction = async (payload: any) => {
  try {
    // Attempt to insert the payload into the 'balance_transactions' table
    const { data, error } = await supabase
      .from('balance_transactions')
      .insert([payload])
			.select()

    // Check if Supabase returned an error and throw it to be caught by the catch block
    if (error) {
      console.error("Supabase error during balance transaction insertion:", error);
      throw error; // Propagate the detailed Supabase error
    }

    // Assuming the insert was successful and data is returned
    if (data) {
      return data; // Return the inserted data, usually an array with the inserted row
    } else {
      // Handle the case where no data is returned but there was also no error
      throw new Error('No data returned from Supabase after attempting to insert balance transaction.');
    }
  } catch (error) {
    // Log the error caught from the try block or any errors thrown during the insert operation
    console.error("Caught error in saveBalanceTransaction:", error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

export default saveBalanceTransaction;