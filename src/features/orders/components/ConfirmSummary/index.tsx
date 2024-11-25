import Wrapper from "@/components/Wrapper";
import { Text, View } from "react-native";
import { SCS } from "./ConfirmSummary.styles";
import { dollarConversion } from "@/utils/dollarConversion";
import Avatar from "@/components/elements/Avatar";

type ConfirmSummaryProps = {
  lender: boolean;
  shipping: boolean;
	data?: object;
}

const ConfirmSummary = ({ lender, shipping, data }: ConfirmSummaryProps) => {
  const transactionID   = 'hy32412c12x13f';
  const lenderID        = 'hy32412c12x13f';
  const borrowerID      = 'hy32412c12x13f';
  const lenderName      = 'user';
  const borrowerName    = 'user';
  const brand           = data?.brand ??'No Brand Found';
  const category        = data?.category ?? 'No Category Found';
  const date            = data?.date ?? 'May 1 - May 2'
  const picture         = data?.picture ?? 'https://placecage.vercel.app/placecage/g/200/300';
  const size            = data?.size ?? 'No Size Found';
  const daysBorrowed    = data?.daysBorrowed ?? 4;
  const total           = data?.total ?? 12300;
  const taxExpense      = data?.taxExpense ?? 12300;
	const insurance 			= data?.insurance ?? 12300;
  const shippingExpense = 12300;
  const serviceExpense  = data?.serviceExpense ?? 12300;
  const subtotal        = data?.subtotal ?? 12300;
  const itemCharge      = data.itemCharge ?? 12300;
	const approved 				= data.approved ?? 'Confirmation information not found';


  return (
    <View style={SCS.mainContainer}>
      <Wrapper>
        <View style={SCS.listingContainer}>
          <View style={SCS.avatarContainer}>
            <Avatar avatar={picture} size='m' />
          </View>
          <View style={SCS.content}>
            <Text style={SCS.title}>{brand}</Text>
            <Text style={SCS.meta}>{category} - {size}</Text>
            <Text style={SCS.meta}>{date}</Text>
          </View>
        </View>

        <View style={SCS.lineItem}>
          <Text>Subtotal (${(itemCharge / 100).toFixed(2)} x {daysBorrowed} days)</Text>
          <Text>${(subtotal / 100).toFixed(2)}</Text>
        </View>
        { shippingExpense > 0 ? (
          <View style={SCS.lineItem}>
          <Text style={SCS.altValue}>Shipping</Text>
          <Text style={SCS.altValue}>{dollarConversion({
            amount: shippingExpense,
            direction: 'toDollars',
            formatted: true
          })}</Text>
        </View>
        ) : null}
        <View style={SCS.lineItem}>
          <Text style={SCS.altValue}>Service fee</Text>
          <Text style={SCS.altValue}>${(serviceExpense / 100).toFixed(2)}</Text>
        </View>
        <View style={SCS.lineItem}>
          <Text style={SCS.altValue}>Insurance</Text>
          <Text style={SCS.altValue}>${(insurance / 100).toFixed(2)}</Text>
        </View>
        <View style={SCS.lineItem}>
          <Text style={SCS.altValue}>HST</Text>
          <Text style={SCS.altValue}>${(taxExpense / 100).toFixed(2)}</Text>
        </View>
        <View style={SCS.lineItem}>
          <Text style={SCS.totalValue}>Total {lender ? 'Revenue' : 'Cost'}</Text>
          <Text style={SCS.totalValue}>${(total / 100).toFixed(2)}</Text>
        </View>
      </Wrapper>
    </View>
  )
}

export default ConfirmSummary;