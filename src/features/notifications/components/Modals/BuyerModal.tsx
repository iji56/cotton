import { Modal, ActivityIndicator, FlatList, Image, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { ModalTpe } from '../../utils/types'
import BuyerInfo from '@/features/orders/screens/BuyerInfo';
// import { palette } from '@/components/styles/theme';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { reduxSelect } from '@/types/reduxHooks';
// import Wrapper from '@/components/Wrapper';
// import SBI from './BuyerModal.styles';
// import H2 from '@/components/elements/H2';
// import H3 from '@/components/elements/H3';
// import { ParamListBase, useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import Avatar from '@/components/elements/Avatar';
// import TextField from '@/components/elements/Forms/TextField';
// import BottomSheets from "@/components/elements/BottomSheet";
// import H1 from "@/components/elements/H1";
// import Button from "@/components/elements/Button/Button";
// import AddressesSearchBar from '@/features/addresses/components/AddressSearchBar';
// import { GooglePlaceData, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
// import Geocoder from 'react-native-geocoding';
// import { getPurchaseListingData } from '@/features/orders/api/getPurchaseListingData';
// import { getListingAddress } from '@/features/orders/api/getListingAddress';
// import { getUserData } from '@/features/orders/api/getUserData';
// import { getUserListing } from '@/features/orders/api/getUserListing';
// import { getListingUpdateAddressStatus } from '@/features/orders/api/getListingUpdateAddressStatus';
// import { acceptOrderBySeller } from '@/features/orders/api/acceptOrderBySeller';
// import { cancelOrderByBuyer } from '@/features/orders/api/cancelOrderByBuyer';
// import PostCard from '@/features/orders/components/PostCard';
// import { updateSellerAddress } from '@/features/orders/api/updateSellerAddress';
// import OrdersHeader from '@/features/orders/components/OrdersHeader';
// import { keywords } from '@/features/orders/utils/keywords';
// import ListingItem from '@/features/orders/components/ListingItem';
// import { createShipment, createShipmentPayload } from '@/features/orders/api/createShipment';
// import { confirmPayment } from '@stripe/stripe-react-native';


const BuyerModal = ({ visible, toggle, purchaserId }: ModalTpe) => {

    // const insets = useSafeAreaInsets();
    // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    // const currentUser = reduxSelect(state => state.usermeta.id);
    // const [buyer, setBuyer] = useState<any>({});
    // const [listing, setListing] = useState<any>({});
    // const [start, setStart] = useState('')
    // const [end, setEnd] = useState('')
    // const [note, setNote] = useState('');
    // const [listings, setListings] = useState([]);
    // const [address, setAddress] = useState<GooglePlaceData>();
    // const [confirmAddressSnapPoint, setConfirmAddressSnapPoint] = useState<number | string>(1);
    // const [updateAddressSnapPoint, setUpdateAddressSnapPoint] = useState('1%');
    // const [addressUpdatedSnapPoint, setAddressUpdatedSnapPoint] = useState('1%');
    // const [keyboardVisible, setKeyboardVisible] = useState(false)
    // const [isLoading, setIsLoading] = useState(true);
    // const confirmAddressRef = useRef<any>();
    // const updateAddressRef = useRef<any>();
    // const addressUpdatedRef = useRef<any>();
    // const addressRef = useRef<GooglePlacesAutocompleteRef>();

    // const [addressUpdated, setAddressUpdated] = useState<boolean>();

    // const picture = 'https://placecage.vercel.app/placecage/g/200/300';

    // const distance = '5.0';

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    //     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    //     return () => {
    //         keyboardDidShowListener.remove();
    //         keyboardDidHideListener.remove();
    //     }
    // }, []);

    // useEffect(() => {

    //     console.log("purchaser id : ", purchaserId)
    //     const getBuyerDetail = async () => {
    //         setIsLoading(true)
    //         let listingDetail = await getPurchaseListingData(purchaserId);

    //         setListing(listingDetail)
    //         setAddressUpdated(!listingDetail?.is_address_approved_by_purchaser && listingDetail?.is_address_updated_by_owner || false);

    //         const listingAddress = await getListingAddress(listingDetail.address_id);
    //         console.log("listingAddress : ", listingAddress)
    //         setAddress({
    //             description: listingAddress[0]?.address?.split("#")[0] || '',
    //             mainText: listingAddress[0]?.address?.split("#")[1] || '',
    //             secondaryText: listingAddress[0]?.address?.split("#")[2] || '',
    //         });
    //         const response = await getUserData(listingDetail.purchaser_id);
    //         setBuyer(response[0]);

    //         const userListings = await getUserListing(listingDetail.purchaser_id);
    //         setListings(userListings);

    //         const listingAddressUpdated = await getListingUpdateAddressStatus(listingDetail?.listings_purchased_id)
    //         console.log("listingAddressUpdated : ", listingAddressUpdated)
    //         setIsLoading(false)
    //         // const snapPoint = (!listingDetail?.is_address_approved_by_purchaser && listingDetail?.is_address_updated_by_owner) ? 1 : '35%';
    //         // setConfirmAddressSnapPoint(snapPoint);
    //         // if (snapPoint !== 1) {
    //         //     setTimeout(() => {
    //         //         confirmAddressRef.current?.snapToIndex(1)
    //         //     }, 500)
    //         // }
    //     }

    //     getBuyerDetail()
    // }, [])

    // const formatter = new Intl.DateTimeFormat('en-US', {
    //     month: 'short', // Abbreviated month name (e.g., "Mar")
    //     day: 'numeric' // Numeric day of the month
    // });

    // useEffect(() => {

    //     const startDate = new Date(listing?.meet_up_date || null)
    //     const endDate = new Date(listing?.meet_up_date || null)
    //     const formattedStart = formatter.format(startDate)
    //     const formattedEnd = formatter.format(endDate)
    //     setStart(formattedStart)
    //     setEnd(formattedEnd)
    // }, [listing])

    // const confirmPaymentIntent = async () => {
    //     const { error: confirmError, paymentIntent } = await confirmPayment(
    //         listing?.payment_client_secret,
    //         {
    //             paymentMethodType: 'Card',
    //             paymentMethodData: {
    //                 paymentMethodId: listing.payment_method_id,
    //             }
    //         }
    //     );
    //     if (paymentIntent) console.log("confirmed payment intent ", paymentIntent)
    //     if (confirmError) console.log("Error confirming payment intent:", confirmError)
    // }

    // const handleAccept = async () => {
    //     //  check it required money is available...

    //     acceptOrderBySeller(listing?.listings_purchased_id, listing?.purchaser_id).then(async () => {
    //         await createShipment(createShipmentPayload.shippingPoint, createShipmentPayload.sender, createShipmentPayload.destination, createShipmentPayload.parcel, createShipmentPayload.notificationEmail, createShipmentPayload.contractId, createShipmentPayload.paymentMethod);
    //         await confirmPaymentIntent()
    //     });

    //     navigation.goBack();
    // }

    // const handleDeny = async () => {
    //     await cancelOrderByBuyer(listing?.listings_purchased_id, 0, listing?.purchaser_id)  // 0 mean  seller cancel order
    //     navigation.goBack();
    // }
    // const renderItem = ({ item }) => {

    //     return (
    //         <PostCard listing={item.listing_record} />
    //     )
    // }
    // const onPress = (data: GooglePlaceData, details = null) => {
    //     setAddress({
    //         mainText: data.structured_formatting.main_text,
    //         secondaryText: data.structured_formatting.secondary_text,
    //         description: data.description,
    //     });
    // }

    // const updateAddress = async () => {
    //     let location: Geocoder.LatLng;
    //     let selectedAddress = address?.description + "#" + address?.mainText + "#" + address?.secondaryText;
    //     await Geocoder.from(address?.description).then(async res => {
    //         if (res.status === 'OK') {
    //             location = res.results[0].geometry?.location;
    //             await updateSellerAddress(selectedAddress, location.lat, location.lng, currentUser!, listing.id, listing?.purchaser_id, listing?.listings_purchased_id);
    //             setAddressUpdated(true)
    //         }
    //     }).catch(async error => {
    //         await updateSellerAddress(selectedAddress, location.lat || 0, location.lng || 0, currentUser!, listing.id, listing?.purchaser_id, listing?.listings_purchased_id);
    //         setAddressUpdated(true)
    //     })
    // }

    const route = {
        params: {
            purchaserId: purchaserId,
            toggle: toggle
        }
    }

    return (
        <Modal visible={visible} transparent onDismiss={toggle}>
            <BuyerInfo route={route} />
        </Modal>
    )
}

export default BuyerModal


/**
 *
 *
 *
 *     <View style={{
                flex: 1,
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white
            }}
            >
                {!isLoading ? <>
                    {listing?.is_address_updated_by_owner && listing?.is_address_approved_by_purchaser ?
                        <>
                            <Image source={require('../../components/assets/check.png')} style={SBI.checkIcon} />
                            <View style={SBI.requestSent}>
                                <H1 text={keywords.orderConfirmed} />
                            </View>
                        </> :
                        listing?.status === keywords.status.decline &&
                        <>
                            <Image source={require('../../components/assets/cross.png')} style={SBI.checkIcon} />
                            <View style={SBI.requestSent}>
                                <H1 text={keywords.orderCancelled} />
                            </View>
                        </>
                    }

                    <H2 text={listing?.listing_name} style={{ paddingLeft: 20, paddingTop: 20, fontSize: 20 }} onPress={() => navigation.goBack()} />
                    <Text style={SBI.infoText}>
                        {keywords.requestExpireInfo}
                    </Text>
                    <Wrapper>
                        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
                            <H2 text={keywords.buyerInfo} style={SBI.title} />
                            <View style={SBI.userContainer}>
                                <Image source={{ uri: picture }} style={SBI.userImage} />
                                <View style={SBI.usernameContainer}>
                                    <H2 text={buyer?.user_info?.user_name} />
                                    <H3 text={`${buyer?.user_info?.city} ${buyer?.user_info?.country ?? ''}`} />
                                </View>
                            </View>
                            <Text style={SBI.distanceText}>{distance}{keywords.awayMessage}</Text>
                            <View style={SBI.infoCard}>
                                <View style={SBI.infoContainer}>
                                    <View style={SBI.infoRow}>
                                        <H2 text={keywords.memberOnRax} />
                                        <Text style={SBI.text}>jan 2024</Text>
                                    </View >
                                    <View style={SBI.infoRow}>
                                        <H2 text={keywords.itemborrowed} />
                                        <Text style={SBI.text}>10</Text>
                                    </View>
                                </View>
                                <View style={SBI.infoContainer}>
                                    <View style={SBI.infoRow}>
                                        <H2 text={keywords.rating} />
                                        <Text style={SBI.text}>3.5</Text>
                                    </View >
                                    <View style={SBI.infoRow}>
                                        <H2 text={keywords.reviewsByLender} />
                                        <Text style={SBI.text}>5</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={SBI.listingContainer}>
                                <ListingItem itemData={{ images: listing?.listing_profile || picture, name: listing?.listing_name, type: listing?.type, size: listing?.size }} selectedDates={[listing?.meet_up_date, listing?.meet_up_date]} />
                            </View>

                            <H2 text={keywords.borrowDate} style={SBI.subHeading} />
                            <Text style={SBI.text}>{start} - {end}</Text>

                            <H2 text={keywords.borrowMethod} style={SBI.subHeading} />
                            <Text style={SBI.text}>{!listing?.is_first_lend ? keywords.localPickup : keywords.shipping}</Text>

                            <H2 text={keywords.yourAddress} style={SBI.subHeading} />
                            <Text style={SBI.text}>{address?.description || 'address'}</Text>
                            <Text style={SBI.linkText} onPress={() => {
                                updateAddressRef.current?.snapToIndex(1);
                                setUpdateAddressSnapPoint('80%');
                            }}>{keywords.updateAddress}</Text>

                            <H2 text={keywords.earnings} style={SBI.subHeading} />
                            <Text style={SBI.text}>{'CA $'}{listing?.bt_amount ?? 0}</Text>

                            <View style={SBI.userSmallContainer}>
                                <Avatar size='s' avatar={picture} />
                                <H2 text={buyer?.user_info?.user_name} style={SBI.username} />
                            </View>

                            <TextField value={note} onChangeText={(note) => setNote(note)} placeholder={keywords.leaveSellerNotePlaceholder} style={SBI.input} multiline />
                            <Text style={SBI.note}>{keywords.note} <Text style={SBI.noteText}>{keywords.noteMessageYourMessageWillBeSent}</Text></Text>
                            <View style={SBI.listingsContainer}>
                                <H2 text={`${keywords.lstingFrom} ${buyer?.user_info?.user_name}`} />
                                <FlatList
                                    data={listings}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        </ScrollView>
                    </Wrapper>
                    <View style={SBI.bottomContainer}>
                        {(addressUpdated && listing?.status !== keywords.status.decline) ?
                            <View style={SBI.disableButtonContainer}>
                                <Button text={keywords.waitingForBorrowerToReview} onPress={() => { }} variant='secondary' style={SBI.disableButton} buttonTextColor={palette.white} fontSize={14} />
                            </View> :
                            (listing?.status === keywords.status.inProgress || listing?.status === keywords.status.decline) ?
                                <View style={SBI.disableButtonContainer}>
                                    <Button text={keywords.returnHome} onPress={() => navigation.goBack()} variant='main' style={[SBI.disableButton, { backgroundColor: palette.darkBlue }]} buttonTextColor={palette.white} fontSize={14} />
                                </View> :
                                <>
                                    <TouchableOpacity style={SBI.button} onPress={handleAccept}>
                                        <Text style={SBI.buttonText}>{keywords.accept}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDeny} style={[SBI.button, { backgroundColor: 'rgba(165, 40, 52, 1)' }]}>
                                        <Text style={SBI.buttonText}>{keywords.deny}</Text>
                                    </TouchableOpacity>
                                </>
                        }
                    </View >
                    <BottomSheets snapPoint={confirmAddressSnapPoint} bottomSheetRef={confirmAddressRef} handleSheetChanges={(index: number) => { }}>
                        <View style={SBI.bottomSheetContainer}>
                            <H1 text={keywords.confirmAdress} style={SBI.bottomSheetTitle} />
                            <View style={SBI.bottomSheetHeader}>
                                <Text style={SBI.bottomSheetText}>{keywords.yourCurrentAddress}
                                    <Text style={[SBI.boldText, { width: '98%' }]}>{address?.description || 'address'}</Text>
                                </Text>
                            </View>
                            <View style={SBI.bottomSheetButtonContainer}>
                                <Button text={keywords.updateAddress} onPress={() => {
                                    setConfirmAddressSnapPoint('1%');
                                    setUpdateAddressSnapPoint('80%')
                                    updateAddressRef.current?.snapToIndex(1)
                                }} variant="secondary" style={SBI.grayButton} buttonTextColor={palette.black} fontSize={14} />
                                <View style={SBI.space} />
                                <Button text={keywords.looksGood} onPress={() => setConfirmAddressSnapPoint('1%')} variant="main" />
                            </View>
                        </View>
                    </BottomSheets>
                    {/* <BottomSheets snapPoint={updateAddressSnapPoint} bottomSheetRef={updateAddressRef} handleSheetChanges={(index: number) => { }}>
                        <View style={SBI.bottomSheetContainer}>
                            <H1 text={keywords.updateAddress} style={SBI.bottomSheetTitle} />
                            <View style={SBI.bottomSheetHeader}>
                                <AddressesSearchBar onPress={onPress} addressRef={addressRef} containerStyle={{ marginHorizontal: 0 }} />
                            </View>
                            {!keyboardVisible &&
                                <View style={SBI.bottomButton}>
                                    <Button text={keywords.back} onPress={() => setUpdateAddressSnapPoint('1%')} variant="secondary" style={SBI.grayButton} buttonTextColor={palette.black} fontSize={14} />
                                    <View style={SBI.space} />
                                    <Button text={keywords.update} onPress={() => {
                                        setUpdateAddressSnapPoint('1%');
                                        setAddressUpdatedSnapPoint('40%');
                                        addressUpdatedRef.current?.snapToIndex(1)
                                        updateAddress()
                                    }} variant="main" />
                                </View>
                            }
                        </View>
                    </BottomSheets> */
// <BottomSheets snapPoint={addressUpdatedSnapPoint} bottomSheetRef={addressUpdatedRef} handleSheetChanges={(index: number) => { }}>
//     <View style={SBI.bottomSheetContainer}>
//         <H1 text={keywords.addressUpdated} style={SBI.bottomSheetTitle} />
//         <View style={SBI.bottomSheetHeader}>
//             <Text style={SBI.bottomSheetText}>{keywords.yourUpdatedAddress}
//                 <Text style={SBI.boldText}>{address?.description}</Text>
//             </Text>
//             <Text style={[SBI.bottomSheetText, { marginTop: 0 }]}>{keywords.updatedAddressMessage}</Text>
//         </View>
//         <View style={SBI.bottomSheetButtonContainer}>
//             <Button text={keywords.updateAddress} onPress={() => {
//                 setAddressUpdatedSnapPoint('1%');
//                 setUpdateAddressSnapPoint('80%')
//             }} variant="secondary" style={SBI.grayButton} buttonTextColor={palette.black} fontSize={14} />
//             <View style={SBI.space} />
//             <Button text={keywords.looksGood} onPress={() => setAddressUpdatedSnapPoint('1%')} variant="main" />
//         </View>
//     </View>
//         </BottomSheets>
//     </> :
//         <View style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center'
//         }}>
//             <ActivityIndicator size={'large'} color={palette.darkBlue} />
//         </View>}
// </View >
//  * 
//  */