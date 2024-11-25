import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords, stepsToBorrowLocalPickLender } from '../../utils/keywords';
import SOBLP from './MyOrderBorrowLocalPickup.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import BottomSheets from '@/components/elements/BottomSheet';
import Button from '@/components/elements/Button/Button';
import { getUserData } from '../../api/getUserData';
import H1 from '@/components/elements/H1';
import moment from 'moment';
import { NotificationContext } from '@/features/Listeners/listeners';

const MyOrderBorrowLocalPickup = ({ route, navigation }: any) => {
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
    const [lenderDetail, setLenderDetail] = useState<any>({});
    const [extendedDate, setExtendedDate] = useState<string | null>(null);
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
        const getLenderDetailDetail = async () => {
            const response = await getUserData(order?.lender_id);
            setLenderDetail(response[0]);
        }

        getLenderDetailDetail()
    }, [])

    useEffect(() => {
        const startDate = new Date(order?.borrow_start || null)
        const endDate = new Date(order?.borrow_end || null)
        const formattedStart = formatter.format(startDate)
        const formattedEnd = formatter.format(endDate)
        setExtendedDate(moment(new Date(startDate!)).add(order?.cp_id ? 7 : 2, 'days').format("MMMM Do, YYYY"))

        setStart(formattedStart)
        setEnd(formattedEnd)
        setTimeout(() => {
            setSnapPoint('70%');
            try {
                bottomSheetRef.current.snapToIndex(1)
            } catch (error) {
                console.log("Index out of index : ", error)
            }
        }, 500)
    }, [order])

    const handleNext = () => {
        setSnapPoint('70%');
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
        <View style={SOBLP.lendStepsContainer}>
            <Text style={SOBLP.lendStepNumber}>{index + 1}</Text>
            <Text style={SOBLP.lendStep}>{parseText(item.step)}</Text>
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
                <Image source={require('../../components/assets/check.png')} style={SOBLP.checkIcon} />
                <View style={SOBLP.requestSent}>
                    <H1 text={keywords.orderConfirmed} />
                </View>
            </> */}
            <ScrollView contentContainerStyle={SOBLP.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SOBLP.infoCard}>
                    <View style={SOBLP.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url || picture,
                            name: listing?.listing_name,
                            type: listing?.brand,
                            size: listing?.size
                        }} />
                    </View>
                    <View style={SOBLP.infoContainer}>
                        <View style={SOBLP.infoRow}>
                            <H2 text={keywords.startDate} />
                            <Text style={SOBLP.text}>{start}</Text>
                        </View >
                        <View style={SOBLP.infoRow}>
                            <H2 text={keywords.endDate} />
                            <Text style={SOBLP.text}>{end}</Text>
                        </View>
                    </View>
                    <View style={SOBLP.infoContainer}>
                        <View style={SOBLP.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOBLP.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                        <View style={SOBLP.infoRow}>
                            <H2 text={keywords.borrowPeiod} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOBLP.text}>{moment(new Date(order.borrow_end)).
                                diff(moment(new Date(order.borrow_start)),
                                    'days') + 1} {keywords.days}</Text>
                        </View>
                    </View>
                    <H2 text={keywords.lender} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOBLP.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: lenderDetail.user_info.id })}>
                        <Image source={{ uri: lenderDetail?.user_info?.userAvatar || picture }} style={SOBLP.userImage} />
                        <Text style={SOBLP.username}>{lenderDetail?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                </View>
                <View style={SOBLP.bottom}>
                    <View style={SOBLP.line}>
                        <H2 text={keywords.whatIneedToDo} />
                    </View>
                    <TouchableOpacity onPress={handleNext} style={SOBLP.iconContainer}>
                        <Text style={SOBLP.bottomText}>{keywords.nextSteps}</Text>
                        <TouchableOpacity style={SOBLP.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={SOBLP.bottom}>
                    <View style={SOBLP.line}>
                        <H2 text={keywords.needHelpWithItem} />
                    </View>
                    {/* <TouchableOpacity onPress={() => { }} style={SOBLP.iconContainer}>
                        <Text style={SOBLP.bottomText}>{keywords.cancelBorrow}</Text>
                        <TouchableOpacity style={SOBLP.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => {
                        setCurrentRoute("Orders")
                        navigation.navigate('Profile', {
                            screen: 'SettingsNav',
                            params: {
                                screen: 'SettingsSupport'
                            }
                        })
                    }}
                        style={SOBLP.iconContainer}>
                        <Text style={SOBLP.bottomText}>{keywords.contactSupport}</Text>
                        <TouchableOpacity style={SOBLP.iconButton}>
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
                        style={SOBLP.iconContainer}>
                        <Text style={SOBLP.bottomText}>{keywords.faqs}</Text>
                        <TouchableOpacity style={SOBLP.iconButton}>
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
                {/* <H2 text={firstTime ? keywords.firstBorrowCongratulationMessage.replace(" on ", " on first ") : keywords.firstBorrowCongratulationMessage} style={SOBLP.congratulationMessage} /> */}
                <H2 text={keywords.firstBorrowCongratulationMessage} style={SOBLP.congratulationMessage} />
                <FlatList
                    data={stepsToBorrowLocalPickLender}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
                <View style={SOBLP.button}>
                    <Button text={keywords.gotIt} onPress={() => setSnapPoint(1)} variant='main' />
                </View>
            </BottomSheets>
        </View>
    )
}

export default MyOrderBorrowLocalPickup