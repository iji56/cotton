import { errorToast } from "@/lib/toastConfig";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from "@env";

export const checkRequirements = async (stripeID: string) => {
    try {
        const requirements = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-connect?action=check-requirements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                // 'api-key': `${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                accountId: stripeID
            })
        });
        console.log("response  : , ", requirements)
        const parsedData: any = await requirements.json();
        console.log("parsed data : ", parsedData)
        return parsedData?.requirements
    } catch (error) {
        console.log("Error getting requirements : ", error?.message)
        errorToast(error?.message || "something going wrong! try again")
        return null;
    }
}