import { theme } from "@/components/styles/theme";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrdersHeader from "../../components/OrdersHeader";
import ConfirmSummary from "../../components/ConfirmSummary";
import ConfirmDetails from "../../components/ConfirmDetails";
import ConfirmActions from "../../components/ConfirmActions";
import { useEffect, useState } from "react";
import { reduxSelect } from "@/types/reduxHooks";
import { current } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

const OrdersConfirm = ({ route, navigation }) => {
  const insets      = useSafeAreaInsets();
  const currentUser = reduxSelect(state => state.usermeta.id);
	const orderId     = route.params.orderID ?? null;
  const order       = route.params.orderData ?? null;
  const listing     = route.params.listingData ?? null;
	const lender      = route.params.lender ?? null;
  const shipping    = true;

  const [otherUserID, setOtherUserID]     = useState<string>('');
  const [otherUsername, setOtherUsername] = useState<string>('');
	const [start, setStart]                 = useState('')
	const [end, setEnd]                     = useState('')

	const formatter = new Intl.DateTimeFormat('en-US', {
		month: 'short', // Abbreviated month name (e.g., "Mar")
		day: 'numeric' // Numeric day of the month
	});
	
	
	const date     = `${start} - ${end}`
	const subtotal = order.borrow_price * order.days_borrowed
  
	const payload = {
    transactionID: orderId,
		lenderID: order.lender_id,
		borrowerID: order.borrower_id,
		lenderName: '',
		borrowerName: '',
		brand: listing.brand,
		category: listing.category,
		date: date,
		picture: '',
		size: listing.size,
		daysBorrowed: order.days_borrowed,
		total: order.total_price,
		taxExpense: order.cost_tax,
		insurance: order.cost_insurance,
		shippingExpense: '',
		serviceExpense: order.cost_service,
		subtotal: subtotal,
		itemCharge: order.borrow_price,
		approved: order.approved,
	}

  const getUsername = async () => {
    try {
      let otherUser = '';

      if (payload.lenderID === currentUser) {
        otherUser = payload.borrowerID;
      } else {
        otherUser = payload.lenderID;
      }

      const { data, error } = await supabase
        .from('user_meta')
        .select('user_name')
        .eq('id', otherUser)

      if (error) throw new Error(error.message);
      if (data) {
        setOtherUserID(otherUser);
        setOtherUsername(data[0].user_name);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  useEffect(() => console.log(otherUserID), [otherUserID]);
  useEffect(() => console.log(otherUsername), [otherUsername]);

	console.log(order.approved, "is approved?")
  
  useEffect(() => {
    const startDate  = new Date(order.borrow_start) 
    const endDate  = new Date(order.borrow_end) 
    const formattedStart = formatter.format(startDate)
    const formattedEnd = formatter.format(endDate)

    getUsername()
    setStart(formattedStart)
    setEnd(formattedEnd)
  }, [order])
  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: theme.colors.background
    }}>
      <OrdersHeader headerTitle={'confirmation'} redirect={'OrdersMain'} />
      <ScrollView>
        <ConfirmSummary lender={lender} shipping={shipping} data={payload} />
        <ConfirmDetails lender={lender} shipping={shipping} order={order}/>
        <ConfirmActions lender={lender} shipping={shipping} userID={currentUser} otherUserID={otherUserID} otherUsername={otherUsername} approval={order.approved} paymentIntent={order.payment_intent_id} />
      </ScrollView>
    </View>
  )
}

export default OrdersConfirm;