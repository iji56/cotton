import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersMain from "./OrdersMain";
import OrdersConfirm from "./OrdersConfirm";
import PayoutMain from "./PayoutMain";
import PayoutConfirm from "./PayoutConfirm";
import BorrowerInfo from "./BorrowerInfo";
import MyOrderLendShipping from "./MyOrderLendShipping";
import MyOrderLendCompleted from "./MyOrderLendCompleted";
import MyOrderBorrowCompleted from "./MyOrderBorrowCompleted";
import TotalEarning from "./TotalEarnings";
import AvailablePayout from "./AvailablePayout";
import PayoutConfirmation from "./PayoutConfirmation";
import MyOrderLendLocalPickup from "./MyOrderLendLocalPickup";
import MyOrderBorrowLocalPickup from "./MyOrderBorrowLocalPickup";
import Review from "./Review";
import MyOrderSellLocalPickup from "./MyOrderSellLocalPickup";
import MyOrderSellShipping from "./MyOrderSellShipping";
import MyOrderBuyShipping from "./MyOrderBuyShipping";
import MyOrderBuyLocalPickup from "./MyOrderBuyLocalPickup";
import MyOrderSellCompleted from "./MyOrderSellCompleted";
import MyOrderBuyCompleted from "./MyOrderBuyCompleted";
import LenderInfo from "./LenderInfo";
import BuyerInfo from "./BuyerInfo";
import SellerInfo from "./SellerInfo";
import MyOrderCancelled from "./MyOrderCancelled";
import FuturePayout from "./FuturePayouts";
import MyOrderBorrowShipping from "./MyOrderBorrowShipping";
import ShippingDetail from "./ShippingDetails";

const OrdersNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="OrdersMain" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="OrdersMain"
        component={OrdersMain}
      />
      <Stack.Screen
        name="OrdersConfirm"
        component={OrdersConfirm}
      />
      <Stack.Screen
        name="PayoutMain"
        component={PayoutMain}
      />
      <Stack.Screen
        name="PayoutConfirm"
        component={PayoutConfirm}
      />
      <Stack.Screen
        name="BorrowerInfo"
        component={BorrowerInfo}
      />
      <Stack.Screen
        name="LenderInfo"
        component={LenderInfo}
      />
      <Stack.Screen
        name="BuyerInfo"
        component={BuyerInfo}
      />
      <Stack.Screen
        name="SellerInfo"
        component={SellerInfo}
      />
      <Stack.Screen
        name="MyOrderLendShipping"
        component={MyOrderLendShipping}
      />
      <Stack.Screen
        name="MyOrderLendCompleted"
        component={MyOrderLendCompleted}
      />
      <Stack.Screen
        name="MyOrderBorrowCompleted"
        component={MyOrderBorrowCompleted}
      />
      <Stack.Screen
        name="TotalEarning"
        component={TotalEarning}
      />
      <Stack.Screen
        name="AvailablePayout"
        component={AvailablePayout}
      />
      <Stack.Screen
        name="FuturePayout"
        component={FuturePayout}
      />
      <Stack.Screen
        name="PayoutConfirmation"
        component={PayoutConfirmation}
      />
      <Stack.Screen
        name="MyOrderLendLocalPickup"
        component={MyOrderLendLocalPickup}
      />
      <Stack.Screen
        name="MyOrderBorrowLocalPickup"
        component={MyOrderBorrowLocalPickup}
      />
      <Stack.Screen
        name="MyOrderBorrowShipping"
        component={MyOrderBorrowShipping}
      />
      <Stack.Screen
        name="Review"
        component={Review}
      />
      <Stack.Screen
        name="MyOrderSellLocalPickup"
        component={MyOrderSellLocalPickup}
      />
      <Stack.Screen
        name="MyOrderSellShipping"
        component={MyOrderSellShipping}
      />
      <Stack.Screen
        name="MyOrderBuyShipping"
        component={MyOrderBuyShipping}
      />
      <Stack.Screen
        name="MyOrderBuyLocalPickup"
        component={MyOrderBuyLocalPickup}
      />
      <Stack.Screen
        name="MyOrderSellCompleted"
        component={MyOrderSellCompleted}
      />
      <Stack.Screen
        name="MyOrderBuyCompleted"
        component={MyOrderBuyCompleted}
      />
      <Stack.Screen
        name="MyOrderCancelled"
        component={MyOrderCancelled}
      />
      <Stack.Screen
        name="ShippingDetail"
        component={ShippingDetail}
      />
    </Stack.Navigator>
  );
};

export default OrdersNav;