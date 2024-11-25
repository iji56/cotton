import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DeliveryOptionsResponse, Event, getShippingDetail } from '../../api/getShippingDetails';
import { errorToast } from '@/lib/toastConfig';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords } from '../../utils/keywords';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import SSD from './ShippingDetails.styles';
import H1 from '@/components/elements/H1';
import H2 from '@/components/elements/H2';
import H3 from '@/components/elements/H3';
import Loader from '@/components/elements/Loader';

const ShippingDetail = ({ route }: any) => {
    const insets = useSafeAreaInsets();
    const { trackingNum } = route?.params;
    const [shippingDetail, setShippingDetail] = useState<DeliveryOptionsResponse>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getShippingDetails = async () => {
            const shippingDetail = await getShippingDetail(trackingNum);
            if (shippingDetail?.success) {
                if (shippingDetail.data.code === '004' || shippingDetail.data.code === '002') {
                    errorToast(shippingDetail.data?.description || "")
                } else {
                    setShippingDetail(shippingDetail)
                    // setShippingDetail({ ...shippingDetail, data: { ...shippingDetail.data, reasonForDelay: " this is just a sample delay reason test message" } })
                }
            }
            setLoading(false)
        }

        getShippingDetails()
    }, []);

    const renderItem = ({ item, index }: { item: Event, index: number }) => {
        if (item?.eventDescription) {
            return (
                <View style={SSD.itemContainer} key={index}>
                    <H2 text={item.eventDescription} />
                    <Text style={SSD.text}>{`${keywords.location} : `}{item.location}</Text>
                    <Text style={SSD.text}>{`${keywords.time} : `}{item.eventDateTime}</Text>
                </View>
            )
        }
        return <></>
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <OrdersHeader headerTitle={keywords.shippingDetail} redirect={'OrdersMain'} />
            {loading ? <Loader /> :
                <View style={SSD.container}>
                    <H1 text={`${keywords.track}: ${shippingDetail?.data.trackingNumber}`} />
                    <View style={SSD.row}>
                        <H3 text={`${keywords.service}: ${shippingDetail?.data.service}`} style={SSD.textFixedWidth} />
                        <H3 text={`${keywords.destination}: ${shippingDetail?.data.destination}`} />
                    </View>
                    <View style={SSD.row}>
                        <H3 text={`${keywords.expectedDelivery}: ${shippingDetail?.data.expectedDeliveryDate}`} style={SSD.textFixedWidth} />
                        {shippingDetail?.data.updatedDeliveryDate && <H3 text={`${keywords.updatedDelivery}: ${shippingDetail?.data.updatedDeliveryDate}`} />}
                    </View>

                    {shippingDetail?.data.reasonForDelay && <>
                        <H2 text={keywords.delayReason} style={{ marginTop: 10 }} />
                        <Text style={SSD.reason}>
                            {shippingDetail?.data.reasonForDelay}
                        </Text>
                    </>
                    }
                    <H1 text={keywords.latestUpdates} style={{ marginTop: 10, marginBottom: 5 }} />
                    <FlatList
                        data={shippingDetail?.data.events}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            }
        </View>
    )
}

export default ShippingDetail;