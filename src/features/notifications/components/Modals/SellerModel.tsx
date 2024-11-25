import { ActivityIndicator, Image, Modal, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ModalTpe } from '../../utils/types'
import SellerInfo from '@/features/orders/screens/SellerInfo';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import SLI from './SellerModals.styles';
// import H1 from '@/components/elements/H1';
// import { keywords, placeholderPicture } from '../../../borrow/utils/staticTexts';
// import ListingItem from '../../../borrow/components/ListingItem';
// import Button from '@/components/elements/Button/Button';
// import H2 from '@/components/elements/H2';
// import { formatDate } from '../../../borrow/utils/formatDate';
// import Wrapper from '@/components/Wrapper';
// import { ParamListBase, useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import moment from 'moment'
// import RadioButtonGroup from '@/components/elements/Forms/RadioButton';
// import { GooglePlaceData } from 'react-native-google-places-autocomplete';
// import { palette } from '@/components/styles/theme';
// import GetLocation from 'react-native-get-location';
// import { getDistanceBetweenTwoPoints } from '@/features/addresses/api/getDistance';
// import IconButton from '@/components/elements/Button/IconButton';
// import { faArrowLeftLong } from '@fortawesome/sharp-regular-svg-icons';

// import { getPurchaseListingData } from '@/features/orders/api/getPurchaseListingData';
// import { getUserData } from '@/features/orders/api/getUserData';
// import { getListingAddress } from '@/features/orders/api/getListingAddress';
// import { cancelOrderByBuyer } from '@/features/orders/api/cancelOrderByBuyer';
// import { approveUpdateAddressByBuyer } from '@/features/orders/api/approveUpdateAddressByBuyer';
// import { acceptOrderBySeller } from '@/features/orders/api/acceptOrderBySeller';
// import { getDeliveryCharge } from '@/features/borrow/api/getDeliveryCharge';
// import { createShipment, createShipmentPayload } from '@/features/orders/api/createShipment';


