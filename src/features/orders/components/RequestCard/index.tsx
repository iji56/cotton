import Wrapper from "@/components/Wrapper";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import SRC from "./RequestCard.styles";
import { useContext, useEffect, useState } from "react";
import { getListing } from "../../api/getListing";
import { reduxSelect } from "@/types/reduxHooks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { palette } from "@/components/styles/theme";
import { keywords } from "../../utils/keywords";
import { NotificationContext } from "@/features/Listeners/listeners";
import { readNotification } from "@/features/notifications/api/readNotification";
import { imageBaseUrl } from "@/utils/createStorageURL";

const RequestCard = ({ orderID, order }: any) => {
    const { setNotifications, notifications } = useContext(NotificationContext)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [listingData, setListingData] = useState();
    const [lender, setLender] = useState(false);
    const name = order?.listing_name ?? null;
    const picture = order?.image_url ? `${imageBaseUrl}${order.image_url}` : 'https://placecage.vercel.app/placecage/g/200/300';
    const lenderID = order.lender_id;
    const user = reduxSelect((state) => state.usermeta) ?? null;
    const userID = user.id;
    let statusText = ""

    // console.log("requests  : ", order)

    useEffect(() => {
        const listingId = order.listing_id;
        fetchListing(listingId)

        if (lenderID === userID) {
            setLender(true)
        }
    }, [orderID, order])

    async function fetchListing(listingId: string) {
        const listing = await getListing(listingId);
        if (listing) setListingData(listing)
    }

    const handleNavigation = async () => {
        if (order?.owner_id) {
            if (order.owner_id === userID) {
                navigation.navigate('BuyerInfo', { purchaserId: order.listings_purchased_id })
                console.log("buyer info")
                // navigation.navigate('BuyerInfo', { purchaserId: order.purchaser_id })
            } else {
                navigation.navigate('SellerInfo', { purchaserId: order.listings_purchased_id })
                console.log("seller info")
                // navigation.navigate('SellerInfo', { purchaserId: order.purchaser_id })
            }
        } else {
            if (lender) {
                // console.log("borrower info : ", userID, order)
                navigation.navigate('BorrowerInfo', { purchaserId: order.listing_borrow_id })
                // navigation.navigate('BorrowerInfo', { borrowerId: order.purchaser_id })
            } else {
                // console.log("lender info : ", userID, order)
                navigation.navigate('LenderInfo', { purchaserId: order.listing_borrow_id })
                // navigation.navigate('LenderInfo', { borrowerId: order.purchaser_id })
            }
        }

        // Then, perform the API call in the background
        (async () => {
            setNotifications(notifications.filter((notification: { id: string }) => notification.id !== order?.notification_id));
            await readNotification(order?.notification_id);
        })();

    }
    // console.log(order?.notification_id, order?.notification_read)

    const getListingStatus = () => {
        return order?.lender_id === userID ? keywords.lend :
            order?.borrower_id === userID ? keywords.borrow :
                order?.owner_id === userID ? keywords.sell :
                    order?.purchaser_id === userID && keywords.buy
    }
    // console.log(order?.notification_id, order?.notification_read)

    statusText = getListingStatus() as string;

    return (
        <TouchableOpacity
            onPress={handleNavigation} >
            <Wrapper>
                <View style={SRC.mainContainer}>
                    <Image style={SRC.image} source={{
                        uri: picture
                    }} />
                    {order?.notification_id && !order?.notification_read &&
                        <View style={SRC.yellowCircle} />
                    }
                    <View style={SRC.content}>
                        <Text style={SRC.title} numberOfLines={1}>{name || 'user name'}</Text>
                        <Text style={SRC.meta} numberOfLines={1}>{keywords.item}{name}</Text>
                    </View>
                    <View style={SRC.timestamp}>
                        <Text style={[SRC.itemStatus, { backgroundColor: (statusText === keywords.lend || statusText == keywords.borrow) ? palette.lightGrey : 'rgba(255, 243, 176, 1)' }]}>
                            {order?.lender_id === userID ? keywords.lend :
                                order?.borrower_id === userID ? keywords.borrow :
                                    order?.owner_id === userID ? keywords.sell :
                                        order?.purchaser_id === userID && keywords.buy}
                        </Text>
                        <TouchableOpacity style={SRC.icon} onPress={handleNavigation}>
                            <FontAwesomeIcon icon={'chevron-right'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Wrapper>
        </TouchableOpacity>
    )
}

export default RequestCard