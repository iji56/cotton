import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SLI from './SellerInfo.styles';
import H1 from '@/components/elements/H1';
import { keywords, placeholderPicture } from '../../../borrow/utils/staticTexts';
import Button from '@/components/elements/Button/Button';
import H2 from '@/components/elements/H2';
import Wrapper from '@/components/Wrapper';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUserData } from '../../api/getUserData';
import RadioButtonGroup from '@/components/elements/Forms/RadioButton';
import { getListingAddress } from '../../api/getListingAddress';
import { palette } from '@/components/styles/theme';
import GetLocation from 'react-native-get-location';
import { getDistanceBetweenTwoPoints } from '@/features/addresses/api/getDistance';
import { cancelOrderByBuyer } from '../../api/cancelOrderByBuyer';
import { approveUpdateAddressByBuyer } from '../../api/approveUpdateAddressByBuyer';
import IconButton from '@/components/elements/Button/IconButton';
import { faArrowLeftLong } from '@fortawesome/sharp-regular-svg-icons';
import { getPurchaseListingData } from '../../api/getPurchaseListingData';
import { getDeliveryCharge } from '@/features/borrow/api/getDeliveryCharge';
import { reduxSelect } from '@/types/reduxHooks';
import ListingItem from '../../components/ListingItem';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { getDefaultAddress } from '@/features/addresses/api/getDefaultAddress';
import { createChatAndNavigate } from '@/features/profile/api/createChat';
import { updateBuyerAddressAndPickupStatus } from '../../api/updateBuyerAddressAndPickupStatus';
import { formatDate } from '../../utils/formatDate';

