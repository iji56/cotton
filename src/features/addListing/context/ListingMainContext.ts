import { Dispatch, SetStateAction, createContext } from "react";
import { Image } from "react-native-image-crop-picker";

type ListingMainContextProps = {
  error: null | {};
  modalVisible: boolean;
  selectedImages: Image[];
  setErrors: Dispatch<SetStateAction<any>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedImages: Dispatch<SetStateAction<Image[]>>;
};

export const ListingMainContext = createContext<ListingMainContextProps>({
  error: null,
  modalVisible: false,
  selectedImages: [],
  setErrors: () => {},
  setModalVisible: () => {},
  setSelectedImages: () => {}
});