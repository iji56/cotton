import { ActivityIndicator, FlatList, Image, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords } from '../../utils/keywords';
import Wrapper from '@/components/Wrapper';
import SBI from './BorrowerInfo.styles';
import H2 from '@/components/elements/H2';
import H3 from '@/components/elements/H3';
import ListingItem from '../../components/ListingItem';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUserData } from '../../api/getUserData';
import Avatar from '@/components/elements/Avatar';
import TextField from '@/components/elements/Forms/TextField';
import PostCard from '../../components/PostCard';
import { getUserListing } from '../../api/getUserListing';
import BottomSheets from "@/components/elements/BottomSheet";
import H1 from "@/components/elements/H1";
import Button from "@/components/elements/Button/Button";
import { updateLenderAddress } from '../../api/updateLenderAddress';
import Geocoder from 'react-native-geocoding';
import { getListingAddress } from '../../api/getListingAddress';
import { cancelOrder } from '../../api/cancelOrder';
import { getBorrowListingData } from '../../api/getBorrowListingData';
import { createShipment, createShipmentPayloadSample } from '../../api/createShipment';
import { getUsermeta } from '@/features/auth/api/getUsermeta';
import { changeListingBorrowStatus } from '../../api/changeListingBorrowStatus';
import { confirmPaymentIntent } from '../../api/confirmPaymentIntent';
import { updateListingBorrowStatus } from '../../api/updateListingBorrowStatus';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { getDefaultAddress } from '@/features/addresses/api/getDefaultAddress';
import ListingAddress from '@/features/addListing/components/ListingAddress';
import { createChatAndNavigate } from '@/features/profile/api/createChat';
import moment from 'moment';
import { sendOnAcceptBorrowLocalPickupEmails, sendOnAcceptBorrowShippingEmails, sendOnAcceptBuyLocalPickupEmails } from '../../api/sendOrderEmails';
import { getShipmentArtifect } from '../../api/getArtifect';

