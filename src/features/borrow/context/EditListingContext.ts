import { Dispatch, SetStateAction, createContext } from "react";
import { EditListingType } from "../types/EditListingType";
import { ImagePickerType } from "@/features/addListing/types/ImagePickerType";

type EditListingContextProps = {
  error: null | string;
  loading: boolean;
  renderImages: string[] | ImagePickerType[];
  deletedImages: string[] | ImagePickerType[];
  newImages: ImagePickerType[];
  formData: EditListingType;
  setError: Dispatch<SetStateAction<null | string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setRenderImages: Dispatch<SetStateAction<string[] | ImagePickerType[]>>;
  setDeletedImages: Dispatch<SetStateAction<string[] | ImagePickerType[]>>;
  setNewImages: Dispatch<SetStateAction<ImagePickerType[]>>;
  setFormData: Dispatch<SetStateAction<EditListingType>>;
};

export const EditListingContext = createContext<EditListingContextProps>({
  error: null,
  loading:false,
  renderImages: [],
  deletedImages: [],
  newImages: [],
  formData: {
    category: '',
    color: '',
    listingSummary: '',
    name: '',
    occasion: '',
    size: '',
    condition: 0,
    borrowLength: 10,
    borrowPrice: 0,
    originalPrice: 0,
    fit: 0,
    salePrice: 0
  },
  setError: () => {},
  setLoading: () => {},
  setRenderImages: () => {},
  setDeletedImages: () => {},
  setNewImages: () => {},
  setFormData: () => {}
});