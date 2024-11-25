import { View, Text, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { keywords } from '../../utils/keywords';
import PendingItem from '../../components/PendingItem';
import OrdersHeader from '../../components/OrdersHeader';
import { palette } from '@/components/styles/theme';
import SAP from './AvailablePayout.styles';
import Button from '@/components/elements/Button/Button';
import { ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getLenderListingAvailablePayout } from '../../api/getLenderListingAvailablePayout';
import { reduxSelect } from '@/types/reduxHooks';
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env';

const AvailablePayout = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const user = reduxSelect(state => state.usermeta);
    const currentUserID = user.id;
    const insets = useSafeAreaInsets();
    const [total, setTotal] = useState(0);
    const [ordersData, setOrdersData] = useState<any>([]);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [borrowListingsIds, setBorrowListingIds] = useState<string[]>([]);
    const [purchaseListingsIds, setPurchaseListingIds] = useState<string[]>([]);
    const isFocused = useIsFocused()

    useEffect(() => {

        const fetchData = async () => {
            const response = await getLenderListingAvailablePayout(currentUserID!);
            if (response) {
                setOrdersData([...response?.listings_borrow || [], ...response?.listings_purchased || []]);
            }
        }

        fetchData();
    }, [isFocused]);

    useEffect(() => {
        let sum = selectedItems.reduce((acc: number, item: any) => acc + parseFloat(item.price), 0);
        setTotal(sum);
    }, [selectedItems, isFocused]);


    const handlePayOut = async () => {
        if (total === 0) {
            Alert.alert("Select Item", "Please select items to payout");
        }
        else if (ordersData?.length === 0) {
            navigation.goBack();
            return;
        }
        setLoading(true);
        try {
            const payload = JSON.stringify({
                connectedAccountId: user.stripe_account_id,
                transferAmount: total.toFixed(0),
                listings_borrower: borrowListingsIds,
                listings_purchased: purchaseListingsIds
            });
            console.log(payload)
            const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/payout`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: payload,
            });
            console.log("response : ", await response.json());
            if (response.ok) {
                setLoading(false);
                navigation.navigate('PayoutConfirmation', { total, accountNumber: total })
            } else {
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.log("Error : ", error);
        }
    }

    const toggleCheck = (selectedItem: { id: string, type: string }) => {
        setSelectedItems((prev: any) => {
            if (prev.some((item: any) => item.id === selectedItem.id)) {
                return prev.filter((item: any) => item.id !== selectedItem.id)
            } else {
                return [...prev, selectedItem];
            }
        });

        if (selectedItem.type === keywords.borrow.toLowerCase()) {
            console.log("borrow : ", borrowListingsIds, selectedItem.id)
            if (borrowListingsIds.includes(selectedItem.id)) {
                setBorrowListingIds(borrowListingsIds.filter(item => item !== selectedItem.id));
            } else {
                setBorrowListingIds([...borrowListingsIds, selectedItem.id]);
            }
        } else {
            console.log("purchased :", purchaseListingsIds, selectedItem.id)
            if (purchaseListingsIds.includes(selectedItem.id)) {
                setPurchaseListingIds(purchaseListingsIds.filter(item => item !== selectedItem.id));
            } else {
                setPurchaseListingIds([...purchaseListingsIds, selectedItem.id]);
            }
        }
    }

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const earnings = ((item?.purchase_price || item?.borrow_price) * 0.8).toFixed(2);
        // const earnings = (((item?.purchase_price || item?.borrow_price) * 0.8) - (item?.cost_shipping >= 50 ? (item.cost_shipping / 2) : 0)).toFixed(2);

        return (
            <PendingItem
                key={index}
                itemData={{ id: item?.id, name: item.listing_name, borrower: item.borrower_name || item?.buyer_name, price: earnings ?? 0, imageUrl: item?.listing_image_url, type: item?.type }}
                selectedDates={[item?.start_date || item?.localpickup_date, item?.end_date || item?.shipping_date]}
                type={true}
                toggleCheck={toggleCheck}
                selectedItems={selectedItems}
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
            <OrdersHeader headerTitle={keywords.availablePayout} redirect={'PayoutMain'} />

            <View style={SAP.container}>
                <Text style={[SAP.text, { marginLeft: 5 }]}>{keywords.selectItem}</Text>
                <FlatList
                    data={ordersData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <View style={SAP.bottomContainer}>
                <View style={SAP.amount}>
                    <Text style={SAP.text}>{keywords.total}</Text>
                    <Text style={SAP.text}>{'CA $'}{total.toFixed(2)}</Text>
                </View>
                <Button
                    text={keywords.getPaidOut}
                    onPress={handlePayOut}
                    variant='main'
                    style={{ height: 43, marginTop: 10 }}
                    loading={loading}
                />
            </View>

        </View>
    )
}

export default AvailablePayout;