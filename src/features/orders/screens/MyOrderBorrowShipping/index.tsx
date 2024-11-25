import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords, stepsToBorrowShipping, stepsToLendShipping } from '../../utils/keywords';
import SOBS from './MyOrderBorrowShipping.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import BottomSheets from '@/components/elements/BottomSheet';
import Button from '@/components/elements/Button/Button';
import { getUserData } from '../../api/getUserData';
import moment from 'moment';
import { checkListingBorrowStatus } from '@/features/borrow/api/checkListingBorrowStatus';
import { getShipmentArtifect } from '../../api/getArtifect';
import { NotificationContext } from '@/features/Listeners/listeners';
import PdfViewer from '../../components/pdfViewer';

const MyOrderBorrowShipping = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { setCurrentRoute, setModalVisible, setFilePath } = useContext(NotificationContext)
    const order = route.params.orderData ?? null;
    const listing = route.params.listingData ?? null;
    let picture = 'https://placecage.vercel.app/placecage/g/200/300';
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [pickupDate, setPickupDate] = useState<string | null>(null);
    const [snapPoint, setSnapPoint] = useState<number | string>(1);
    const bottomSheetRef = useRef<any>();
    const [firstTime, setFirstTime] = useState(route?.params?.orderData?.is_first_lend)
    const [seller, setSeller] = useState<any>({});
    const totalAmount = route.params.orderData?.total_price ?? 0
    console.log(order)
    const trackingNum1 = order?.one_shipment_label_id || "4363452345345234fgwer";
    const trackingNum2 = order?.two_shipment_label_id || "4363452345345234fgwer";
    let replacedFirst = false

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Mar")
        day: 'numeric', // Numeric day of the monthy
        year: 'numeric'
    });
    console.log(order)
    useEffect(() => {
        const getBorrowerDetail = async () => {
            const response = await getUserData(order?.lender_id);
            setSeller(response[0]);
        }

        getBorrowerDetail()
    }, [])

    useEffect(() => {
        const fetchListingStatus = async () => {
            const isItemAvailable = await checkListingBorrowStatus(order.listing_id);
            if (isItemAvailable.length > 0) {
                setPickupDate(
                    // isItemAvailable[0]?.enum === 0 ?
                    // moment(new Date(order?.borrow_start)).format("MMMM Do, YYYY") :
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
            setSnapPoint('70%');
            try {
                bottomSheetRef.current.snapToIndex(1)
            } catch (error) {
                console.log("Index out of index : ", error)
            }
        }, 500)
    }, [order])

    const copyToClipboard = (trackingNum: string) => {
        Clipboard.setString(trackingNum)
        navigation.navigate("ShippingDetail", { trackingNum })

    };

    const showShippingLabel = async (trackingNum: string) => {
        const filePath = await getShipmentArtifect({ shippingId: trackingNum });
        if (filePath && filePath.endsWith('pdf')) {
            console.log("showing modal")
            setFilePath(filePath)
            setModalVisible(true)
        }
    }

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
        console.log(text)
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
        <View style={SOBS.lendStepsContainer}>
            <Text style={SOBS.lendStepNumber}>{index + 1}</Text>
            <Text style={SOBS.lendStep}>{parseText(item.step)}</Text>
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
            <ScrollView contentContainerStyle={SOBS.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SOBS.infoCard}>
                    <View style={SOBS.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url,
                            name: listing?.listing_name,
                            type: listing?.brand,
                            size: listing?.size
                        }} />
                    </View>
                    <View style={SOBS.infoContainer}>
                        <View style={SOBS.infoRow}>
                            <H2 text={keywords.startDate} />
                            <Text style={SOBS.text}>{start}</Text>
                        </View >
                        <View style={SOBS.infoRow}>
                            <H2 text={keywords.endDate} />
                            <Text style={SOBS.text}>{end}</Text>
                        </View>
                    </View>
                    <View style={SOBS.infoContainer}>
                        <View style={SOBS.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOBS.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                        <View style={SOBS.infoRow}>
                            <H2 text={keywords.borrowPeiod} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOBS.text}>{moment(new Date(order.borrow_end)).
                                diff(moment(new Date(order.borrow_start)),
                                    'days') + 1} {keywords.days}</Text>
                        </View>
                    </View>


                    <H2 text={keywords.lender} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOBS.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: seller.user_info.id })}>
                        <Image source={{ uri: seller?.user_info?.userAvatar || picture }} style={SOBS.userImage} />
                        <Text style={SOBS.username}>{seller?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                    <H2 text={keywords.trackingNumber} />
                    <TouchableOpacity style={SOBS.copyContentContainer} onPress={() => copyToClipboard(trackingNum1)}>
                        <Text style={SOBS.copyText}>{trackingNum1}</Text>
                        <View>
                            <FontAwesomeIcon icon={faCopy} size={20} />
                        </View>
                    </TouchableOpacity>
                    <View style={SOBS.trackTitle}>
                        <H2 text={keywords.trackingNumber} />
                        <Text style={SOBS.WhenItemShipBack}> {keywords.whenItemShipBack}</Text>
                    </View>
                    <TouchableOpacity style={[SOBS.copyContentContainer, { borderBottomWidth: 0 }]} onPress={() => copyToClipboard(trackingNum2)}>
                        <Text style={SOBS.copyText}>{trackingNum2}</Text>
                        <View >
                            <FontAwesomeIcon icon={faCopy} size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={SOBS.bottom}>
                    <View style={SOBS.line}>
                        <H2 text={keywords.whatIneedToDo} />
                    </View>
                    <TouchableOpacity onPress={handleNext} style={SOBS.iconContainer}>
                        <Text style={SOBS.bottomText}>{keywords.nextSteps}</Text>
                        <View style={SOBS.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={SOBS.bottom}>
                    <View style={SOBS.line}>
                        <H2 text={keywords.shipWithCanadaPost} />
                    </View>
                    <TouchableOpacity style={SOBS.iconContainer} onPress={() => showShippingLabel(trackingNum1)}>
                        <Text style={SOBS.bottomText}>{keywords.downloadShippingLabel}</Text>
                        <View style={SOBS.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={SOBS.iconContainer} onPress={() => showShippingLabel(trackingNum2)}>
                        <Text style={SOBS.bottomText}>{keywords.downloadShippingBackLabel}</Text>
                        <View style={SOBS.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={SOBS.bottom}>
                    <View style={SOBS.line}>
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
                        style={SOBS.iconContainer}>
                        <Text style={SOBS.bottomText}>{keywords.contactSupport}</Text>
                        <TouchableOpacity style={SOBS.iconButton}>
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
                        style={SOBS.iconContainer}>
                        <Text style={SOBS.bottomText}>{keywords.faqs}</Text>
                        <TouchableOpacity style={SOBS.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <PdfViewer />
            <BottomSheets bottomSheetRef={bottomSheetRef} handleSheetChanges={(index: number) => {
                if (index > 0) {
                    setSnapPoint(index);
                } else {
                    setSnapPoint(1);
                }
            }}
                snapPoint={snapPoint}
                setSnapPoint={setSnapPoint}>
                {/* <H2 text={firstTime ? keywords.firstBorrowCongratulationMessage.replace(" on ", " on first ") : keywords.firstBorrowCongratulationMessage} style={SOBS.congratulationMessage} /> */}
                <H2 text={keywords.firstBorrowCongratulationMessage} style={SOBS.congratulationMessage} />
                <FlatList
                    data={stepsToBorrowShipping}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
                <View style={SOBS.button}>
                    <Button text={keywords.gotIt} onPress={() => setSnapPoint(1)} variant='main' />
                </View>
            </BottomSheets>
        </View>
    )
}

export default MyOrderBorrowShipping