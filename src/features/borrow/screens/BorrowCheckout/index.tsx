import { SUPABASE_ANON_KEY } from '@env'
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { PaymentIntent, useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { reduxSelect } from "@/types/reduxHooks";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SBM from "../BorrowMain/BorrowMain.styles";
import Wrapper from "@/components/Wrapper";
import { theme } from "@/components/styles/theme";
import BorrowHeader from "../../components/BorrowHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmSummary from "@/features/orders/components/ConfirmSummary";
import { dollarConversion } from "@/utils/dollarConversion";
import { getCurrentDateFormatted } from "../../utils/getCurrentDateUTC";
import saveListingBorrow from "../../api/saveListingBorrow";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import { getListing } from "@/features/orders/api/getListing";
import { getListingOwnerUsermeta } from "../../api/getListingOwnerUsermeta";
import Toast from "react-native-toast-message";
import { STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'
// import saveBalanceTransaction from "../../api/saveBalanceTransaction";

const BorrowCheckout = ({ route }) => {

	const transactionData = route.params;
	console.log("trasaction details params payload  : ", transactionData)
	const insets = useSafeAreaInsets();
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [paymentDetails, setPaymentDetails] = useState({});
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [paymentIntentID, setPaymentIntentID] = useState('');
	const [paymentIntent, setPaymentIntent] = useState({})
	const [listingData, setListingData] = useState();
	const [lenderData, setLenderData] = useState({});
	const userMeta = reduxSelect((state) => state.usermeta) ?? null;
	const accessToken = reduxSelect((state) => state.auth.access_token) ?? null;
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
	let stripeCustomerID = userMeta.stripe_id ?? null;
	let id = userMeta.id ?? null;
	let listingOwner = transactionData.itemData?.userID ?? null;
	let applicationFee = transactionData.calcSubtotal.serviceMarkup ?? null;
	let insuranceFee = transactionData.calcSubtotal.insuranceMarkup ?? null;
	let subtotal = transactionData.calcSubtotal.subTotal ?? null;
	let tax = transactionData.calcSubtotal.tax ?? null;

	useEffect(() => {
		// Calculate the total payment amount once the necessary data is loaded
		const total = Math.ceil(applicationFee + subtotal + tax + insuranceFee);
		if (total > 0) {
			setPaymentAmount(total);
			// Now, we ensure this effect does not directly call initializePaymentSheet.
			// Instead, we react to paymentAmount changes in a separate effect.
		}
	}, [applicationFee, subtotal, tax, insuranceFee]);

	useEffect(() => {
		// This useEffect now solely depends on paymentAmount changes.
		// Ensure we initialize the payment sheet only when paymentAmount is greater than 0
		if (paymentAmount > 0) {
			initializePaymentSheet();
		}
	}, [paymentAmount]); // Depend only on paymentAmount

	useEffect(() => {
		const listingId = transactionData.itemData.id;
		fetchListing(listingId)
		fetchListingOwnerUserMeta(listingOwner)
	}, [])

	async function fetchListing(listingId) {
		const listing = await getListing(listingId);

		if (listing) {
			setListingData(listing)
		} else {
			console.log('Listing not found.');
		}
	}

	async function fetchListingOwnerUserMeta(listingOwner) {
		let listingOwnerData = await getListingOwnerUsermeta(listingOwner);

		if (listingOwnerData) {
			setLenderData(listingOwnerData)
		} else {
			console.log('Listing Owner not found.')
		}
	}

	const fetchPaymentSheetParams = async () => {
		console.log(paymentAmount, "we got the payment amount")
		console.log(stripeCustomerID, "we got the stripe customer id")
		console.log(id, "we got id")
		console.log(listingOwner, "we got the listing owner");
		console.log(applicationFee, "we got the application fee")
		try {
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/payment-sheet`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
				},
				body: JSON.stringify({
					amount: paymentAmount,
					stripeCustomerID: stripeCustomerID,
					userID: id,
					listingOwner: listingOwner,
					applicationFee: applicationFee,
				}),
			});
			const { paymentIntent, ephemeralKey, customer, publishableKey } = await response.json();
			console.log("payment intent : ", paymentIntent);
			console.log("ephemeralKey : ", ephemeralKey);
			console.log("customer : ", customer);
			console.log("publishableKey : ", publishableKey);
			if (paymentIntent === undefined) {
				setError('There was a problem gathering information for this listing.')
			}

			if (paymentIntent) {
				const savePaymentIntent = extractPaymentIntentId(paymentIntent);
				setPaymentIntentID(savePaymentIntent)
				setPaymentIntent(paymentIntent)
			}

			// Store payment details in state
			setPaymentDetails({
				paymentIntent,
				ephemeralKey,
				customer,
				publishableKey
			});

			return {
				paymentIntent,
				ephemeralKey,
				customer,
				publishableKey
			};
		} catch (error) {
			console.log(error)
		}
	};

	const initializePaymentSheet = async () => {
		const {
			paymentIntent,
			ephemeralKey,
			customer,
			publishableKey,
		} = await fetchPaymentSheetParams();

		const { error } = await initPaymentSheet({
			merchantDisplayName: "Example, Inc.",
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			allowsDelayedPaymentMethods: true,
			defaultBillingDetails: {
				name: 'Jane Doe',
			}
		});
		if (!error) {
			setLoading(true);
		}
	};

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet();

		if (error) {
			Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			try {
				const borrowObj = await createListingsBorrow();
				if (borrowObj?.borrowID) {
					await delay(3000)
					borrowNotification(borrowObj.borrowID);
					// If we successfully get a borrowID, navigate and pass it along with other needed parameters
					navigation.navigate('Orders', { screen: 'OrdersConfirm', params: { orderID: borrowObj.borrowID, orderData: borrowObj.borrowData, listingData: listingData } });
				} else {
					// Handle the case where borrowID was not obtained
					Alert.alert("Error", "Failed to create order confirmation.");
				}
			} catch (error) {
				// Handle any errors that occurred during the createListingsBorrow process
				Alert.alert("Error", "An error occurred while processing your order.");
			}
		}
	};

	function extractPaymentIntentId(clientSecret) {
		// Split the clientSecret string by "_secret"
		const parts = clientSecret.split('_secret');

		// The first part of the split result is the Payment Intent ID
		const paymentIntentId = parts[0];

		return paymentIntentId;
	}

	const dateBorrowStart = new Date(transactionData.startEnd.first + 'T00:00:00Z')
	const dateBorrowEnd = new Date(transactionData.startEnd.last + 'T00:00:00Z')
	const timestampBorrowStart = dateBorrowStart.toISOString().replace('T', ' ').replace('.000Z', '+00');
	const timestampBorrowEnd = dateBorrowEnd.toISOString().replace('T', ' ').replace('.000Z', '+00');
	const getBorrowPrice = dollarConversion({ amount: transactionData.itemData.priceBorrow, direction: "toCents", formatted: false })
	const createdTime = getCurrentDateFormatted();

	const payload = {
		transactionID: paymentIntentID,
		lenderID: listingOwner,
		borrowerID: userMeta.id,
		lenderName: '',
		borrowerName: userMeta.user_name,
		brand: transactionData.itemData.name,
		category: transactionData.itemData.type,
		date: `${transactionData.startEnd.first} - ${transactionData.startEnd.last}`,
		picture: transactionData.itemData.image,
		size: transactionData.itemData.size,
		daysBorrowed: transactionData.selectedDateFiltered.length,
		total: paymentAmount,
		taxExpense: tax,
		insurance: insuranceFee,
		shippingExpense: '',
		serviceExpense: applicationFee,
		subtotal: subtotal,
		itemCharge: getBorrowPrice,
	}

	const createListingsBorrow = async () => {
		setLoading(true)
		const listingBorrowPayload = {
			listing_id: transactionData.itemData.id,
			borrower_id: userMeta.id,
			lender_id: listingOwner,
			cp_id: '',
			payment_intent_id: paymentIntentID,
			borrow_start: timestampBorrowStart,
			borrow_end: timestampBorrowEnd,
			borrow_price: getBorrowPrice,
			days_borrowed: transactionData.selectedDateFiltered.length,
			borrow_address: {
				street_address_line1: userMeta.street_address_line_1,
				street_address_line2: userMeta.street_address_line_2,
				city: userMeta.city,
				state: userMeta.state,
				postal_code: userMeta.postal_code,
				country: 'CA',
			},
			lender_address: {
				street_address_line1: lenderData.street_address_line_1,
				street_address_line2: lenderData.street_address_line_2,
				city: lenderData.city,
				state: lenderData.state,
				postal_code: lenderData.postal_code,
				country: 'CA',
			},
			cost_tax: tax,
			cost_shipping: null,
			cost_insurance: insuranceFee,
			cost_service: applicationFee,
			discount: null,
			total_price: paymentAmount,
			status: 'awaiting confirmation',
			extension: null,
			reported: null,
			approved: false,
			approved_at: null,
			created_at: createdTime,
			updated_at: createdTime,
		}
		try {
			const listingBorrowData = await saveListingBorrow(listingBorrowPayload);
			const borrowID = listingBorrowData[0].id;
			const borrowData = listingBorrowData[0]

			const borrowObj = { borrowID, borrowData }

			return borrowObj;
		} catch (error) {
			// Enhanced error handling to manage non-Error objects
			if (error instanceof Error) {
				errorToast(error.message);
			} else {
				errorToast('An unexpected error occurred'); // Generic error message for non-Error objects
			}
		} finally {
			setLoading(false)
		}
	}

	const borrowNotification = async (borrowId) => {
		try {
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/notifications`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
				},
				body: JSON.stringify({
					lender_id: listingOwner,
					borrow_id: borrowId,
				}),
			});
			console.log('Response before JSON parsing:', response);

			const data = await response.json();

			console.log('Data after JSON parsing:', data);
			return {
				data,
			};
		} catch (error) {
			console.log(error)
		}
	}

	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

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
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				paddingLeft: insets.left,
				paddingRight: insets.right,
				backgroundColor: theme.colors.background,
			}}
		>
			<Wrapper>
				{paymentIntentID !== '' ?
					<ScrollView style={SBM.container}>
						<BorrowHeader headerType={'main'} itemData={transactionData.itemData} backNav="BorrowDates" />
						<View style={{ marginBottom: 100 }}>
							<ConfirmSummary lender={false} shipping={false} data={payload} />
						</View>
						<View style={SBM.actionContainer}>
							<TouchableOpacity
								style={SBM.actionButton}
								onPress={() => openPaymentSheet()}
							>
								<Text style={SBM.actionButtonText}>Checkout</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
					:
					<>
						<BorrowHeader headerMain={false} itemData={transactionData.itemData} />
						<View style={[SBM.actionContainer, { marginTop: '35%', paddingTop: '50%', alignItems: 'center', paddingBottom: '50%' }]}>
							<Text style={{ fontSize: 16, fontWeight: 600 }}>Preparing Payment Information...</Text>
						</View>
					</>
				}
			</Wrapper>
			<Toast config={toastConfig} />
		</View>
	)
}

export default BorrowCheckout;