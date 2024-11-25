import { createContext } from 'react';
import { ListingItem } from '@/features/feed/types/supabaseListings';

type FeedContextType = {
  listingData: ListingItem[];
  selectedFilters: string[];
  page: number;
  refreshing: boolean;
  error: null | string;
  search: string;
  lastIndex: number;
  setListingData: React.Dispatch<React.SetStateAction<ListingItem[]>>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<null | string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setLastIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const FeedMainContext = createContext<FeedContextType>({
  listingData: [],
  selectedFilters: [],
  page: 1,
  refreshing: false,
  error: null,
  search: '',
  lastIndex: 0,
  setListingData: () => { },
  setSelectedFilters: () => { },
  setPage: () => { },
  setRefreshing: () => { },
  setError: () => { },
  setSearch: () => { },
  setLastIndex: () => { },
});
