import Wrapper from "@/components/Wrapper";
import { Text, View } from "react-native";
import { SCD } from "./ConfirmDetails.styles";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPaymentDetails } from "../../api/getPaymentDetails";

type ConfirmDetailsProps = {
  lender: boolean;
  shipping: boolean;
	order: any
}

const ConfirmDetails = ({ lender, shipping, order }: ConfirmDetailsProps) => {
	const [brand, setBrand] = useState('');
	const [last4, setLast4] = useState('');
	const [type, setType] = useState('');
	
	useEffect(()=> {
		if(order.pm_brand === null || order.pm_4 === null || order.pm_type === null ) {
			fetchPaymentDetails()
		} else {
			setType(order.pm_type)
			setBrand(order.pm_brand)
			setLast4(order.pm_4)
		}
	}, [])

	const lenderAddress = order.lender_address;
	const borrowerAddress = order.borrow_address;
	const paymentBrand = order.pm_brand;
	const paymentLast4 = order.pm_4;

	const fetchPaymentDetails = async() => {
		let paymentDetails = await getPaymentDetails(order.payment_intent_id)

		if(paymentDetails) {
			setType(paymentDetails.pm_type)
			setBrand(paymentDetails.pm_brand)
			setLast4(paymentDetails.pm_4)
		}
	}

	console.log(order,)

	let lenderFormatted = `${lenderAddress.street_address_line2 ? lenderAddress.street_address_line2 + '-' : '' }${lenderAddress.street_address_line1} ${lenderAddress.city}, ${lenderAddress.state}, ${lenderAddress.postal_code}`;
	let borrowFormatted = `${borrowerAddress.street_address_line2 ? borrowerAddress.street_address_line2 + '-' : null }${borrowerAddress.street_address_line1} ${borrowerAddress.city}, ${borrowerAddress.state}, ${borrowerAddress.postal_code}`;

  return (
    <View style={SCD.mainContainer}>
      <Wrapper>
        <Text style={SCD.header}>order details {order.approved ? '- Approved' : '- Awaiting Approval' }</Text>
        <View style={SCD.rowContainer}>
          <View style={SCD.columnContainer}>
            <Text style={SCD.subHeader}>payment method</Text>
            <Text style={SCD.meta}>{order.approved ? `${brand} ending in ${last4}` : '-'}</Text>
          </View>
          <View style={SCD.columnContainer}>
            <Text style={SCD.subHeader}>shipment method</Text>
            <Text style={SCD.meta}>{shipping ? 'Canada Post' : 'Pickup'}</Text>
          </View>
        </View>

        <View style={SCD.rowContainer}>
          <View style={SCD.columnContainer}>
            <Text style={SCD.subHeader}>billing address</Text>
            <Text style={SCD.meta}>{lenderFormatted}</Text>
          </View>
          <View style={SCD.columnContainer}>
            <Text style={SCD.subHeader}>shipping address</Text>
            {shipping ? (
              <Text style={SCD.meta}>{borrowFormatted}</Text>
            ) : (
              <Text style={SCD.meta}>chat with user</Text>
            )}
          </View>
        </View>
      </Wrapper>
    </View>
  )
}

export default ConfirmDetails;