const SellerModel = ({ visible, toggle, purchaserId }: ModalTpe) => {
    // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    // const [update, setUpdate] = useState<boolean | null>(null);
    // const [seller, setSeller] = useState<any>(null);
    // const [listing, setListing] = useState<any>({});
    // const [borrowMethod, setBorrowMethod] = useState('')
    // const [updatedBorrowMethod, setUpdatedBorrowMethod] = useState('');
    // const [address, setAddress] = useState<GooglePlaceData>();
    // const [distance, setDistance] = useState<string | null>('20 kms');
    // const [shippingCost, setShippingCost] = useState('10.00');
    // const [totalAmounts, setTotalAmount] = useState(0);
    // const [newShippingCost, setNewShippingCost] = useState('10.00');
    // const [newTotalAmounts, setNewTotalAmount] = useState(0);
    // const [estimatedCost, setEstimatedCost] = useState(0);
    // const [isLoading, setIsLoading] = useState(true);
    // const insets = useSafeAreaInsets();

    // const fetchDeliveryCharge = async (originPostalCode: string, seller: boolean) => {
    //     const deliveryCharge = await getDeliveryCharge("K1K4T3", "V6B1A1"); //originPostalCode
    //     return seller ? deliveryCharge?.initialCost || 0 : deliveryCharge?.totalCost || 0;
    // }


    // useEffect(() => {
    //     console.log("purchaser id : ", purchaserId)
    //     setIsLoading(true)
    //     const getSellerDetail = async () => {
    //         let listingDetail = await getPurchaseListingData(purchaserId);
    //         const addressResponse = await getListingAddress(listingDetail?.address_id)
    //         console.log("Address : ", addressResponse)
    //         const charge = await fetchDeliveryCharge(addressResponse[0]?.postal_code, listingDetail?.cp_id ? true : false);
    //         setEstimatedCost(charge || 0);
    //         setListing(listingDetail)
    //         setBorrowMethod(listing?.cp_id ? keywords.shipping : keywords.localPickup)
    //         setUpdatedBorrowMethod(listing?.cp_id ? keywords.shipping : keywords.localPickup);
    //         setTotalAmount((listingDetail?.price_borrow + listingDetail?.cost_shipping)?.toFixed(2));
    //         setNewTotalAmount((charge + listingDetail?.price_borrow)?.toFixed(2));

    //         GetLocation.getCurrentPosition({
    //             enableHighAccuracy: true,
    //             timeout: 60000,
    //         })
    //             .then(async location => {
    //                 const response = await getUserData(listingDetail?.owner_id);
    //                 setSeller(response[0]);
    //                 const listingAddress = await getListingAddress(listingDetail.address_id);
    //                 const distance = await getDistanceBetweenTwoPoints(location, { latitude: listingAddress[0].latitude, longitude: listingAddress[0].longitude });
    //                 setDistance(distance || keywords.noRoute)
    //                 setAddress({
    //                     mainText: listingAddress[0]?.address?.split("#")[0] || '',
    //                     secondaryText: listingAddress[0]?.address?.split("#")[1] || '',
    //                     description: listingAddress[0]?.address?.split("#")[2] || '',
    //                 })
    //                 setIsLoading(false)
    //             })
    //             .catch(async error => {
    //                 setIsLoading(false)
    //                 if (error.message === 'Authorization denied') {
    //                     // await directToSetting()
    //                 }
    //             })
    //     }

    //     getSellerDetail()
    // }, [])

    // const handleUpdate = async () => {
    //     setUpdate(false)
    //     if (updatedBorrowMethod === keywords.cancelOrder) {
    //         await cancelOrderByBuyer(listing?.listings_purchased_id, 1, listing?.owner_id) // 1 mean  buyer cancel order
    //     } else if (updatedBorrowMethod === keywords.shipping) {
    //         await handleAddressUpdateApproveByBuyer();
    //     }
    // }

    // const handleAddressUpdateApproveByBuyer = async () => {
    //     setUpdate(false)
    //     approveUpdateAddressByBuyer(listing?.listings_purchased_id, listing?.owner_id).then(() => {
    //         acceptOrderBySeller(listing?.listings_purchased_id, listing?.purchaser_id).then(async () => {
    //             await createShipment(createShipmentPayload.shippingPoint, createShipmentPayload.sender, createShipmentPayload.destination, createShipmentPayload.parcel, createShipmentPayload.notificationEmail, createShipmentPayload.contractId, createShipmentPayload.paymentMethod);
    //         }).catch(error => {
    //             console.log("Error accepting order : ", error);
    //         })
    //     }).catch(error => {
    //         console.log("Error updateing address : ", error);
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
            <SellerInfo route={route} />
        </Modal>
    )
}

export default SellerModel


