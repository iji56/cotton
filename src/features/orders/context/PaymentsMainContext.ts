import { createContext } from 'react';

type FeedContextType = {
  ordersData: [];
  page: number;
  refreshing: boolean;
  error: null | string;
  setOrdersData: React.Dispatch<React.SetStateAction<[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<null | string>>;
  availableBal: number;
  setAvailableBal: React.Dispatch<React.SetStateAction<number>>;
  totalEarning: number;
  setTotalEarning: React.Dispatch<React.SetStateAction<number>>;
  futureBal: number;
  setFutureBal: React.Dispatch<React.SetStateAction<number>>;
  ordersToPayout: string[];
  setOrdersToPayout: React.Dispatch<React.SetStateAction<string[]>>;
};

export const PaymentsMainContext = createContext<FeedContextType>({
  ordersData: [],
  page: 1,
  refreshing: false,
  error: null,
  setOrdersData: () => { },
  setPage: () => { },
  setRefreshing: () => { },
  setError: () => { },
  availableBal: 0,
  setAvailableBal: () => { },
  totalEarning: 0,
  setTotalEarning: () => { },
  futureBal: 0,
  setFutureBal: () => { },
  ordersToPayout: [],
  setOrdersToPayout: () => { }
});
