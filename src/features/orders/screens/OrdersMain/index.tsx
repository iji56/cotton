import { palette, theme } from "@/components/styles/theme";
import { ActivityIndicator, Modal, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrdersHeader from "../../components/OrdersHeader";
import OrdersList from "../../components/OrdersList";
import { useEffect, useState } from "react";
import React from "react";
import { OrdersMainContext } from "../../context/OrdersMainContext";
import { reduxSelect } from "@/types/reduxHooks";
import { getPurchaseListing } from "../../api/getPurchaseListing";
import { getBorrowListing } from "../../api/getBorrowListing";
import { useIsFocused } from "@react-navigation/native";


const OrdersMain = () => {
  const insets = useSafeAreaInsets();
  const user = reduxSelect(state => state.usermeta);
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const isFocused = useIsFocused()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setFilteredOrders([])
      try {
        console.log("user id :", user.id)
        let purchaseListings = await getPurchaseListing(user.id!);
        // console.log("asdfasdfasd : ", purchaseListings[0]?.decline_listings)
        let borrowListing = await getBorrowListing(user.id!);
        // console.log("purchaseListings  ", borrowListing[0]?.decline_listings)
        if (purchaseListings && borrowListing) {
          setFilteredOrders({
            active_listings: [...(purchaseListings[0]?.active_listings ?? []), ...(borrowListing[0]?.active_listings ?? [])],
            complete_listings: [...(purchaseListings[0]?.complete_listings ?? []), ...(borrowListing[0]?.complete_listings ?? [])],
            request_listings: [...(purchaseListings[0]?.request_listings ?? []), ...(borrowListing[0]?.request_listings ?? [])],
            cancelled_listings: [...(purchaseListings[0]?.decline_listings ?? []), ...(borrowListing[0]?.decline_listings ?? [])]
          })
        }

        // console.log("cancelled data : ", purchaseListings, borrowListing, user.id)
        if (refreshing) setRefreshing(false);
        setLoading(false)
      } catch (error) {
        console.log("Eror : ", error)
        setError((error as Error).message);
        if (refreshing) setRefreshing(false);
        setLoading(false)
      }
    };
    fetchData();
  }, [page, refreshing, isFocused])

  return (
    <OrdersMainContext.Provider value={{
      filteredOrders,
      page,
      refreshing,
      error,
      setFilteredOrders,
      setPage,
      setRefreshing,
      setError,
    }}>

      <View style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white

      }}>
        {loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={palette.darkBlue} />
          </View> :
          <>
            <OrdersHeader headerTitle={'My orders'} headerType={'main'} redirect={'OrdersMain'} />
            <OrdersList />
          </>
        }
      </View>

    </OrdersMainContext.Provider>
  )
}

export default OrdersMain;