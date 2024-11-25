import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ListingItem } from '../../types/supabaseListings';
import CIV from './ClothItem.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { imageBaseUrl } from '@/utils/createStorageURL';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { imagePlaceHolder } from '../../utils/keywords';
import Video from 'react-native-video';
import { getImageSrc } from '@/utils/renderItemsForTesting';
type FeedItemProps = {
    item: ListingItem;
    index: number; // Included if you need the index for any reason
    separators: {
        highlight: () => void;
        unhighlight: () => void;
        updateProps: (select: 'leading' | 'trailing', newProps: object) => void;
    };
}

const ClothItem = ({ item, index, separators }: FeedItemProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const handleNavigation = () => {
        navigation.navigate('BorrowNav', {
            screen: 'BorrowMain',
            params: { listingData: item }
        })
    }

    return (
        <TouchableOpacity style={CIV.container} onPress={handleNavigation}>
            
            { item.listing_image_url?.endsWith(".mp4")? <Video 
    source={{ uri: item.listing_image_url? getImageSrc(item.listing_name,item.listing_image_url) : "" }}
    style={CIV.image}
    repeat={true}
    resizeMode="cover"
    onLoad={data => {
     this.videoRef.seek(0.001); // Seek to 1 millisecond
   }}
   ref={ref => {
     this.videoRef = ref;
   }}
   muted
   
   />:<Image style={CIV.image} source={{
                uri: item?.listing_image_url ?
                getImageSrc(item.listing_name,item.listing_image_url) :
                    imagePlaceHolder
            }} />}
            <View style={CIV.caption}>
                <View style={CIV.title}>
                    <H2 text={item?.listing_name} />
                </View>
                <View style={CIV.details}>
                    <View style={CIV.category}>
                        <Text style={CIV.subTitleDetails}>{item.brand}</Text>
                        <Text style={CIV.subTitleDetails}>|</Text>
                        <Text style={CIV.subTitleDetails}>{item.size}</Text>
                    </View>
                    <Text style={CIV.buyPrice}>
                        Retail ${item.price_original}
                    </Text>
                    <Text style={CIV.originalPrice}>
                        Rent from ${item.price_borrow}
                    </Text>
                </View>
            </View>
            <View style={CIV.icon} >
                <FontAwesomeIcon icon={'chevron-right'} />
            </View>
        </TouchableOpacity>
    )
}

export default ClothItem

const styles = StyleSheet.create({})