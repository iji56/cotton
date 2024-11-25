import { supabase } from "@/lib/supabase"

export const checkUserMigrationStatus = async (email: string) => {
    const { data, error } = await supabase.rpc('check_user_migration_status', {
        'user_email': email
    });

    if (error) {
        console.log("Error getting user migration status : ", error);
        throw new Error(error.message);
    }

    return data;
}