import { createContext } from 'react';

type FeedContextType = {
  filteredOrders: any,
  ordersData: [];
  page: number;
  refreshing: boolean;
  error: null | string;
  setFilteredOrders: React.Dispatch<React.SetStateAction<never[]>>;
  setOrdersData: React.Dispatch<React.SetStateAction<[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<null | string>>;
};

export const OrdersMainContext = createContext<FeedContextType>({
  filteredOrders: null,
  ordersData: [],
  page: 1,
  refreshing: false,
  error: null,
  setFilteredOrders: () => { },
  setOrdersData: () => { },
  setPage: () => { },
  setRefreshing: () => { },
  setError: () => { },
});
