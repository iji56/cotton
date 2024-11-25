import { Text, TouchableOpacity, View } from "react-native"
import { SPA } from "./PayoutActions.styles"
import Wrapper from "@/components/Wrapper";
import { reduxSelect } from "@/types/reduxHooks";
import Modal from 'react-native-modal';
import SSS from "@/features/settings/screens/SettingsSupport/SettingsSupport.styles";
import { useContext, useState } from "react";
import { PaymentsMainContext } from "../../context/PaymentsMainContext";
import updateListingBorrow from "../../api/updateListingBorrow";
import { STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'

const PayoutActions = (data) => {
  const accessToken = reduxSelect((state) => state.auth.access_token) ?? null;
	const userAccountId = reduxSelect(state => state.usermeta.stripe_account_id);
	const [modalVisible, setModalVisible] = useState(false);
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

	const userBalance = availableBal;

	const createPayout = async () => {
		try{
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-payout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					account_id: userAccountId,
					balance: userBalance,
					}),
			});

      const data = await response.json();
      markOrdersPaidOut();
			setModalVisible(false)
			return {
				data,
			};
		} catch (error) {
			console.log(error)
		}
	}

	const markOrdersPaidOut = async () => {
		setLoading(true);
	
		try {
			const listingBorrowData = await updateListingBorrow(ordersToPayout);
			// Handle successful update, e.g., displaying a success message
			console.log('All Orders Paid Out')
		} catch (error) {
			// Enhanced error handling to manage non-Error objects
			if (error instanceof Error) {
				errorToast(error.message);
			} else {
				errorToast('An unexpected error occurred'); // Generic error message for non-Error objects
			}
		} finally {
			setLoading(false);
		}
	}

  return (
    <View style={SPA.mainContainer}>
      <Wrapper>
        <TouchableOpacity
          style={SPA.actionButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={SPA.actionButtonText}>Payout ${(userBalance / 100).toFixed(2)}</Text>
        </TouchableOpacity>
      </Wrapper>
			<Modal
        isVisible={modalVisible}
        style={SSS.modalBackground}
        propagateSwipe={true}
      >
        <View style={SSS.modalContainer}>
          <Wrapper>
            <Text>Are you sure you wish to payout your balance?</Text>
						<Text style={{alignSelf: 'center', fontSize: 24, marginTop: 40, color: 'lightgreen'}}>${(userBalance / 100).toFixed(2)}</Text>
            <View style={SSS.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => createPayout()}
                style={SSS.navButton}
              >
                <Text style={SSS.navNuttonText}>Payout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={SSS.navButton}
              >
                <Text style={SSS.navNuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Wrapper>
        </View>
      </Modal>
    </View>
  )
}

export default PayoutActions;

function setLoading(arg0: boolean) {
	throw new Error("Function not implemented.");
}


function errorToast(message: string) {
	throw new Error("Function not implemented.");
}
