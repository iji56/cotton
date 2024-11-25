import { supabase } from './supabase';

/**
 * Notes
 * - RegisterUser is a typical user registration supabase fn
 * - MigrateUser will grab all of the users in the temporary
 *   migration table and iterate/register each user
 *
 * Why
 * This function is used purely for migrating the user table
 * from the Adalo database into Supabase. Supabase has a user
 * table behind the auth api, which is private and separate from
 * the public api. Because we need publicly accessible user
 * metadata, we have created public.user_meta, which will work
 * in tandem with auth.users.
 *
 * - In order for auth.users and public.user_meta to be synced, we
 *   have written a supabase trigger that will add a new user (with
 *   its auth.users uuid) into public.user_meta every time a new user
 *   is registered.
 * - To solve the problem of migrating users from Adalo, we have
 *   imported the original users table, named 'migration_users'. We
 *   then use JavaScript to query the migration_users table, and
 *   iterate through each row to register them into the auth.users
 *   and public.user_meta tables.
 *
 */

type migrationUser = {
  email: string;
  password: string;
};

export const registerUser = async ({ email, password }: migrationUser) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) console.log(error.message);
};

export const migrateUser = async () => {
  let { data, error } = await supabase.from('migration_users').select('email');

  if (error) console.log(error.message);

  data?.forEach(user => {
    let email = user.email;
    let password = 'raxapp';
    registerUser({ email, password });
  });
};
