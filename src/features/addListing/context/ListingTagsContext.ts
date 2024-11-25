import { Dispatch, SetStateAction, createContext } from "react";

type ListingTagsContextProps = {
  type: null | string;
  color: null | string;
  category: null | string;
  occasion: null | string;
  fit: number;
  condition: number;
  error: null | string;
  setType: Dispatch<SetStateAction<string>>;
  setColor: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
  setoccasion: Dispatch<SetStateAction<string>>;
  setFit: Dispatch<SetStateAction<number>>;
  setCondition: Dispatch<SetStateAction<number>>;
  setError: Dispatch<SetStateAction<string>>;
};

export const ListingTagsContext = createContext<ListingTagsContextProps>({
  type: '',
  color: '',
  category: '',
  occasion: '',
  fit: 4,
  condition: 0,
  error: null,
  setType: () => {},
  setColor: () => {},
  setCategory: () => {},
  setoccasion: () => {},
  setFit: () => {},
  setCondition: () => {},
  setError: () => {}
});