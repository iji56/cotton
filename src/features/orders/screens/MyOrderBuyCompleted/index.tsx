import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords } from '../../utils/keywords';
import SOBC from './MyOrderBuyCompleted.styles';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import { getUserData } from '../../api/getUserData';
import Clipboard from '@react-native-clipboard/clipboard';
import { NotificationContext } from '@/features/Listeners/listeners';
import { getShipmentArtifect } from '../../api/getArtifect';
import PdfViewer from '../../components/pdfViewer';

const MyOrderBuyCompleted = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { setCurrentRoute, setModalVisible, setFilePath } = useContext(NotificationContext);
    const currentUser = reduxSelect(state => state.usermeta.id);
    const orderId = route.params.orderID ?? null;
    const order = route.params.orderData ?? null;
    const listing = route.params.listingData ?? null;
    const lender = route.params.lender ?? null;
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';
    const [start, setStart] = useState('')
    const [lenderDetail, setLenderDetail] = useState<any>({});
    const totalAmount = route.params.orderData?.total_price ?? 0;
    const trackingNum = order?.label_id || "4363452345345234fgwer";

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Mar")
        day: 'numeric', // Numeric day of the monthy
        year: 'numeric'
    });

    useEffect(() => {
        const getLenderDetail = async () => {
            const response = await getUserData(order?.owner_id);
            setLenderDetail(response[0]);
        }

        getLenderDetail()
    }, [])


    useEffect(() => {
        const startDate = new Date(order?.shipping_date || order.local_pickup_date)
        const formattedStart = formatter.format(startDate)

        setStart(formattedStart)
    }, [order])

    const copyToClipboard = async () => {
        navigation.navigate("ShippingDetail", {trackingNum})
        // const filePath = await getShipmentArtifect({ shippingId: trackingNum });
        // if (filePath && filePath.endsWith('pdf')) {
        //     console.log("showing modal")
        //     setFilePath(filePath)
        //     setModalVisible(true)
        // }
        Clipboard.setString(trackingNum)
    };


    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <OrdersHeader headerTitle={listing?.listing_name} redirect={'OrdersMain'} />
            <ScrollView contentContainerStyle={SOBC.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SOBC.infoCard}>
                    <View style={SOBC.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url || picture,
                            name: listing?.listing_name,
                            type: listing?.type,
                            size: listing?.size
                        }} />
                    </View>
                    <View style={SOBC.infoContainer}>
                        <View style={SOBC.infoRow}>
                            <H2 text={keywords.shipDate} />
                            <Text style={SOBC.text}>{start}</Text>
                        </View >
                    </View>
                    <View style={SOBC.infoContainer}>
                        <View style={SOBC.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            <Text style={SOBC.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                    </View>
                </View>
                <View style={SOBC.infoCard}>
                    <H2 text={keywords.seller} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOBC.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: lenderDetail.user_info.id })}>
                        <Image source={{ uri: lenderDetail?.user_info?.userAvatar || picture }} style={SOBC.userImage} />
                        <Text style={SOBC.username}>{lenderDetail?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                    <H2 text={keywords.trackingNumber} />
                    <TouchableOpacity style={SOBC.copyContentContainer} onPress={copyToClipboard}>
                        <Text style={SOBC.copyText}>{trackingNum}</Text>
                        <View>
                            <FontAwesomeIcon icon={faCopy} size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={SOBC.bottom}>
                    <View style={SOBC.line}>
                        <H2 text={keywords.howWasItem} />
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Review', { orderData: order, listingData: listing })}
                        style={SOBC.iconContainer}>
                        <Text style={SOBC.bottomText}>{keywords.reviewItem}</Text>
                        <View style={SOBC.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={SOBC.bottom}>
                    <View style={SOBC.line}>
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
                        style={SOBC.iconContainer}>
                        <Text style={SOBC.bottomText}>{keywords.contactSupport}</Text>
                        <TouchableOpacity style={SOBC.iconButton}>
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
                        style={SOBC.iconContainer}>
                        <Text style={SOBC.bottomText}>{keywords.faqs}</Text>
                        <TouchableOpacity style={SOBC.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <PdfViewer />
        </View>
    )
}

export default MyOrderBuyCompleted