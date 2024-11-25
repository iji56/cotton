import Wrapper from "@/components/Wrapper";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SOC } from "./OrderCard.styles";
import { useEffect, useState } from "react";
import { getListing } from "../../api/getListing";
import { reduxSelect } from "@/types/reduxHooks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { palette } from "@/components/styles/theme";
import { keywords } from "../../utils/keywords";
import { imageBaseUrl } from "@/utils/createStorageURL";
import moment from "moment";

const OrderCard = ({ orderID, order, key }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [listingData, setListingData] = useState<any>();
  const [lender, setLender] = useState(false);
  const name = order?.listing_name ?? null;
  const category = order?.category ?? null;
  const picture = order?.image_url ? `${imageBaseUrl}${order.image_url}` : 'https://placecage.vercel.app/placecage/g/200/300';
  const size = order?.size ?? null;
  const status = order.status ?? null;
  const startDate = order ? order?.borrow_start ? new Date(order.borrow_start) : new Date(order?.shipping_date || order.local_pickup_date || null) : null
  const endDate = order ? order?.borrow_end ? new Date(order.borrow_end) : new Date(order?.shipping_date || order.local_pickup_date || null) : null
  const orderData = order;
  const lenderID = order.lender_id;
  const owenerId = order?.owner_id;
  const purchaserId = order?.purchaser_id;
  const user = reduxSelect((state) => state.usermeta) ?? null;
  const userID = user.id;
  const borrowUserID = order.borrower_id;
  let statusText = '';

  useEffect(() => {
    const listingId = order.listing_id;
    listingId && fetchListing(listingId)
    statusText

    if (lenderID === userID) {
      setLender(true)
    }
  }, [orderID, order])

  async function fetchListing(listingId: string) {
    const listing = await getListing(listingId);
    if (listing) setListingData(listing)
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short', // Abbreviated month name (e.g., "Mar")
    day: 'numeric' // Numeric day of the month
  });
  const formattedStart = formatter.format(startDate!)
  const formattedEnd = formatter.format(endDate!)

  const date = moment(startDate).diff(endDate) === 0 ? moment(startDate).format("MMMM Do, YYYY") : `${formattedStart} - ${formattedEnd}`

  const handleNavigation = () => {
    let screen = ''
    if (status === keywords.status.decline) {
      screen = 'MyOrderCancelled'
    } else if (lenderID === userID && order?.cp_id) {
      screen = status === keywords.status.completed ? 'MyOrderLendCompleted' : 'MyOrderLendShipping'
    } else if (lenderID === userID) {
      screen = status === keywords.status.completed ? 'MyOrderLendCompleted' : 'MyOrderLendLocalPickup'
    } else if (borrowUserID === userID && order?.cp_id) {
      screen = status === keywords.status.completed ? 'MyOrderBorrowCompleted' : 'MyOrderBorrowShipping'
    } else if (borrowUserID === userID) {
      screen = status === keywords.status.completed ? 'MyOrderBorrowCompleted' : 'MyOrderBorrowLocalPickup'
    } else if (owenerId === userID && order?.cp_id) {
      screen = status === keywords.status.completed ? 'MyOrderSellCompleted' : 'MyOrderSellShipping'
    } else if (owenerId === userID) {
      screen = status === keywords.status.completed ? 'MyOrderSellCompleted' : 'MyOrderSellLocalPickup'
    } else if (purchaserId === userID && order?.cp_id) {
      screen = status === keywords.status.completed ? 'MyOrderBuyCompleted' : 'MyOrderBuyShipping'
    } else if (purchaserId === userID) {
      screen = status === keywords.status.completed ? 'MyOrderBuyCompleted' : 'MyOrderBuyLocalPickup'
    }
    console.log(screen, status)
    navigation.navigate(screen, {
      orderID, orderData, listingData, lender
    })
  }

  const getListingStatus = () => {
    if (order?.status === keywords.status.paidOut) {
      return order?.lender_id === userID ? keywords.lend :
        order?.lender_id === userID ? keywords.borrow :
          order?.borrower_id === userID ? keywords.borrow :
            order?.owner_id === userID ? keywords.sell :
              order?.purchaser_id === userID && keywords.buy
    } else {
      return order?.lender_id === userID ? keywords.lend :
        // order?.lender_id === userID && status === keywords.status.inProgress ? keywords.borrow :
        order?.borrower_id === userID ? keywords.borrow :
          order?.owner_id === userID ? keywords.sell :
            order?.purchaser_id === userID && keywords.buy
    }
  }

  statusText = getListingStatus() as string;

  return (
    <TouchableOpacity
      style={SOC.button}
      onPress={handleNavigation}
      key={key}
    >
      <Wrapper>
        <View style={SOC.mainContainer}>
          <Image style={SOC.image} source={{
            uri: picture
          }} />
          <View style={SOC.content}>
            <Text style={SOC.title}>{name}</Text>
            <Text style={SOC.meta}>{category} - {size}</Text>
            <Text style={SOC.meta}>{date}</Text>
          </View>
          <View style={SOC.timestamp}>
            <Text style={[SOC.itemStatus, { backgroundColor: (statusText === keywords.lend || statusText == keywords.borrow) ? palette.lightGrey : 'rgba(255, 243, 176, 1)' }]}>
              {getListingStatus()}
            </Text>
            <TouchableOpacity style={SOC.icon} onPress={handleNavigation}>
              <FontAwesomeIcon icon={'chevron-right'} />
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </TouchableOpacity>
  )
}

export default OrderCard;