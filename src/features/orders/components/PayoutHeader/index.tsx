import { View } from "react-native"
import { SPH } from "./PayoutHeader.styles"
import PayoutSummary from "../PayoutSummary"
import PayoutActions from "../PayoutActions"
import { reduxSelect } from "@/types/reduxHooks"
import { useState, useEffect } from "react"
import { STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'

const PayoutHeader = () => {

	const accessToken = reduxSelect((state) => state.auth.access_token) ?? null;
	const [userBalance, setUserBalance ] = useState(null);
	const [userInstantBalance, setUserInstantBalance ] = useState(null);
	const [userPendingBalance, setUserPendingBalance ] = useState(null);
	const [totalVolume, setTotalVolume] = useState(0)
	const userAccountId = reduxSelect(state => state.usermeta.stripe_account_id);
	
	useEffect(() => {
		if (userBalance === null) {
			getBalance()
			getTotalVolume()
		}
	}, [userBalance])

	const getBalance = async () => {
		try {
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/account`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					account_id: userAccountId,
					}),
			});

      const data = await response.json();
      setUserBalance(data.available[0].amount)
      setUserInstantBalance(data.instant_available[0].amount)
      setUserPendingBalance(data.pending[0].amount)
		}
		catch (error) {
			console.log(error)
		}
	}
	
	const getTotalVolume = async () => {
		try {
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-payments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					account_id: userAccountId,
					}),
			});

      const data = await response.json();
			console.log(data, 'getTotalVolume')
			setTotalVolume(data)
		}
		catch (error) {
			console.log(error)
		}
	}

	const payload = {
		available: userBalance,
		pending: userPendingBalance,
		totalVolume: totalVolume,
		total: 0
	}

  return (
    <View style={SPH.mainContainer}>
      <PayoutSummary data={payload} />
      <PayoutActions data={payload}/>
    </View>
  )
}

export default PayoutHeader;