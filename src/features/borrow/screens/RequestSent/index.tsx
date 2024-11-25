import { BackHandler, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SRS from './RequestSent.styles';
import H1 from '@/components/elements/H1';
import { keywords, placeholderPicture } from '../../utils/staticTexts';
import ListingItem from '../../components/ListingItem';
import Button from '@/components/elements/Button/Button';
import H2 from '@/components/elements/H2';
import { formatDate } from '../../utils/formatDate';
import Wrapper from '@/components/Wrapper';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createChatAndNavigate } from '@/features/profile/api/createChat';
import { reduxSelect } from '@/types/reduxHooks';
import moment from 'moment';

const RequestSent = ({ route }: any) => {
    const { itemData, selectedDates, totalAmount, lender, borrowMethod } = route.params;
    const user = reduxSelect(state => state.usermeta);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            navigation.goBack();
            return true
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleChat = async () => {
        setLoading(true)
        await createChatAndNavigate(user.id!, itemData.userID, itemData.username, navigation);
        setLoading(false)
    }
    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <ScrollView contentContainerStyle={SRS.container} showsVerticalScrollIndicator={false}>
                <Wrapper>
                    <Image source={require('../../../../components/assets/check.png')} style={SRS.checkIcon} />
                    <View style={SRS.requestSent}>
                        <H1 text={keywords.requestSent} />
                    </View>
                    <View style={SRS.orderDetail}>
                        <H1 text={keywords.orderDetails} />
                    </View>
                    <View style={SRS.listingContainer}>
                        <ListingItem itemData={itemData} />
                    </View>
                    <View style={SRS.calculationContainer}>
                        <View>
                            <H2 text={borrowMethod === keywords.localPickup ? lender ? keywords.startDate : keywords.pickupDate : keywords.shippingDate} />
                            <Text style={SRS.value}>
                                {formatDate(Object.keys(selectedDates)[0])}
                            </Text>
                        </View>
                        {borrowMethod === keywords.localPickup && lender ?
                            <View>
                                <H2 text={keywords.endDate} />
                                <Text style={SRS.value}>
                                    {formatDate(Object.keys(selectedDates)[Object.keys(selectedDates).length - 1])}
                                </Text>
                            </View>
                            : <View>
                                <H2 text={lender ? keywords.borrowMethod : keywords.buyMethod} />
                                <Text style={SRS.value}>
                                    {borrowMethod}
                                </Text>
                            </View>}
                    </View>
                    <View style={SRS.calculationContainer}>
                        <View>
                            <H2 text={keywords.totalAmount} />
                            <Text style={SRS.value}>{`CA $${totalAmount}`}</Text>
                        </View>
                        {lender &&
                            <View style={{ width: 90, }}>
                                <H2 text={keywords.borrowPeriod} />
                                <Text style={SRS.value}>
                                    {moment(Object.keys(selectedDates)[Object.keys(selectedDates).length - 1]).
                                        diff(moment(Object.keys(selectedDates)[0]),
                                            'days') + 1}
                                </Text>
                            </View>
                        }
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('FeedProfile', { userID: itemData.userID })}>
                        <H2 text={lender ? keywords.lender : keywords.seller} style={{ marginTop: 20 }} />
                        <View style={SRS.userContainer}>
                            <Image source={{ uri: itemData?.userAvatar || placeholderPicture }} style={SRS.userImage} />
                            <H2 text={itemData.username} />
                        </View>
                    </TouchableOpacity>
                    <View style={SRS.buttonContainer}>
                        <Button text={lender ? keywords.chatWithLender : keywords.chatWithSeller} onPress={handleChat} variant='secondary' style={SRS.button} loading={loading} />
                        <View style={{ height: 20 }} />
                        <Button text={keywords.returnHome} onPress={() => navigation.navigate('FeedMain')} variant='main' style={SRS.button} />
                    </View>
                </Wrapper>
            </ScrollView>
        </View>
    )
}

export default RequestSent