/**
 * 
 * 
 *   <View style={{
                flex: 1,
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}>
                {!isLoading ?
                    <ScrollView contentContainerStyle={SLI.container} showsVerticalScrollIndicator={false}>
                        {
                            listing?.is_address_updated_by_owner && !listing?.is_address_approved_by_purchaser && update === null ?
                                <>
                                    <Image source={require('../../components/assets/info.png')} style={SLI.checkIcon} />
                                    <View style={SLI.requestSent}>
                                        <H1 text={keywords.addressUpdate} />
                                    </View>
                                </> :
                                listing?.is_address_updated_by_owner && listing?.is_address_approved_by_purchaser && update === null ?
                                    <>
                                        <Image source={require('../../components/assets/check.png')} style={SLI.checkIcon} />
                                        <View style={SLI.requestSent}>
                                            <H1 text={keywords.orderConfirmed} />
                                        </View>
                                    </> :
                                    // (listing?.status === "in progress" || listing?.status === 'awaiting confirmation') ?
                                    //     <>
                                    //         <Image source={require('../../components/assets/check.png')} style={SLI.checkIcon} />
                                    //         <View style={SLI.requestSent}>
                                    //             <H1 text={keywords.requestAccepted} />
                                    //         </View>
                                    //     </> :
                                    listing?.status === keywords.decline &&
                                    <>
                                        <Image source={require('../../components/assets/cross.png')} style={SLI.checkIcon} />
                                        <View style={SLI.requestSent}>
                                            <H1 text={keywords.orderCancelled} />
                                        </View>
                                    </>
                        }
                        {listing?.is_address_updated_by_owner && !listing?.is_address_approved_by_purchaser && update === null ?
                            borrowMethod !== keywords.shipping ?
                                <>
                                    <View style={SLI.addressUpdateContainer}>
                                        <Text style={[SLI.message, SLI.boldText]}>{keywords.requestExpires}</Text>

                                        <Text style={[SLI.message, SLI.boldText, { textAlign: 'left' }]}>{keywords.yourLenderJustUpdatedAddress}</Text>

                                        <Text style={[SLI.message, { textAlign: 'left' }]}>{keywords.pleaseConfirm}</Text>

                                        <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5 }]}>{keywords.distanceToNewAddress}</Text>
                                        <Text style={[SLI.message, { textAlign: 'left' }]}>{distance}</Text>

                                        <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, }]}>{keywords.originalBorrowMethod}</Text>
                                        <Text style={[SLI.message, { textAlign: 'left', }]}>{borrowMethod}</Text>

                                        <View style={SLI.addressUpdateButtonContainer}>
                                            <Button text={keywords.lookGood} onPress={handleAddressUpdateApproveByBuyer} variant='main' style={SLI.updateButton} />
                                            <View style={SLI.space} />
                                            <Button text={keywords.update} onPress={() => setUpdate(true)} variant='secondary' style={[SLI.updateButton, { backgroundColor: 'rgba(255, 243, 176, 1)' }]} />
                                        </View>
                                    </View>
                                </> :
                                <>
                                    <View style={SLI.addressUpdateContainer}>
                                        <Text style={[SLI.message, SLI.boldText]}>{keywords.requestExpires}</Text>

                                        <Text style={[SLI.message, SLI.boldText, { textAlign: 'left' }]}>{keywords.yourLenderJustUpdatedAddress}</Text>

                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flex: .6 }}>
                                                <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5 }]}>{keywords.shippingCost}</Text>
                                                <Text style={[SLI.message, { textAlign: 'left' }]}>{'CA $'}{listing?.cost_shipping}</Text>
                                            </View>
                                            <View style={{ flex: .4 }}>
                                                <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, }]}>{keywords.totalAmount}</Text>
                                                <Text style={[SLI.message, { textAlign: 'left' }]}>{'CA $'}{totalAmounts}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flex: .6 }}>
                                                <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5 }]}>{keywords.newShippingCost}</Text>
                                                <Text style={[SLI.message, { textAlign: 'left' }]}>{'CA $'}{estimatedCost}</Text>
                                            </View>
                                            <View style={{ flex: .4 }}>
                                                <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5 }]}>{keywords.newTotalAmount}</Text>
                                                <Text style={[SLI.message, { textAlign: 'left' }]}>{'CA $'}{newTotalAmounts}</Text>
                                            </View>
                                        </View>

                                        <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5 }]}>{keywords.distanceToNewAddress}</Text>
                                        <Text style={[SLI.message, { textAlign: 'left' }]}>{distance}</Text>

                                        <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, }]}>{keywords.originalBorrowMethod}</Text>
                                        <Text style={[SLI.message, { textAlign: 'left', }]}>{borrowMethod}</Text>

                                        <View style={SLI.addressUpdateButtonContainer}>
                                            <Button text={keywords.lookGood} onPress={handleAddressUpdateApproveByBuyer} variant='main' style={SLI.updateButton} />
                                            <View style={SLI.space} />
                                            <Button text={keywords.update} onPress={() => setUpdate(true)} variant='secondary' style={[SLI.updateButton, { backgroundColor: 'rgba(255, 243, 176, 1)' }]} />
                                        </View>
                                    </View>
                                </> :
                            update &&
                            <>
                                <View style={SLI.addressUpdateContainer}>
                                    <Text style={[SLI.message, SLI.boldText, { textAlign: 'center' }]}>{keywords.requestExpires}</Text>

                                    <Text style={[SLI.message, SLI.boldText, { textAlign: 'left' }]}>{keywords.yourLenderJustUpdatedAddress}</Text>
                                    <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5 }]}>{keywords.distanceToNewAddress}</Text>
                                    <Text style={[SLI.message, { textAlign: 'left' }]}>{distance}</Text>

                                    <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, }]}>{keywords.originalBorrowMethod}</Text>
                                    <Text style={[SLI.message, { textAlign: 'left', }]}>{borrowMethod}</Text>

                                    <View style={SLI.addressUpdateInnerContainer}>
                                        <H2 text={keywords.buyMethod} />
                                        <RadioButtonGroup
                                            onChange={(option) => setUpdatedBorrowMethod(option as string)}
                                            options={[keywords.localPickup, keywords.shipping, keywords.cancelOrder]}
                                            selectedValue={updatedBorrowMethod}
                                        // disable={
                                        //     [{ value: false ? keywords.localPickup : '', message: '' },
                                        //     { value: true ? keywords.shipping : '', message: '' }]
                                        // }
                                        // showToolTip={false}
                                        />
                                        {updatedBorrowMethod === keywords.shipping && (
                                            <>

                                                <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, marginTop: 15 }]}>{keywords.estimatedShipppingCost}</Text>
                                                <Text style={[SLI.message, { textAlign: 'left' }]}>{'CA $'}{estimatedCost}</Text>

                                                <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, }]}>{keywords.newTotalAmount}</Text>
                                                <Text style={[SLI.message, { textAlign: 'left', }]}>{'CA $'}{newTotalAmounts}</Text>

                                            </>
                                        )}
                                        <Button text={keywords.update} onPress={handleUpdate} variant='main' style={SLI.updateButton} />
                                    </View>
                                </View>
                            </>
                        }
                        <Wrapper>
                            <View style={SLI.orderDetail}>
                                <H1 text={keywords.orderDetails} />
                            </View>
                            <View style={SLI.listingContainer}>
                                <ListingItem itemData={listing} />
                            </View>
                            <View style={SLI.calculationContainer}>
                                <View>
                                    <H2 text={keywords.startDate} />
                                    <Text style={SLI.value}>
                                        {formatDate(listing?.meet_up_date)}
                                    </Text>
                                </View>
                                <View>
                                    <H2 text={keywords.endDate} />
                                    <Text style={SLI.value}>
                                        {formatDate(listing?.meet_up_date)}
                                    </Text>
                                </View>
                            </View>
                            <View style={SLI.calculationContainer}>
                                <View>
                                    <H2 text={keywords.totalAmount} />
                                    <Text style={SLI.value}>{`CA $${totalAmounts}`}</Text>
                                </View>
                                <View style={{ width: 90, }}>
                                    <H2 text={keywords.borrow} />
                                    <Text style={SLI.value}>
                                        {moment(new Date(listing?.meet_up_date)).
                                            diff(moment(new Date(listing?.meet_up_date)),
                                                'days')} {keywords.days}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <H2 text={keywords.lender} style={{ marginTop: 20 }} />
                                <View style={SLI.userContainer}>
                                    <Image source={{ uri: seller?.user_info?.userAvatar || placeholderPicture }} style={SLI.userImage} />
                                    <H2 text={seller?.user_info?.user_name} />
                                </View>
                            </View>
                            {(!update && updatedBorrowMethod === keywords.cancelOrder) ?
                                <View style={[SLI.buttonContainer, { height: 40 }]}>
                                    <Button text={keywords.browseOtherListings} onPress={() => navigation.reset({
                                        routes: [{ name: 'PrimaryNav' }],
                                        index: 0
                                    })} variant='main' />
                                </View> :
                                <View style={SLI.buttonContainer}>
                                    <Button text={keywords.chatWithLender} onPress={() => { }} variant='secondary' style={SLI.button} />
                                    <View style={{ height: 20 }} />
                                    <Button text={keywords.returnHome} onPress={() => navigation.goBack()} variant='main' style={SLI.button} />
                                </View>
                            }
                        </Wrapper>
                    </ScrollView> :
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size={'large'} color={palette.darkBlue} />
                    </View>
                }
            </View>

 */