const BorrowerInfo = ({ route }: any) => {
    const borrowerId = route.params?.purchaserId;
    const toggleModal = route.params?.toggle;
    console.log("borrowerId id : ", borrowerId)
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const user = reduxSelect(state => state.usermeta);
    const [borrower, setBorrower] = useState<any>({});
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [note, setNote] = useState('');
    const [listings, setListings] = useState([]);
    const [listing, setListing] = useState<any>({});
    const [address, setAddress] = useState({ address: "", addressId: "" });
    const [confirmAddressSnapPoint, setConfirmAddressSnapPoint] = useState<string | number>(1);
    const [updateAddressSnapPoint, setUpdateAddressSnapPoint] = useState<string | number>('1%');
    const [addressUpdatedSnapPoint, setAddressUpdatedSnapPoint] = useState<string | number>('1%');
    const [keyboardVisible, setKeyboardVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const confirmAddressRef = useRef<any>();
    const updateAddressRef = useRef<any>();
    const addressUpdatedRef = useRef<any>();
    const [addressUpdated, setAddressUpdated] = useState(false);
    const [senderAddress, setSenderAddress] = useState({ name: "", address: "", city: "", province: "", countryCode: '', postalCode: "" });
    const [destinationAddress, setDestinationAddress] = useState({ name: "", address: "", city: "", province: "", countryCode: '', postalCode: "", email: "" });
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';
    let numOfDays = 4;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    }, []);

    useEffect(() => {
        getBorrowerDetail()
    }, [])

    const getBorrowerDetail = async () => {
        try {
            setIsLoading(true)
            let listingDetail = await getBorrowListingData(borrowerId);
            console.log(" listing detail : ", listingDetail)
            setListing(listingDetail)
            setAddressUpdated((!listingDetail?.is_address_approved_by_borrower && listingDetail?.is_address_updated_by_lender) || false);

            const receiverDetail = borrowerId && await getUsermeta(listingDetail?.borrower_id);
            let destinationAddress = await getDefaultAddress(listingDetail?.borrower_id)
            if (destinationAddress && destinationAddress.length > 0) {
                let addresses = destinationAddress[0].address.split('#')[0].split(',');
                setDestinationAddress({
                    name: `${receiverDetail.first_name} ${receiverDetail.last_name || ''}`,
                    address: addresses[0],
                    city: addresses[addresses.length - 3] || '',
                    province: addresses[addresses.length - 2],
                    countryCode: addresses[addresses.length - 1],
                    postalCode: destinationAddress[0].postal_code,
                    email: receiverDetail.email
                })
            }

            const listingAddress = await getListingAddress(listingDetail.address_id);

            let addresses = listingAddress[0].address.split('#')[0].split(',');
            setSenderAddress({
                name: `${user.first_name!} ${user.last_name || ''}`,
                address: addresses[0],
                city: addresses[addresses.length - 3] || '',
                province: addresses[addresses.length - 2],
                countryCode: addresses[addresses.length - 1],
                postalCode: listingAddress[0].postal_code
            })

            setAddress({
                address: listingAddress[0]?.address?.split("#")[0] || '' + listingAddress[0]?.address?.split("#")[1] || '' + listingAddress[0]?.address?.split("#")[2] || '',
                addressId: ''
            })
            const response = await getUserData(listingDetail.borrower_id);
            setBorrower(response[0]);
            const userListings = await getUserListing(listingDetail.borrower_id);
            setListings(userListings)
            setIsLoading(false)
            if (listingDetail?.status !== keywords.status.inProgress) {
                const snapPoint = (!listingDetail?.is_address_approved_by_borrower && listingDetail?.is_address_updated_by_lender) ? 1 : '35%';
                setConfirmAddressSnapPoint(snapPoint);
                if (snapPoint !== 1) {
                    setTimeout(() => {
                        try {
                            confirmAddressRef.current.snapToIndex(1)
                        } catch (error) {
                            console.log("Index out of index : ", error)
                        }
                    }, 500)
                }
            }
        } catch (error) {
            setIsLoading(false)
        }
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long', // Abbreviated month name (e.g., "Mar")
        day: 'numeric' // Numeric day of the month
    });

    useEffect(() => {
        const startDate = new Date(listing?.borrow_start || null)
        const endDate = new Date(listing?.borrow_end || null)
        const formattedStart = formatter.format(startDate)
        const formattedEnd = formatter.format(endDate)
        numOfDays = (moment(listing?.borrow_end).diff(listing?.borrow_start, 'days') + 1) || 4;
        setStart(formattedStart)
        setEnd(formattedEnd)
    }, [listing])

    const handleAccept = async () => {
        try {
            setIsLoading(true)
            if (listing?.cp_id) {
                if (senderAddress.postalCode && destinationAddress.postalCode) {
                    await confirmPaymentIntent(listing?.payment_client_secret, listing.payment_method_id).then(() => {
                        createShipment(createShipmentPayloadSample.shippingPoint, senderAddress, destinationAddress, createShipmentPayloadSample.parcel).then((response) => {
                            if (response?.error || response?.status === false || response?.response?.error || response?.response?.status === false) {
                                setIsLoading(false);
                                errorToast(response.error || response?.response?.error)
                            } else {
                                createShipment(createShipmentPayloadSample.shippingPoint, destinationAddress, { ...senderAddress, email: destinationAddress.email }, createShipmentPayloadSample.parcel).then(async (returnResponse) => {
                                    if (response?.error || response?.status === false || response?.response?.error || response?.response?.status === false) {
                                        setIsLoading(false);
                                        errorToast(response.error || response?.response?.error)
                                    } else {
                                        const shipmentDetail = [response?.response, returnResponse?.response];
                                        if (shipmentDetail?.length > 0) {
                                            console.log("response?.response", response?.response)
                                            const shippingArtifact = await getShipmentArtifect({shippingId: response?.response.labelId})
                                            await sendOnAcceptBorrowShippingEmails( listing,
                                                user,
                                                borrower.user_info, 
                                                keywords.shipping,
                                                shippingArtifact
                                                )
                                            changeListingBorrowStatus(listing.id, listing?.borrower_id, shipmentDetail).then(async () => {
                                                // send message
                                                console.log("sending meesasges")
                                                await createChatAndNavigate(user.id!, borrower.user_info.id, borrower.user_info.user_name, navigation, note || "undefined");

                                                navigation.goBack();
                                                setIsLoading(false);
                                            }).catch((error) => {
                                                setIsLoading(false)
                                                console.log("Error accepting borrow request : ", error)
                                            });
                                        } else {
                                            setIsLoading(false);
                                        }
                                    }
                                }).catch(() => setIsLoading(false));
                            }
                        }).catch(() => setIsLoading(false))
                    }).catch(() => setIsLoading(false))
                } else {
                    setIsLoading(false);
                    errorToast(keywords.noPostalCode)
                }
            } else {
                await confirmPaymentIntent(listing?.payment_client_secret, listing.payment_method_id).then(() => {
                    updateListingBorrowStatus(listing.id, listing.borrower_id).then(async () => {

                        await sendOnAcceptBorrowLocalPickupEmails( listing,
                            user,
                            borrower.user_info, keywords.localPickup
                            )
                        // send message
                        console.log("sending meesasges")
                        await createChatAndNavigate(user.id!, borrower.user_info.id, borrower.user_info.user_name, navigation, note || "undefined");

                        navigation.goBack();
                        setIsLoading(false);
                    }).catch((error) => {
                        setIsLoading(false)
                        console.log("Error accepting borrow request : ", error)
                    });
                }).catch(() => setIsLoading(false))
            }
        } catch (error) {
            setIsLoading(false)
        }
    }

    const handleDeny = () => {
        cancelOrder(listing.id, 0, listing.borrower_id).then(async () => {
            await createChatAndNavigate(user.id!, borrower.user_info.id, borrower.user_info.user_name, navigation, note || "undefined");
            navigation.goBack();
        }).catch(error => {
            console.log("Error denying request : ", error);
            navigation.goBack()
        })
    }

    const renderItem = ({ item }: any) => <PostCard listing={item.listing_record} />

    const updateAddress = async () => {
        const addressDetail = await getListingAddress(address.addressId)
        let location: Geocoder.LatLng;
        const response = await Geocoder.from(addressDetail[0].address.split("#")[0] || '');
        location = response?.results[0].geometry?.location || null;

        setAddressUpdated(true)
        await updateLenderAddress(addressDetail[0]?.address, location?.lat || 0, location?.lng || 0, user.id!, listing.listing_id, listing.id, listing.borrower_id, addressDetail[0].postal_code);
    }

    const handleChat = async () => {
        setLoading(true)
        await createChatAndNavigate(user.id!, borrower.user_info.id, borrower.user_info.user_name, navigation);
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

    console.log("listing : ", listing)

    return (
        <>{!isLoading ?
            <View style={{
                flex: 1,
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white
            }}>
                <OrdersHeader headerTitle={listing?.listing_name} redirect={'OrdersMain'} />

                {listing?.is_address_updated_by_lender && listing?.is_address_approved_by_borrower ?
                    <>
                        <Image source={require('../../components/assets/check.png')} style={SBI.checkIcon} />
                        <View style={SBI.requestSent}>
                            <H1 text={keywords.orderUpdated} />
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
                {/* <Text style={SBI.infoText}>
                    {keywords.requestExpireInfo}
                </Text> */}
                <Wrapper>
                    <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
                        <H2 text={keywords.borrowerInfo} style={SBI.title} />
                        <TouchableOpacity style={SBI.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: borrower.user_info.id })}>
                            <Image source={{ uri: borrower?.user_info?.userAvatar || picture }} style={SBI.userImage} />
                            <View style={SBI.usernameContainer}>
                                <H2 text={borrower?.user_info?.user_name} />
                                <H3 text={`${borrower?.user_info?.city} ${borrower?.user_info?.country ?? ''}`} />
                            </View>
                        </TouchableOpacity>
                        {/* <Text style={SBI.distanceText}>{distance}{keywords.awayMessage}</Text>
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
                        </View> */}
                        <View style={SBI.listingContainer}>
                            <ListingItem itemData={{ image: listing?.image_url, name: listing?.listing_name, type: listing?.brand, size: listing?.size }}
                                selectedDates={[listing?.borrow_start, listing?.borrow_end]} />
                        </View>

                        <H2 text={keywords.borrowDate} style={SBI.subHeading} />
                        <Text style={SBI.text}>{start} - {end}</Text>

                        <H2 text={keywords.borrowMethod} style={SBI.subHeading} />
                        <Text style={SBI.text}>{!listing?.cp_id ? keywords.localPickup : keywords.shipping}</Text>

                        <H2 text={keywords.yourAddress} style={SBI.subHeading} />
                        <Text style={[SBI.text, { width: '98%' }]}>{address?.address?.split("#")[0] || 'address'}</Text>
                        <Text style={SBI.linkText} onPress={() => {
                            updateAddressRef.current?.snapToIndex(1);
                            setUpdateAddressSnapPoint('70%');
                        }}>{keywords.updateAddress}</Text>

                        <H2 text={keywords.earnings} style={SBI.subHeading} />
                        <Text style={[SBI.text, { marginBottom: 5 }]}>{'CA $'}{(listing?.price_borrow * 0.8)?.toFixed(2) ?? 0}</Text>
                        {listing?.message &&
                            <View style={SBI.userSmallContainer}>
                                <View>
                                    <H2 text={keywords.messageFromBorrower} />
                                    <Text style={SBI.message}>{listing?.message}</Text>
                                    <Button text={keywords.reply} onPress={handleChat} variant='main' style={{ width: 80 }} />
                                </View>
                            </View>
                        }
                        <TouchableOpacity style={[SBI.userSmallContainer, { marginTop: 0 }]} onPress={() => navigation.navigate('FeedProfile', { userID: borrower.user_info.id })}>
                            <Avatar size='s' avatar={borrower?.user_info?.userAvatar || picture} />
                            <H2 text={borrower?.user_info?.user_name} style={SBI.username} />
                        </TouchableOpacity>

                        <TextField value={note} onChangeText={(note) => setNote(note)} placeholder={keywords.leaveNotePlaceholder} style={SBI.input} multiline autoCapitalize='none' />
                        <Text style={SBI.note}>{keywords.note} <Text style={SBI.noteText}>{keywords.noteMessageYourMessageWillBeSent}</Text></Text>
                        <View style={SBI.listingsContainer}>
                            <H2 text={`${keywords.lstingFrom} ${borrower?.user_info?.user_name}`} />
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
                    {addressUpdated ?
                        <View style={SBI.disableButtonContainer}>
                            <Button text={keywords.waitingForBorrowerToReview} onPress={() => { }} variant='secondary' style={SBI.disableButton} buttonTextColor={palette.white} fontSize={14} />
                        </View> :
                        listing?.status === keywords.status.inProgress ?
                            <>
                                <View style={SBI.buttonContainer}>
                                    <Button text={keywords.chatWithSeller} onPress={handleChat} variant='secondary' style={SBI.bottomButtons} loading={loading} />
                                    <View style={{ height: 10 }} />
                                    <Button text={keywords.returnHome} onPress={handleReturnHome} variant='main' style={SBI.bottomButtons} />
                                </View>
                            </> :
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
                <BottomSheets snapPoint={confirmAddressSnapPoint} setSnapPoint={setConfirmAddressSnapPoint} bottomSheetRef={confirmAddressRef} handleSheetChanges={(index: number) => { }}>
                    <View style={SBI.bottomSheetContainer}>
                        <H1 text={keywords.confirmAdress} style={SBI.bottomSheetTitle} />
                        <View style={SBI.bottomSheetHeader}>
                            <Text style={SBI.bottomSheetText}>{keywords.yourCurrentAddress}
                                <Text style={SBI.boldText}>{address?.address?.split("#")[0] || 'address'}</Text>
                            </Text>
                        </View>
                        <View style={SBI.bottomSheetButtonContainer}>
                            <Button text={keywords.updateAddress} onPress={() => {
                                setConfirmAddressSnapPoint('1%');
                                setUpdateAddressSnapPoint('70%')
                                updateAddressRef.current?.snapToIndex(1)
                            }} variant="secondary" style={SBI.grayButton} buttonTextColor={palette.black} fontSize={14} />
                            <View style={SBI.space} />
                            <Button text={keywords.looksGood} onPress={() => setConfirmAddressSnapPoint('1%')} variant="main" />
                        </View>
                    </View>
                </BottomSheets>
                <BottomSheets snapPoint={updateAddressSnapPoint} setSnapPoint={setUpdateAddressSnapPoint} bottomSheetRef={updateAddressRef} handleSheetChanges={(index: number) => { }}>
                    <View style={SBI.bottomSheetContainer}>
                        {/* <H1 text={keywords.updateAddress} style={SBI.bottomSheetTitle} /> */}
                        <ListingAddress address={address} setAddress={setAddress} />
                        {/* <View style={SBI.bottomSheetHeader}>
                            <AddressesSearchBar onPress={onPress} addressRef={addressRef} containerStyle={{ marginHorizontal: 0 }} />
                        </View> */}
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
                    <Toast config={toastConfig} />
                </BottomSheets>
                <BottomSheets snapPoint={addressUpdatedSnapPoint} setSnapPoint={setAddressUpdatedSnapPoint} bottomSheetRef={addressUpdatedRef} handleSheetChanges={(index: number) => { }}>
                    <View style={SBI.bottomSheetContainer}>
                        <H1 text={keywords.addressUpdated} style={SBI.bottomSheetTitle} />
                        <View style={SBI.bottomSheetHeader}>
                            <Text style={SBI.bottomSheetText}>{keywords.yourUpdatedAddress}
                                <Text style={SBI.boldText}>{address?.address?.split("#")[0]}</Text>
                            </Text>
                        </View>
                        <View style={SBI.bottomSheetButtonContainer}>
                            <Button text={keywords.updateAddress} onPress={() => {
                                setAddressUpdatedSnapPoint('1%');
                                setUpdateAddressSnapPoint('70%')
                            }} variant="secondary" style={SBI.grayButton} buttonTextColor={palette.black} fontSize={14} />
                            <View style={SBI.space} />
                            <Button text={keywords.looksGood} onPress={() => setAddressUpdatedSnapPoint('1%')} variant="main" />
                        </View>
                    </View>
                </BottomSheets>
            </View > :
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size={'large'} color={palette.darkBlue} />
            </View>
        }</>
    )
}

export default BorrowerInfo