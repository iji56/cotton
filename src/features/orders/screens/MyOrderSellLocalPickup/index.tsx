import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords, stepsToLendLocalPickLender, stepsToSellThroughLocalPickup } from '../../utils/keywords';
import SOSLP from './MyOrderSellLocalPickup.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import BottomSheets from '@/components/elements/BottomSheet';
import Button from '@/components/elements/Button/Button';
import { getUserData } from '../../api/getUserData';
import H1 from '@/components/elements/H1';
import { checkListingBorrowStatus } from '@/features/borrow/api/checkListingBorrowStatus';
import moment from 'moment';
import { NotificationContext } from '@/features/Listeners/listeners';

const MyOrderSellLocalPickup = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { setCurrentRoute } = useContext(NotificationContext);
    const currentUser = reduxSelect(state => state.usermeta.id);
    const orderId = route.params.orderID ?? null;
    const order = route.params.orderData ?? null;
    const listing = route.params.listingData ?? null;
    const lender = route.params.lender ?? null;
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';
    const [start, setStart] = useState('')
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const [shippingDate, setShippingDate] = useState<string | null>(null);
    const [buyer, setBuyer] = useState<any>({});
    const bottomSheetRef = useRef<any>();
    const totalAmount = route.params.orderData?.total_price ?? 0;

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Mar")
        day: 'numeric', // Numeric day of the monthy
        year: 'numeric'
    });


    useEffect(() => {
        const getBuyerDetail = async () => {
            const response = await getUserData(order?.purchaser_id);
            setBuyer(response[0]);
        }

        getBuyerDetail()
    }, [])

    useEffect(() => {
        const fetchListingStatus = async () => {
            const isItemAvailable = await checkListingBorrowStatus(order.listing_id);
            if (isItemAvailable.length > 0) {
                setShippingDate(isItemAvailable[0]?.enum === 0 ?
                    moment(new Date(order?.shipping_date)).format("MMMM Do, YYYY") :
                    moment(new Date(isItemAvailable[0]?.borrow_end)).add(order?.cp_id ? 7 : 2, 'days').format("MMMM Do, YYYY"))
            }
        }
        fetchListingStatus();
    }, [order])

    useEffect(() => {
        const startDate = new Date(order?.shipping_date || order.local_pickup_date)
        const formattedStart = formatter.format(startDate)
        console.log("order detail sell local : ", order)
        setStart(formattedStart)

        setTimeout(() => {
            setSnapPoint('80%');
            try {
                bottomSheetRef.current.snapToIndex(1)
            } catch (error) {
                console.log("Index out of index : ", error)
            }
        }, 500)
    }, [order])

    const handleNext = () => {
        setSnapPoint('80%');
        try {
            bottomSheetRef.current?.snapToIndex(1)
        } catch (error) {
            console.log("Index out of index : ", error)
        }
    }
    //   parse string with html bold tag then return simple and bold text with styles
    const parseText = (text: string) => {
        const parts = text.replace("fixedDate", `<b>${moment(order?.shipping_date || order.local_pickup_date).format("MMMM D")}</b>`).split(/(<b>.*?<\/b>)/g);
        return parts.map((part, index) => part.startsWith('<b>') && part.endsWith('</b>') ?
            (
                <Text key={index} style={{ fontWeight: 'bold' }}>
                    {part.replace(/<\/?b>/g, '')}
                </Text>
            ) : (
                <Text key={index}>
                    {part}
                </Text>
            )
        );
    };

    const renderItem = ({ item, index }: { item: { step: string }, index: number }) => (
        <View style={SOSLP.lendStepsContainer}>
            <Text style={SOSLP.lendStepNumber}>{index + 1}</Text>
            <Text style={SOSLP.lendStep}>{parseText(item.step)}</Text>
        </View>
    )

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <OrdersHeader headerTitle={listing?.listing_name || ''} redirect={'OrdersMain'} />
            {/* <>
                <Image source={require('../../components/assets/check.png')} style={SOSLP.checkIcon} />
                <View style={SOSLP.requestSent}>
                    <H1 text={keywords.orderConfirmed} />
                </View>
            </> */}
            <ScrollView contentContainerStyle={SOSLP.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SOSLP.infoCard}>
                    <View style={SOSLP.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url,
                            name: listing?.listing_name,
                            type: listing?.brand,
                            size: listing?.size
                        }} />
                    </View>
                    <View style={SOSLP.infoContainer}>
                        <View style={SOSLP.infoRow}>
                            <H2 text={keywords.meetUpDate} />
                            <Text style={SOSLP.text}>{start}</Text>
                        </View >
                    </View>
                    <View style={SOSLP.infoContainer}>
                        <View style={SOSLP.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            <Text style={SOSLP.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                    </View>
                    <H2 text={keywords.buyer} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOSLP.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: buyer.user_info.id })}>
                        <Image source={{ uri: buyer?.user_info?.userAvatar || picture }} style={SOSLP.userImage} />
                        <Text style={SOSLP.username}>{buyer?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                </View>
                <View style={SOSLP.bottom}>
                    <View style={SOSLP.line}>
                        <H2 text={keywords.whatIneedToDo} />
                    </View>
                    <TouchableOpacity onPress={handleNext} style={SOSLP.iconContainer}>
                        <Text style={SOSLP.bottomText}>{keywords.nextSteps}</Text>
                        <TouchableOpacity style={SOSLP.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={SOSLP.bottom}>
                    <View style={SOSLP.line}>
                        <H2 text={keywords.needHelpWithItem} />
                    </View>
                    <TouchableOpacity onPress={() => {
                        setCurrentRoute("Orders")
                        navigation.navigate('Profile', {
                            screen: 'SettingsNav',
                            params: {
                                screen: 'SettingsSupport'
                            }
                        })
                    }}
                        style={SOSLP.iconContainer}>
                        <Text style={SOSLP.bottomText}>{keywords.contactSupport}</Text>
                        <TouchableOpacity style={SOSLP.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setCurrentRoute("Orders")
                        navigation.navigate('Profile', {
                            screen: 'SettingsNav',
                            params: {
                                screen: 'SettingsFAQs'
                            }
                        })
                    }}
                        style={SOSLP.iconContainer}>
                        <Text style={SOSLP.bottomText}>{keywords.faqs}</Text>
                        <TouchableOpacity style={SOSLP.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomSheets bottomSheetRef={bottomSheetRef} handleSheetChanges={(index: number) => {
                if (index > 0) {
                    setSnapPoint(index);
                } else {
                    setSnapPoint(1);
                }
            }}
                snapPoint={snapPoint}
                setSnapPoint={setSnapPoint}>
                <H2 text={keywords.firstSellCongraulationMessage} style={SOSLP.congratulationMessage} />
                <FlatList
                    data={stepsToSellThroughLocalPickup}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false} />
                <View style={SOSLP.button}>
                    <Button text={keywords.gotIt} onPress={() => setSnapPoint(1)} variant='main' />
                </View>
            </BottomSheets>
        </View>
    )
}

export default MyOrderSellLocalPickup