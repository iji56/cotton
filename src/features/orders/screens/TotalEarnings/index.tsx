import { FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { keywords, listingFilters } from '../../utils/keywords';
import FilterChip from '../../components/FilterChip';
import PendingItem from '../../components/PendingItem';
import OrdersHeader from '../../components/OrdersHeader';
import STE from './TotalEarnings.styles';
import { getTotalEarningList } from '../../api/getTotalEarningList';
import { reduxSelect } from '@/types/reduxHooks';

const TotalEarning = () => {
    const insets = useSafeAreaInsets();
    const user = reduxSelect(state => state.usermeta);
    const currentUserID = user.id;
    const [selectedFilter, setSelectedFilter] = useState<string>('');
    const [ordersData, setOrdersData] = useState<any>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
            const response = await getTotalEarningList(currentUserID!, selectedFilter ?? listingFilters[0]);
            setOrdersData([
                ...(response?.total_earning_listings_borrow ?? []),
                ...(response?.total_earning_listings_purchased ?? [])
            ]);
        }

        fetchData();
    }, [selectedFilter]);


    useEffect(() => {
        let sum = ordersData.reduce((acc: number, item: any) => acc + parseFloat(((item?.purchase_price || item?.borrow_price) * 0.8).toFixed(2)), 0);
        // let sum = ordersData.reduce((acc: number, item: any) => acc + parseFloat((((item?.purchase_price || item?.borrow_price) * 0.8) - (item?.cost_shipping >= 50 ? (item.cost_shipping / 2) : 0)).toFixed(2)), 0);
        setTotal(sum);
    }, [ordersData]);

    const handleSelect = (filter: string) => {
        if (selectedFilter === filter) {
            setSelectedFilter('');
        } else {
            setSelectedFilter(filter);
        }
    };

    const renderFilter = ({ item, index }: { item: string, index: number }) => (
        <FilterChip key={index} label={item} selected={selectedFilter === item} onPress={() => handleSelect(item)} />
    )

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const earnings = ((item?.purchase_price || item?.borrow_price) * 0.8).toFixed(2);
        // const earnings = (((item?.purchase_price || item?.borrow_price) * 0.8) - (item?.cost_shipping >= 50 ? (item.cost_shipping / 2) : 0)).toFixed(2);

        return (
            <PendingItem
                key={index}
                itemData={{ name: item.listing_name, borrower: item?.buyer_name || item?.borrower_name, price: earnings || 0, imageUrl: item?.listing_image_url, }}
                selectedDates={item.borrower_name ?
                    [item?.end_date ?? null, item?.start_date ?? null] :
                    [item?.shipping_date || item?.local_pickup_date, item?.shipping_date || item?.local_pickup_date]}
                purchaser={item?.buyer_name ? true : false}
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
            <OrdersHeader headerTitle={keywords.totalEarning} redirect={'PayoutMain'} />

            <View style={STE.container}>

                <View style={STE.filterContainer}>
                    <FlatList
                        data={listingFilters}
                        style={STE.filterContainer}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderFilter}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <FlatList
                    data={ordersData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />

            </View>

            <View style={STE.bottomContainer}>
                <Text style={STE.text}>{keywords.total}</Text>
                <Text style={STE.text}>{'CA $'}{total.toFixed(2)}</Text>
            </View>
        </View>
    )
}

export default TotalEarning