import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Image } from "react-native-image-crop-picker";

type ModalContextProps = {
  image: Image | null,
  setImage: Dispatch<SetStateAction<Image>>,
  username: string,
  setUsername: Dispatch<SetStateAction<string>>,
  name: string,
  setName: Dispatch<SetStateAction<string>>,
  modalVisible: boolean;
  email: string,
  setEmail: Dispatch<SetStateAction<string>>,
  password: string,
  setPassword: Dispatch<SetStateAction<string>>,
  sessionData: any,
  setSessionData: Dispatch<SetStateAction<any>>,
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

export const ModalContext = createContext<ModalContextProps>({
  image: null,
  setImage: () => { },
  username: '',
  setUsername: () => { },
  name: '',
  setName: () => { },
  email: '',
  setEmail: () => { },
  password: '',
  setPassword: () => { },
  sessionData: null,
  setSessionData: () => { },
  modalVisible: false,
  setModalVisible: () => { },
});