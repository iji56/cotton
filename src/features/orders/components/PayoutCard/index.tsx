import Wrapper from "@/components/Wrapper";
import Avatar from "@/components/elements/Avatar";
import { Text, TouchableOpacity, View } from "react-native";
import { SPC } from "./PayoutCard.styles";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { reduxSelect } from "@/types/reduxHooks";
import { useEffect, useState } from "react";
import { getListing } from "../../api/getListing";
import { SOC } from "../OrderCard/OrderCard.styles";

const PayoutCard = ({paymentID, payment}:any) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [listingData, setListingData] = useState();
	const [lender, setLender] = useState(false);
	const [newEndDate, setNewEndDate] = useState();
	const [newAvailDate, setNewAvailDate] = useState();
	const [status, setStatus] = useState('')
  const brand      = listingData?.brand ?? null;
	const orderType = payment.cp_id ? 'Shipping' : 'Pickup';
  const category   = listingData?.category ?? null;
  const picture    = 'https://placecage.vercel.app/placecage/g/200/300';
  const size       = listingData?.size ?? null;
	const startDate  = new Date(payment.borrow_start) ?? null
	const endDate  = new Date(payment.borrow_end) ?? null
	const availDate  = new Date(payment.bt_on) ?? null
	const earnings = Math.abs(payment.bt_amount)
	const orderData = payment;
	const lenderID = payment.lender_id;
	const user = reduxSelect((state) => state.usermeta) ?? null;
	const userID = user.id;
	const today = new Date();

	useEffect(() => {
		const listingId = payment.listing_id;
		fetchListing(listingId)
		if ( lenderID === userID) {
			setLender(true)
		}
		determineAvailDate();
	}, [paymentID, payment])

	async function fetchListing(listingId:any) {
		const listing = await getListing(listingId);
		
		if (listing) setListingData(listing)
	}

	const formatter = new Intl.DateTimeFormat('en-US', {
		month: 'short', // Abbreviated month name (e.g., "Mar")
		day: 'numeric' // Numeric day of the month
	});
	//create a comparison function that determines whether bt_on or borrow end + 2/5 days is later.
	const determineAvailDate = () => {
		if ('Shipping' === orderType){
			let ned = endDate.setDate(endDate.getDate() + 5);
			setNewEndDate(ned);
		} else if ('Pickup' === orderType) {
			let ned = endDate.setDate(endDate.getDate() + 2);
			setNewEndDate(ned);
		} else {
			let ned = endDate.setDate(endDate.getDate() + 5);
			setNewEndDate(ned);
		}
	}

	useEffect(()=> {
		if (availDate > newEndDate){
			setNewAvailDate(availDate)
		} else if (availDate < newEndDate) {
			setNewAvailDate(newEndDate)
		}
	}, [newEndDate])

	useEffect(()=> {
		if(payment.status !== 'paid out') {
			if(today >= newAvailDate) {
				setStatus('Available')
			} else {
				setStatus('Pending')
			}
		} else {
			setStatus('Paid Out')
		}
	}, [newAvailDate])

	
	const formattedStart = formatter.format(startDate)
	const formattedEnd   = formatter.format(endDate)
	const formattedAvail = formatter.format(newAvailDate)
	const date           = `${formattedStart} - ${formattedEnd}`


  return (
		<TouchableOpacity
      style={SOC.button}
      onPress={() => navigation.navigate('OrdersConfirm', { paymentID, orderData, listingData, lender })}
    >

    <View style={SPC.mainContainer} >
      <Wrapper>
        <View style={SPC.container}>
          <View style={SPC.avatarContainer}>
            <Avatar avatar={picture} size='m' />
          </View>
          <View style={SPC.content}>
            <Text style={SPC.title}>{brand}</Text>
            <Text style={SPC.meta}>{date}</Text>
            <Text style={SPC.meta}>{(earnings / 100).toFixed(2)}</Text>
          </View>
            <View style={SPC.status}>
              <Text style={[SPC.meta, {textTransform: 'capitalize', textAlign: 'right'}]}>{status}</Text>
              <Text style={SPC.meta}>Available: {formattedAvail}</Text>
            </View>
        </View>
      </Wrapper>
    </View>
		</TouchableOpacity>
  )
}

export default PayoutCard;