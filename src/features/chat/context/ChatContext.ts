import { Dispatch, SetStateAction, createContext } from "react";

type ProfileContextProps = {
  error: null | string;
  setError: Dispatch<SetStateAction<string>>;
};

export const ChatContext = createContext<ProfileContextProps>({
  error: null,
  setError: () => {},
});