const SellerInfo = ({ route }: any) => {
    const listingId = route.params?.purchaserId;
    const toggleModal = route.params?.toggle;
    const user = reduxSelect(state => state.usermeta);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [update, setUpdate] = useState<boolean | null>(null);
    const [seller, setSeller] = useState<any>(null);
    const [listing, setListing] = useState<any>({});
    const [borrowMethod, setBorrowMethod] = useState('')
    const [updatedBorrowMethod, setUpdatedBorrowMethod] = useState('');
    const [address, setAddress] = useState({ mainText: "", secondaryText: "", description: "" });
    const [distance, setDistance] = useState<string | null>('20 kms');
    const [totalAmounts, setTotalAmount] = useState(0);
    const [newTotalAmounts, setNewTotalAmount] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    // const [senderAddress, setSenderAddress] = useState({ name: "", address: "", city: "", province: "", countryCode: '', postalCode: "" });
    // const [destinationAddress, setDestinationAddress] = useState({ name: "", address: "", city: "", province: "", countryCode: '', postalCode: "", email: "" });
    let message = null;

    const fetchDeliveryCharge = async (originPostalCode: string, seller: boolean, destinationPostalCode: string): Promise<number> => {

        const deliveryCharge = await getDeliveryCharge(originPostalCode, destinationPostalCode);
        return seller ? deliveryCharge?.initialCost || 0 : deliveryCharge?.totalCost || 0;
    }

    useEffect(() => {
        const getSellerDetail = async () => {
            try {
                setIsLoading(true)
                let listingDetail = await getPurchaseListingData(listingId);
                const addressResponse = await getListingAddress(listingDetail?.address_id)
                // const receiverDetail = listingId && await getUsermeta(listingDetail?.purchaser_id);
                // console.log("listingDetail: ", receiverDetail)
                let destinationAddress = await getDefaultAddress(listingDetail?.purchaser_id)
                // if (destinationAddress && destinationAddress.length > 0) {
                //     let addresses = destinationAddress[0].address.split('#')[0].split(',');
                //     setDestinationAddress({
                //         name: `${receiverDetail.first_name} ${receiverDetail.last_name || ''}`,
                //         address: addresses[0],
                //         city: addresses[addresses.length - 3] || '',
                //         province: addresses[addresses.length - 2],
                //         countryCode: addresses[addresses.length - 1],
                //         postalCode: destinationAddress[0].postal_code,
                //         email: receiverDetail.email
                //     })
                // }

                // let addresses = addressResponse[0].address.split('#')[0].split(',');
                // setSenderAddress({
                //     name: `${user.first_name!} ${user.last_name || ''}`,
                //     address: addresses[0],
                //     city: addresses[addresses.length - 3] || '',
                //     province: addresses[addresses.length - 2],
                //     countryCode: addresses[addresses.length - 1],
                //     postalCode: addressResponse[0].postal_code
                // })

                setAddress({
                    mainText: addressResponse[0]?.address?.split("#")[0] || '',
                    secondaryText: addressResponse[0]?.address?.split("#")[1] || '',
                    description: addressResponse[0]?.address?.split("#")[2] || '',
                })

                const charge = await fetchDeliveryCharge(destinationAddress[0]?.postal_code, listingDetail?.cp_id ? true : false, addressResponse[0]?.postal_code);
                setEstimatedCost(parseFloat(charge?.toFixed(2)) || 0);

                setListing(listingDetail)
                setBorrowMethod(listingDetail?.cp_id ? keywords.shipping : keywords.localPickup)
                setUpdatedBorrowMethod(listingDetail?.cp_id ? keywords.shipping : keywords.localPickup);
                setTotalAmount((listingDetail?.total_price)?.toFixed(2));
                setNewTotalAmount((charge + listingDetail?.price_borrow)?.toFixed(2));
                const response = await getUserData(listingDetail?.owner_id);
                console.log("User info : ", response)
                setSeller(response[0]);
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 60000,
                })
                    .then(async location => {


                        const distance = await getDistanceBetweenTwoPoints(location, { latitude: addressResponse[0].latitude, longitude: addressResponse[0].longitude });
                        setDistance(distance || keywords.noRoute)
                        setIsLoading(false)
                    })
                    .catch(async error => {
                        setIsLoading(false)
                        if (error.message === 'Authorization denied') {
                            // await directToSetting()
                        }
                    })
            } catch (error) {
                setIsLoading(false)
            }
        }

        getSellerDetail()
    }, [])

    const handleUpdate = async () => {

        if (updatedBorrowMethod === keywords.cancelOrder) {
            await cancelOrderByBuyer(listing?.listings_purchased_id, 1, listing?.owner_id) // 1 mean  buyer cancel order
            setUpdate(false)
            navigation.goBack()
        } else {
            await updateBuyerAddressAndPickupStatus(listingId,
                listing.owner_id,
                updatedBorrowMethod === keywords.shipping ? 1 : 0,
                updatedBorrowMethod === keywords.shipping ? estimatedCost : 0,
                listing?.local_pickup_date || listing?.shipping_date,
                listing?.shipping_date || listing?.local_pickup_date);
            setUpdate(false)
            navigation.goBack()
        }
    }

    const handleAddressUpdateApproveByBuyer = async () => {
        try {
            setIsLoading(true)
            // if (listing?.cp_id) {
            //     console.log("listing ss : ", listing)
            //     if (senderAddress.postalCode && destinationAddress.postalCode) {
            //         await confirmPaymentIntent(listing?.payment_client_secret, listing.payment_method_id).then(() => {
            //             createShipment(createShipmentPayloadSample.shippingPoint, senderAddress, destinationAddress, createShipmentPayloadSample.parcel).then((response) => {
            //                 if (response?.error || response?.status === false || response?.response?.error || response?.response?.status === false) {
            //                     setIsLoading(false);
            //                     errorToast(response.error || response?.response?.error)
            //                 } else {
            //                     response?.response && approveUpdateAddressByBuyer(listing?.listings_purchased_id, listing?.owner_id).then(async () => {
            //                         await acceptOrderBySeller(listing?.listings_purchased_id, listing?.purchaser_id, [response.response]);
            //                         navigation.goBack();
            //                         setIsLoading(false);
            //                     }).catch(error => {
            //                         setIsLoading(false);
            //                         console.log("Error updateing address : ", error);
            //                     })
            //                 }
            //             }).catch(() => setIsLoading(false));
            //         }).catch(() => setIsLoading(false));

            //     } else {
            //         setIsLoading(false);
            //         errorToast(keywords.noPostalCode)
            //     }
            // } else {
            approveUpdateAddressByBuyer(listingId, listing.owner_id).then(async () => {
                // await updateListingPurchaseStatus(listing?.listings_purchased_id, listing?.owner_id);
                setUpdate(false)
                setIsLoading(false)
                navigation.goBack();
            }).catch(() => setIsLoading(false))
            // }
        } catch (error) {
            setIsLoading(false)
        }
    }

    const handleChat = async () => {
        setLoading(true)
        await createChatAndNavigate(user.id!, seller.user_info.id, seller.user_info.user_name!, navigation);
        setLoading(false)
    }

    const handleReturnHome = () => {
        toggleModal && toggleModal();
        setTimeout(() => {
            navigation.reset({
                routes: [{ name: 'PrimaryNav' }],
                index: 0
            })
        }, 500)
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <View style={SLI.orderDetail}>
                <IconButton icon={faArrowLeftLong} size={20} style={{ marginRight: 20 }} onPress={() => navigation.goBack()} />
                <H1 text={keywords.orderDetails} />
            </View>
            {!isLoading ?
                <ScrollView contentContainerStyle={SLI.container} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
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
                                updatedBorrowMethod === keywords.cancelOrder ?
                                    <>
                                        <Image source={require('../../components/assets/cross.png')} style={SLI.checkIcon} />
                                        <View style={SLI.requestSent}>
                                            <H1 text={keywords.orderDeclined} />
                                        </View>
                                    </> :
                                    listing?.status === keywords.decline ?
                                        <>
                                            <Image source={require('../../components/assets/cross.png')} style={SLI.checkIcon} />
                                            <View style={SLI.requestSent}>
                                                <H1 text={keywords.orderCancelled} />
                                            </View>
                                        </>
                                        :
                                        listing?.status === keywords.inProgress &&
                                        <>
                                            <Image source={require('../../components/assets/check.png')} style={SLI.checkIcon} />
                                            <View style={SLI.requestSent}>
                                                <H1 text={keywords.requestAccepted} />
                                            </View>
                                        </>
                    }
                    {listing?.is_address_updated_by_owner && !listing?.is_address_approved_by_purchaser && update === null ?
                        borrowMethod !== keywords.shipping ?
                            <>
                                <View style={SLI.addressUpdateContainer}>
                                    {/* <Text style={[SLI.message, SLI.boldText]}>{keywords.requestExpires}</Text> */}

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
                                    {/* <Text style={[SLI.message, SLI.boldText]}>{keywords.requestExpires}</Text> */}

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
                                {/* <Text style={[SLI.message, SLI.boldText, { textAlign: 'center' }]}>{keywords.requestExpires}</Text> */}

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
                                    />
                                    {updatedBorrowMethod === keywords.shipping && (
                                        <>

                                            <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, marginTop: 15 }]}>{keywords.estimatedShipppingCost}</Text>
                                            <Text style={[SLI.message, { textAlign: 'left' }]}>{'CA $'}{estimatedCost}</Text>

                                            <Text style={[SLI.message, SLI.boldText, { textAlign: 'left', marginBottom: 5, }]}>{keywords.newTotalAmount}</Text>
                                            <Text style={[SLI.message, { textAlign: 'left', }]}>{'CA $'}{(newTotalAmounts)}</Text>

                                        </>
                                    )}
                                    <Button text={keywords.update} onPress={handleUpdate} variant='main' style={SLI.updateButton} />
                                </View>
                            </View>
                        </>
                    }
                    <Wrapper>

                        <View style={SLI.listingContainer}>
                            <ListingItem itemData={{ image: listing?.image_url, name: listing?.listing_name, type: listing?.brand, size: listing?.size }}
                                selectedDates={listing?.purchaser_id ? [listing?.shipping_date || listing?.local_pickup_date, listing?.shipping_date || listing?.local_pickup_date] :
                                    [listing?.borrow_start, listing?.borrow_end]
                                } />
                        </View>
                        <View style={SLI.calculationContainer}>
                            {listing?.cp_id ?
                                <View>
                                    <H2 text={keywords.yourItemWillShipOn} />
                                    <Text style={SLI.value}>
                                        {formatDate(listing?.shipping_date || listing?.local_pickup_date || new Date())}
                                    </Text>
                                </View> : <View>
                                    <H2 text={keywords.meetUpOn} />
                                    <Text style={SLI.value}>
                                        {formatDate(listing?.shipping_date || listing?.local_pickup_date || new Date())}
                                    </Text>
                                </View>
                            }
                            <View>
                                <H2 text={listing?.cp_id ? keywords.buyMethod : keywords.borrowMethod} />
                                <Text style={SLI.value}>
                                    {borrowMethod}
                                </Text>
                            </View>
                        </View>
                        <View style={SLI.calculationContainer}>
                            <View>
                                <H2 text={keywords.totalAmount} />
                                <Text style={SLI.value}>{`CA $${totalAmounts}`}</Text>
                            </View>
                            {/* <View style={{ width: 90, }}>
                                <H2 text={keywords.borrow} />
                                <Text style={SLI.value}>
                                    {moment(new Date(listing?.shipping_date || listing?.local_pickup_date || null)).
                                        diff(moment(new Date(listing?.shipping_date || listing?.local_pickup_date || null)),
                                            'days') + 1} {keywords.days}
                                </Text>
                            </View> */}
                        </View>
                        <View>
                            <H2 text={keywords.seller} style={{ marginTop: 20 }} />
                            <TouchableOpacity style={SLI.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: seller.user_info.id })}>
                                <Image source={{ uri: seller?.user_info?.userAvatar || placeholderPicture }} style={SLI.userImage} />
                                <H2 text={seller?.user_info?.user_name} />
                            </TouchableOpacity>
                        </View>
                        {message && <View style={{ marginTop: 15 }}>
                            <H2 text='Reason for declining' />
                            <Text style={{ marginVertical: 8 }}>{message}</Text>
                        </View>
                        }
                        {(!update && updatedBorrowMethod === keywords.cancelOrder) ?
                            <View style={[SLI.buttonContainer, { height: 40 }]}>
                                <Button text={keywords.browseOtherListings} onPress={handleReturnHome} variant='main' />
                            </View> :
                            <View style={SLI.buttonContainer}>
                                <Button text={keywords.chatWithSeller} onPress={handleChat} variant='secondary' style={SLI.button} loading={loading} />
                                <View style={{ height: 20 }} />
                                <Button text={keywords.returnHome} onPress={handleReturnHome} variant='main' style={SLI.button} />
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
            <Toast config={toastConfig} />
        </View>
    )
}

export default SellerInfo