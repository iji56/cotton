import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords, stepsToBuyFromShipping } from '../../utils/keywords';
import SOBS from './MyOrderBuyShipping.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import BottomSheets from '@/components/elements/BottomSheet';
import Button from '@/components/elements/Button/Button';
import { getUserData } from '../../api/getUserData';
import H1 from '@/components/elements/H1';
import moment from 'moment';
import { checkListingBorrowStatus } from '@/features/borrow/api/checkListingBorrowStatus';
import { getShipmentArtifect } from '../../api/getArtifect';
import { NotificationContext } from '@/features/Listeners/listeners';
import PdfViewer from '../../components/pdfViewer';

const MyOrderBuyShipping = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { setCurrentRoute, setModalVisible, setFilePath } = useContext(NotificationContext);
    const currentUser = reduxSelect(state => state.usermeta.id);
    // const orderId = route.params.orderID ?? null;
    const order = route.params.orderData ?? null;
    const listing = route.params.listingData ?? null;
    // const lender = route.params.lender ?? null;
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';
    const [start, setStart] = useState('')
    const [shippingDate, setShippingDate] = useState<string | null>(null);
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const bottomSheetRef = useRef<any>();
    const [seller, setSeller] = useState<any>({});
    const totalAmount = route.params.orderData?.total_price ?? 0
    const trackingNum = order.label_id || "4363452345345234fgwer";

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Mar")
        day: 'numeric', // Numeric day of the monthy
        year: 'numeric'
    });

    useEffect(() => {
        const getSellerDetail = async () => {
            const response = await getUserData(order?.owner_id);
            console.log("user : ", response)
            setSeller(response[0]);
        }

        getSellerDetail()
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
        const startDate = new Date(order?.shipping_date || null)
        const formattedStart = formatter.format(startDate)
        setStart(formattedStart)

        setTimeout(() => {
            setSnapPoint('70%');
            try {
                bottomSheetRef.current.snapToIndex(1)
            } catch (error) {
                console.log("Index out of index : ", error)
            }
        }, 500)
        console.log("order detail  : ", order)
    }, [order])

    const copyToClipboard = () => {
        navigation.navigate("ShippingDetail", { trackingNum })
        Clipboard.setString(trackingNum)
    };

    const showShippingLabel = async () => {
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
        const parts = text.replace("fixedDate", `<b>${moment(order?.shipping_date).format("MMMM D")}</b>`).split(/(<b>.*?<\/b>)/g);
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
                            <H2 text={keywords.shipDate} />
                            <Text style={SOBS.text}>{start}</Text>
                        </View >
                    </View>
                    <View style={SOBS.infoContainer}>
                        <View style={SOBS.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOBS.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                    </View>


                    <H2 text={keywords.seller} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOBS.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: seller.user_info.id })}>
                        <Image source={{ uri: seller?.user_info?.userAvatar || picture }} style={SOBS.userImage} />
                        <Text style={SOBS.username}>{seller?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                    <H2 text={keywords.trackingNumber} />
                    <TouchableOpacity style={SOBS.copyContentContainer} onPress={copyToClipboard}>
                        <Text style={SOBS.copyText}>{trackingNum}</Text>
                        <View>
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
                    <TouchableOpacity style={SOBS.iconContainer} onPress={showShippingLabel}>
                        <Text style={SOBS.bottomText}>{keywords.downloadShippingLabel}</Text>
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
                <H2 text={keywords.firstLendCongratulationMessage} style={SOBS.congratulationMessage} />
                <FlatList
                    data={stepsToBuyFromShipping}
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

export default MyOrderBuyShipping