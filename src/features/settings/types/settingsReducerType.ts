export type SettingsReducerType = {
  id: null | string;
  user_id: null | string;
  pref_occasion: null | string;
  pref_fit: null | string;
  pref_city: null | string;
  pref_theme: null | string;
  pref_pickup: null | boolean;
  pref_hide_size: null | boolean;
  notif_follow: null | boolean;
  notif_like: null | boolean;
  notif_borrow: null | boolean;
  notif_lend: null | boolean;
  notif_chat: null | boolean;
  email_follow: null | boolean;
  email_like: null | boolean;
  email_borrow: null | boolean;
  email_lend: null | boolean;
  email_chat: null | boolean;
  error?: null | string;
}