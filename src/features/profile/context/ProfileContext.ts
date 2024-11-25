import { Dispatch, SetStateAction, createContext } from "react";
import { UserListingRow } from "../types/userListings";
import { UserFollowRow } from "../types/userFollows";

type ProfileContextProps = {
  modalVisible: boolean;
  userListings: null | UserListingRow[];
  userFollows: null | UserFollowRow[];
  page: number;
  refreshing: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setUserListings: Dispatch<SetStateAction<UserListingRow[]>>;
  setUserFollows: Dispatch<SetStateAction<UserFollowRow[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProfileContext = createContext<ProfileContextProps>({
  modalVisible: false,
  userListings: [],
  userFollows: [],
  page: 1,
  refreshing: false,
  setModalVisible: () => {},
  setUserListings: () => {},
  setUserFollows: () => {},
  setPage: () => {},
  setRefreshing: () => {},
});