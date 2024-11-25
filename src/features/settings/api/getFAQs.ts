import { supabase } from "@/lib/supabase";
import { AccordionToggleType } from "../types/accordionToggleType";

export const getFAQs = async (): Promise<undefined | AccordionToggleType[]> => {
  try {
    let { data, error } = await supabase
      .from('faqs')
      .select('*')

    if (error) throw new Error((error).message);
    if (data) return data as AccordionToggleType[];

  } catch (error) {
    throw new Error((error as Error).message);
  }
};