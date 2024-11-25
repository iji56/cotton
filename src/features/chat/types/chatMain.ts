export type ChatMainData = {
  id: null | string;
  user_a: null | string;
  user_b: null | string;
  usermeta_a: {
    id: null | string;
    user_name: null | string;
    images: null | ProfilePictureType[];
  };
  usermeta_b: {
    id: null | string;
    user_name: null | string;
    images: null | ProfilePictureType[];
  };
  newest_message: {
    id: null | string;
    user_id: null | string;
    message_body: null | string;
    created_at: null | string;
  }[];
}

export type ProfilePictureType = {
  profile: null | boolean;
  url_path: null | string;
}

export type ChatMainProps = {
  data: ChatMainData[];
}