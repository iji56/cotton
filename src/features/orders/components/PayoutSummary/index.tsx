import Wrapper from "@/components/Wrapper"
import { Text, View } from "react-native"
import { SPS } from "./PayoutSummary.styles"
import { useState, useEffect, useContext } from "react";
import { reduxSelect } from "@/types/reduxHooks";
import { PaymentsMainContext } from "../../context/PaymentsMainContext";
import { determineAvailDate } from "../../utils/determineAvailDate";
import Toast from "react-native-toast-message";

const PayoutSummary = ( data ) => {
	const accessToken = reduxSelect((state) => state.auth.access_token) ?? null;
	const [userBalance, setUserBalance ] = useState(null); //Stripe
	const [totalVolume, setTotalVolume] = useState(0); // Stripe???
	const [error, setError]     = useState('');
	const userAccountId = reduxSelect(state => state.usermeta.stripe_account_id);
	const {
    filteredPayments,
    setPage,
    refreshing,
    setRefreshing,
		availableBal,
		setAvailableBal,
		pendingBal,
		setPendingBal,
		ordersToPayout,
		setOrdersToPayout,
  } = useContext(PaymentsMainContext);
	const today = new Date();


	useEffect(() => {
    // Initialize accumulators
		// newOrdersList is accumulating listing_borrow ids to mark paid out.
    let newAvailableBalance = 0;
    let newPendingBalance = 0;
		let newOrdersList: any[] | ((prevState: number[]) => number[]) = [];

    filteredPayments.forEach((payment) => {
        const orderType = payment.cp_id ? 'Shipping' : 'Pickup';
				const status = payment.status;
        const endDate = new Date(payment.borrow_end);
        const btDate = new Date(payment.bt_on);
				const serviceFee = (payment.cost_service);
        const amount = Math.abs(payment.bt_amount);
				const total = amount - serviceFee;
        const availDate = determineAvailDate(orderType, endDate);
        const newAvailDate = btDate > availDate ? btDate : availDate;
        
        if (today >= newAvailDate) {
						if (status !== 'paid out') {
							console.log(payment.id)
							newAvailableBalance += total; // Accumulate into local variable
							newOrdersList.push(payment.id);
						}
        } else {
						if (status !== 'paid out') {
							newPendingBalance += total; // Accumulate into local variable
						}
        }
    });

    // Update state based on accumulations
    setAvailableBal(newAvailableBalance);
    setPendingBal(newPendingBalance);
		setOrdersToPayout(newOrdersList);
}, [filteredPayments]);
	
//TODO: Find a more reliable way of fetching the userBalance(which is the stripe available balance.)
	useEffect(() => {
		setUserBalance(data.data.available)
		setTotalVolume(data.data.totalVolume)
	}, [data])

	// error notification
  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'error',
      text2: error,
      topOffset: 100,
      visibilityTime: 3000,
    });
		setError("")
  }

  useEffect(() => {    
    if (error) showToast();
  }, [error])

  return (
    <View style={SPS.mainContainer}>
      <Wrapper>
					<Text style={{marginBottom:20 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae odio eget neque fermentum sagittis non ac ipsum.</Text>
        <View style={SPS.container}>
          <Text>Available Payout</Text>
          <Text>${availableBal || availableBal === 0 ? (availableBal  / 100).toFixed(2) : 'Cannot retrieve Available Balance'}</Text>
        </View>
        <View style={SPS.container}>
          <Text>Pending Balance</Text>
          <Text>{pendingBal || pendingBal === 0 ? `$${(pendingBal / 100 ).toFixed(2)}` : 'Cannot retrieve Pending'}</Text>
        </View>
        <View style={SPS.container}>
          <Text style={SPS.totalValue}>Total Earnings</Text>
          <Text style={SPS.totalValue}>{`$${(totalVolume / 100).toFixed(2)}`}</Text>
        </View>
      </Wrapper>
    </View>
  )
}

export default PayoutSummary