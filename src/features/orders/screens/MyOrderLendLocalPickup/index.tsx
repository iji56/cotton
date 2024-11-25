import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords, stepsToLendLocalPickLender } from '../../utils/keywords';
import SOLLP from './MyOrderLendLocalPickup.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import BottomSheets from '@/components/elements/BottomSheet';
import Button from '@/components/elements/Button/Button';
import { getUserData } from '../../api/getUserData';
import H1 from '@/components/elements/H1';
import moment from 'moment';
import { checkListingBorrowStatus } from '@/features/borrow/api/checkListingBorrowStatus';
import { NotificationContext } from '@/features/Listeners/listeners';

const MyOrderLendLocalPickup = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { setCurrentRoute } = useContext(NotificationContext);
    const currentUser = reduxSelect(state => state.usermeta.id);
    const orderId = route.params.orderID ?? null;
    const order = route.params.orderData ?? null;
    const listing = route.params.listingData ?? null;
    const lender = route.params.lender ?? null;
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const [borrower, setBorrower] = useState<any>({});
    const [pickupDate, setPickupDate] = useState<string | null>(null);
    const bottomSheetRef = useRef<any>();
    const [firstTime, setFirstTime] = useState(route?.params?.orderData?.is_first_lend)
    const totalAmount = route.params.orderData?.total_price ?? 0;
    let replacedFirst = false
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Mar")
        day: 'numeric', // Numeric day of the monthy
        year: 'numeric'
    });


    useEffect(() => {
        const getBorrowerDetail = async () => {
            const response = await getUserData(order?.borrower_id);
            setBorrower(response[0]);
        }

        getBorrowerDetail()
    }, [])

    useEffect(() => {
        const fetchListingStatus = async () => {
            const isItemAvailable = await checkListingBorrowStatus(order.listing_id);
            console.log("fasdf, ", isItemAvailable, order)
            if (isItemAvailable.length > 0) {
                setPickupDate(isItemAvailable[0]?.enum === 0 ?
                    moment(new Date(order?.borrow_start)).format("MMMM Do, YYYY") :
                    moment(new Date(isItemAvailable[0]?.borrow_end)).add(order?.cp_id ? 7 : 2, 'days').format("MMMM Do, YYYY"))
            }
        }
        fetchListingStatus();
    }, [order])

    useEffect(() => {
        const startDate = new Date(order?.borrow_start || null)
        const endDate = new Date(order?.borrow_end || null)
        const formattedStart = formatter.format(startDate)
        const formattedEnd = formatter.format(endDate)

        setStart(formattedStart)
        setEnd(formattedEnd)
        setTimeout(() => {
            setSnapPoint('90%');
            try {
                bottomSheetRef.current.snapToIndex(1)
            } catch (error) {
                console.log("Index out of index : ", error)
            }
        }, 500)
    }, [order])

    const handleNext = () => {
        setSnapPoint('90%');
        try {
            bottomSheetRef.current?.snapToIndex(1)
        } catch (error) {
            console.log("Index out of index : ", error)
        }
    }
    //   parse string with html bold tag then return simple and bold text with styles
    const parseText = (text: string) => {
        const time = replacedFirst ?
            moment(order?.borrow_end).format("MMMM DD") :
            moment(order?.borrow_start).format("MMMM D");
        const parts = text.replace("fixedDate", `<b>${time}</b>`).split(/(<b>.*?<\/b>)/g);
        if (text.includes("fixedDate")) {
            replacedFirst = !replacedFirst
        }

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
        <View style={SOLLP.lendStepsContainer}>
            <Text style={SOLLP.lendStepNumber}>{index + 1}</Text>
            <Text style={SOLLP.lendStep}>{parseText(item.step)}</Text>
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
                <Image source={require('../../components/assets/check.png')} style={SOLLP.checkIcon} />
                <View style={SOLLP.requestSent}>
                    <H1 text={keywords.orderConfirmed} />
                </View>
            </> */}
            <ScrollView contentContainerStyle={SOLLP.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SOLLP.infoCard}>
                    <View style={SOLLP.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url,
                            name: listing?.listing_name,
                            type: listing?.brand,
                            size: listing?.size
                        }} />
                    </View>
                    <View style={SOLLP.infoContainer}>
                        <View style={SOLLP.infoRow}>
                            <H2 text={keywords.startDate} />
                            <Text style={SOLLP.text}>{start}</Text>
                        </View >
                        <View style={SOLLP.infoRow}>
                            <H2 text={keywords.endDate} />
                            <Text style={SOLLP.text}>{end}</Text>
                        </View>
                    </View>
                    <View style={SOLLP.infoContainer}>
                        <View style={SOLLP.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOLLP.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                        <View style={SOLLP.infoRow}>
                            <H2 text={keywords.borrowPeiod} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOLLP.text}>{moment(new Date(order.borrow_end)).
                                diff(moment(new Date(order.borrow_start)),
                                    'days') + 1} {keywords.days}</Text>
                        </View>
                    </View>
                    <H2 text={keywords.borrower} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOLLP.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: borrower.user_info.id })}>
                        <Image source={{ uri: borrower?.user_info?.userAvatar || picture }} style={SOLLP.userImage} />
                        <Text style={SOLLP.username}>{borrower?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                </View>
                <View style={SOLLP.bottom}>
                    <View style={SOLLP.line}>
                        <H2 text={keywords.whatIneedToDo} />
                    </View>
                    <TouchableOpacity onPress={handleNext} style={SOLLP.iconContainer}>
                        <Text style={SOLLP.bottomText}>{keywords.nextSteps}</Text>
                        <TouchableOpacity style={SOLLP.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={SOLLP.bottom}>
                    <View style={SOLLP.line}>
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
                        style={SOLLP.iconContainer}>
                        <Text style={SOLLP.bottomText}>{keywords.contactSupport}</Text>
                        <TouchableOpacity style={SOLLP.iconButton}>
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
                        style={SOLLP.iconContainer}>
                        <Text style={SOLLP.bottomText}>{keywords.faqs}</Text>
                        <TouchableOpacity style={SOLLP.iconButton}>
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
                {/* <H2 text={firstTime ? keywords.firstLendCongratulationMessage.replace(" on ", " on first ") : keywords.firstLendCongratulationMessage} style={SOLLP.congratulationMessage} /> */}
                <H2 text={keywords.firstLendCongratulationMessage} style={SOLLP.congratulationMessage} />
                <FlatList
                    data={stepsToLendLocalPickLender}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false} />
                <View style={SOLLP.button}>
                    <Button text={keywords.gotIt} onPress={() => setSnapPoint(1)} variant='main' />
                </View>
            </BottomSheets>
        </View>
    )
}

export default MyOrderLendLocalPickup