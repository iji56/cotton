import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords } from '../../utils/keywords';
import SOLC from './MyOrderLendCompleted.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ListingItem from '../../components/ListingItem';
import { getUserData } from '../../api/getUserData';
import moment from 'moment';
import { NotificationContext } from '@/features/Listeners/listeners';

const MyOrderLendCompleted = ({ route, navigation }: any) => {
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
    const [borrower, setBorrower] = useState<any>({});
    const totalAmount = route.params.orderData?.total_price ?? 0;

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
        const startDate = new Date(order?.borrow_start || null)
        const endDate = new Date(order?.borrow_end || null)
        const formattedStart = formatter.format(startDate)
        const formattedEnd = formatter.format(endDate)

        setStart(formattedStart)
        setEnd(formattedEnd)
    }, [order])

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <OrdersHeader headerTitle={listing?.listing_name} redirect={'OrdersMain'} />
            <ScrollView contentContainerStyle={SOLC.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SOLC.infoCard}>
                    <View style={SOLC.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url,
                            name: listing?.listing_name,
                            type: listing?.brand,
                            size: listing?.size
                        }} />
                    </View>
                    <View style={SOLC.infoContainer}>
                        <View style={SOLC.infoRow}>
                            <H2 text={keywords.startDate} />
                            <Text style={SOLC.text}>{start}</Text>
                        </View >
                        <View style={SOLC.infoRow}>
                            <H2 text={keywords.endDate} />
                            <Text style={SOLC.text}>{end}</Text>
                        </View>
                    </View>
                    <View style={SOLC.infoContainer}>
                        <View style={SOLC.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOLC.text}>{'CA $'}{totalAmount}</Text>
                        </View >
                        <View style={SOLC.infoRow}>
                            <H2 text={keywords.borrowPeiod} />
                            {/* data will be replace with dynamic data */}
                            <Text style={SOLC.text}>{moment(new Date(order.borrow_end)).
                                diff(moment(new Date(order.borrow_start)),
                                    'days') + 1} {keywords.days}</Text>
                        </View>
                    </View>
                </View>
                <View style={SOLC.infoCard}>
                    <H2 text={keywords.borrower} style={{ marginTop: 10 }} />
                    <TouchableOpacity style={SOLC.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: borrower.user_info.id })}>
                        <Image source={{ uri: borrower?.user_info?.userAvatar || picture }} style={SOLC.userImage} />
                        <Text style={SOLC.username}>{borrower?.user_info?.user_name}</Text>
                    </TouchableOpacity>
                </View>
                <View style={SOLC.bottom}>
                    <View style={SOLC.line}>
                        <H2 text={keywords.howWasBorrower} />
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Review', { orderData: order, listingData: listing })}
                        style={SOLC.iconContainer}>
                        <Text style={SOLC.bottomText}>{keywords.reviewBorrower}</Text>
                        <TouchableOpacity style={SOLC.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={SOLC.bottom}>
                    <View style={SOLC.line}>
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
                        style={SOLC.iconContainer}>
                        <Text style={SOLC.bottomText}>{keywords.contactSupport}</Text>
                        <TouchableOpacity style={SOLC.iconButton}>
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
                        style={SOLC.iconContainer}>
                        <Text style={SOLC.bottomText}>{keywords.faqs}</Text>
                        <TouchableOpacity style={SOLC.iconButton}>
                            <FontAwesomeIcon icon={faChevronRight} size={20} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default MyOrderLendCompleted