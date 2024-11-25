import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ListingItem } from '../../types/supabaseListings';
import PIS from './PeopleItem.styles';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '@/features/auth/api/authSignUp';
import { imagePlaceHolder } from '../../utils/keywords';
type FeedItemProps = {
    item: ListingItem;
    index: number; // Included if you need the index for any reason
    separators: {
        highlight: () => void;
        unhighlight: () => void;
        updateProps: (select: 'leading' | 'trailing', newProps: object) => void;
    };
}

const PeopleItem = ({ item, index, separators }: FeedItemProps) => {
    const navigation = useNavigation()
    const handleNavigation = () => {
        navigation.navigate('FeedProfile', { userID: item.id })
    }
    // console.log(item)
    return (
        <TouchableOpacity style={PIS.container} onPress={handleNavigation}>
            <Image style={PIS.image} source={{
                uri: item?.user_profile_image ?
                    item.user_profile_image.startsWith('http') ? item.user_profile_image : `${baseUrl}${item.user_profile_image}` :
                    imagePlaceHolder
            }} />
            <View style={PIS.caption}>
                <View style={PIS.title}>
                    <H2 text={item.name} />
                </View>
                <View style={PIS.details}>
                    <View style={PIS.category}>
                        <Text style={PIS.subTitleDetails}>{item?.city?.trim() || "TORONTO"}, {item?.state || "ON"}</Text>
                    </View>
                    <Text style={PIS.originalPrice}>
                        {item?.total_listings || 0} items
                    </Text>
                </View>
            </View>
            <View style={PIS.icon}>
                <FontAwesomeIcon icon={'chevron-right'} />
            </View>
        </TouchableOpacity>
    )
}

export default PeopleItem

const styles = StyleSheet.create({})