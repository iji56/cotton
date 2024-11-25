import { supabase } from "@/lib/supabase";

export const getBrands = async () => {

    const { data, error } = await supabase.rpc('get_distinct_brands');

    if (error) {
        console.log("Error getting brands: ", error)
        throw new Error(error.message)
    }
    return data as { brand: string }[]
}