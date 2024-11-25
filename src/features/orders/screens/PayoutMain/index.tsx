import { palette } from "@/components/styles/theme";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrdersHeader from "../../components/OrdersHeader";
import { reduxSelect } from "@/types/reduxHooks";
import { useState, useEffect } from "react";
import { PaymentsMainContext } from "../../context/PaymentsMainContext";
import PayoutAccount from "../../components/PayoutAccount";
import { keywords } from "../../utils/keywords";
import { getTotalPayouts } from "../../api/getTotalPayout";
import { getFuturePayouts } from "../../api/getFuturePayouts";

const PayoutMain = () => {
  const insets = useSafeAreaInsets();
  const user = reduxSelect(state => state.usermeta);
  const currentUserID = user.id;
  const [ordersData, setOrdersData] = useState<any>([]);
  const [availableBal, setAvailableBal] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [futureBal, setFutureBal] = useState(0);
  const [page, setPage] = useState(1);
  const [ordersToPayout, setOrdersToPayout] = useState(['']);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      const payouts = await getTotalPayouts(currentUserID!);
      console.log("total payouts  : ", payouts)
      if (payouts) {
        setAvailableBal(parseFloat((payouts[0]?.available_payouts * 0.8).toFixed(2)));
        setTotalEarning(parseFloat((payouts[0]?.total_earnings * 0.8).toFixed(2)));
        setFutureBal(parseFloat((payouts[0]?.future_payouts * 0.8).toFixed(2)));
      }

      const response = await getFuturePayouts(currentUserID!);
      if (response) {
        setOrdersData([...response?.listings_borrow || [], ...response?.listings_purchased || []]);
      }
    };
    fetchData();
  }, [])


  return (
    <PaymentsMainContext.Provider value={{
      ordersData,
      page,
      refreshing,
      error,
      setOrdersData,
      setPage,
      setRefreshing,
      setError,
      availableBal,
      setAvailableBal,
      totalEarning,
      setTotalEarning,
      futureBal,
      setFutureBal,
      ordersToPayout,
      setOrdersToPayout,
    }}>
      <View style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.lightGrey
      }}>
        <OrdersHeader headerTitle={keywords.payout} redirect={'OrdersMain'} />
        <PayoutAccount />
      </View>
    </PaymentsMainContext.Provider>
  )
}

export default PayoutMain;