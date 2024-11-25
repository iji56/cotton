import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { palette } from '@/components/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduxSelect } from '@/types/reduxHooks';
import { keywords, placeholderPicture } from '../../utils/keywords';
import SOC from './MyOrderCancelled.styles';
import H2 from '@/components/elements/H2';
import ListingItem from '../../components/ListingItem';
import Button from '@/components/elements/Button/Button';
import { getUserData } from '../../api/getUserData';
import H1 from '@/components/elements/H1';
import IconButton from '@/components/elements/Button/IconButton';
import Wrapper from '@/components/Wrapper';
import { faArrowLeftLong } from '@fortawesome/sharp-regular-svg-icons';
import moment from 'moment';
import { formatDate } from '@/features/borrow/utils/formatDate';

const MyOrderCancelled = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const order = route.params.orderData ?? null;
    const { id } = reduxSelect(state => state.usermeta);
    const selectedDates = [order?.borrow_start ?? new Date(), order?.borrow_end ?? new Date()]
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';
    const [start, setStart] = useState('')
    const [buyer, setBuyer] = useState<any>({});
    const totalAmount = route.params.orderData?.total_price ?? 0;
    const selectedPickup = 'Local-pickup'
    console.log("cancellads : ", order)
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', // Abbreviated month name (e.g., "Mar")
        day: 'numeric', // Numeric day of the monthy
        year: 'numeric'
    });
    let message = null


    useEffect(() => {
        const getBuyerDetail = async () => {
            const response = await getUserData(order?.user_id !== id ? order?.user_id : (order?.borrower_id || order?.purchaser_id));
            setBuyer(response[0]);
        }

        getBuyerDetail()
    }, [])
    useEffect(() => {
        const startDate = new Date(order?.shipping_date || null)
        const formattedStart = formatter.format(startDate)

        setStart(formattedStart)
    }, [order])

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Wrapper>
                    <View style={SOC.orderDetail}>
                        <IconButton icon={faArrowLeftLong} size={20} style={{ marginRight: 20 }} onPress={() => navigation.goBack()} />
                        <H1 text={keywords.orderDetails} />
                    </View>
                    <Image source={require('../../components/assets/cross.png')} style={SOC.checkIcon} />
                    <View style={SOC.requestSent}>
                        <H1 text={keywords.orderCancelled} />
                    </View>
                    <View style={SOC.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url || picture,
                            name: order.listing_name,
                            type: order.brand,
                            size: order.size
                        }} />
                    </View>
                    <View style={SOC.calculationContainer}>
                        <View style={SOC.infoRow}>
                            <H2 text={keywords.startDate} />
                            <Text style={SOC.value}>
                                {formatDate(selectedDates[0])}
                            </Text>
                        </View>
                        <View style={SOC.infoRow}>
                            <H2 text={keywords.endDate} />
                            <Text style={SOC.value}>
                                {formatDate(selectedDates[1])}
                            </Text>
                        </View>
                    </View>
                    <View style={SOC.calculationContainer}>
                        <View style={SOC.infoRow}>
                            <H2 text={keywords.totalAmount} />
                            <Text style={SOC.value}>{`CA $${totalAmount}`}</Text>
                        </View>
                        <View style={SOC.infoRow}>
                            <H2 text={keywords.borrow} />
                            <Text style={SOC.value}>
                                {moment(new Date(selectedDates[1])).
                                    diff(moment(new Date(selectedDates[0])),
                                        'days') + 1} {keywords.days}
                            </Text>
                        </View>
                    </View>

                    <View style={SOC.calculationContainer}>
                        <View style={SOC.infoRow}>
                            <H2 text={(order?.borrower_id && order?.lender_id === id) ? keywords.borrower :
                                (order?.purchaser_id && order?.owner_id === id) ? keywords.buyer :
                                    (order?.borrower_id && order?.lender_id !== id) ? keywords.lender :
                                        (order?.purchaser_id && order?.owner_id !== id) && keywords.seller} />
                            <TouchableOpacity style={SOC.userContainer} onPress={() => navigation.navigate('FeedProfile', { userID: buyer.user_info.id })}>
                                <Image source={{ uri: buyer?.user_info?.userAvatar || placeholderPicture }} style={SOC.userImage} />
                                <H2 text={buyer?.user_info?.user_name} style={SOC.username}/>
                            </TouchableOpacity>
                        </View>
                        <View style={SOC.infoRow}>
                            <H2 text={keywords.borrowMethod} />
                            <Text style={SOC.value}>
                                {selectedPickup}
                            </Text>
                        </View>
                    </View>
                    {message && <View style={{ marginTop: 15 }}>
                        <H2 text='Reason for declining' />
                        <Text style={{ marginVertical: 8 }}>{message}</Text>
                    </View>
                    }
                    <View style={[SOC.buttonContainer, { height: 40 }]}>
                        <Button text={keywords.browseOtherListings} onPress={() => navigation.reset({
                            routes: [{ name: 'PrimaryNav' }],
                            index: 0
                        })} variant='main' />
                    </View>
                </Wrapper>
            </ScrollView>
        </View>
    )
}

export default MyOrderCancelled