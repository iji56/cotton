import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { keywords } from '../../utils/keywords';
import PendingItem from '../../components/PendingItem';
import OrdersHeader from '../../components/OrdersHeader';
import { palette } from '@/components/styles/theme';
import SFP from './FuturePayouts.styles';
import { useIsFocused } from '@react-navigation/native';
import { reduxSelect } from '@/types/reduxHooks';
import { getFuturePayouts } from '../../api/getFuturePayouts';

const FuturePayout = () => {
    const user = reduxSelect(state => state.usermeta);
    const insets = useSafeAreaInsets();
    const [total, setTotal] = useState(0);
    const [ordersData, setOrdersData] = useState<any>([]);
    const isFocused = useIsFocused()

    useEffect(() => {

        const fetchData = async () => {
            const response = await getFuturePayouts(user.id!);
            if (response) {
                setOrdersData([...response?.listings_borrow || [], ...response?.listings_purchased || []]);
            }
        }

        fetchData();
    }, [isFocused]);

    useEffect(() => {
        let sum = ordersData.reduce((acc: number, item: any) => acc + parseFloat(((item?.purchase_price || item?.borrow_price) * 0.8).toFixed(2)), 0);
        // let sum = ordersData.reduce((acc: number, item: any) => acc + parseFloat((((item?.purchase_price || item?.borrow_price) * 0.8) - (item?.cost_shipping >= 50 ? (item.cost_shipping / 2) : 0)).toFixed(2)), 0);
        setTotal(sum);
    }, [ordersData, isFocused]);


    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const earnings = ((item?.purchase_price || item?.borrow_price) * 0.8).toFixed(2);
        // const earnings = (((item?.purchase_price || item?.borrow_price) * 0.8) - (item?.cost_shipping >= 50 ? (item.cost_shipping / 2) : 0)).toFixed(2);
        
        return (
            <PendingItem
                key={index}
                itemData={{ id: item?.id, name: item.listing_name, borrower: item.borrower_name || item?.buyer_name, price: earnings ?? 0, imageUrl: item?.listing_image_url, type: item?.type }}
                selectedDates={[item?.start_date || item?.localpickup_date, item?.end_date || item?.shipping_date]}
                purchaser={item?.type !== keywords.borrow.toLowerCase()}
            />
        )
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <OrdersHeader headerTitle={keywords.futurePayout} redirect={'PayoutMain'} />
            <View style={SFP.container}>
                <Text style={[SFP.text, { marginLeft: 5 }]}>{keywords.pendingLayoutMessage}</Text>
                <FlatList
                    data={ordersData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={SFP.bottomContainer}>
                <View style={SFP.amount}>
                    <Text style={SFP.text}>{keywords.total}</Text>
                    <Text style={SFP.text}>{'CA $'}{total.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    )
}

export default FuturePayout;