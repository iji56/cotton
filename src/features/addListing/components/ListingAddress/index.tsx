import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import H2 from '@/components/elements/H2'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Checkbox } from '@/components/elements/Forms/CheckBox'
import { getSavedAddresses } from '@/features/addresses/api/getSavedAddressed'
import { reduxSelect } from '@/types/reduxHooks'
import { faPlus } from '@fortawesome/sharp-regular-svg-icons'
import SLA from './ListingAddress.styles'
import { ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { keywords } from '../../utils/keywords'
import { FlatList } from 'react-native-gesture-handler'

type Address = {
    address: string;
    addressId: string;
}

type PropType = {
    address: Address;
    setAddress: Dispatch<SetStateAction<Address>>;
}

const ListingAddress = ({ address, setAddress }: PropType) => {
    const userId = reduxSelect(state => state.usermeta.id);
    const [addresses, setAddresses] = useState([]);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const isFocused = useIsFocused()

    useEffect(() => {
        const fetchAddresses = async () => {
            const addresses = await getSavedAddresses(userId!);
            setAddresses(addresses)
        }

        fetchAddresses()
    }, [isFocused]);

    const renderItem = ({ item, index }: { item: { address: string, address_id: string }, index: number }) => {
        // console.log(item)
        const mainText = item.address?.split(',')[0]; // split address to main text and secondary
        let indexOfSecondaryText = item.address.lastIndexOf(mainText) + (mainText.length - 1) //  index main text to extract secondary text
        const secondaryText = item.address.substring(indexOfSecondaryText + 2) //  extracting secondary text by removing ',' and space

        return (
            <TouchableOpacity style={SLA.itemContainer} key={index} onPress={() => setAddress({ address: item.address, addressId: item.address_id })}>
                <View style={SLA.textContainer}>
                    <Text style={SLA.text} numberOfLines={1} >{mainText}</Text>
                    <Text style={SLA.text} numberOfLines={1} >{secondaryText}</Text>
                </View>
                <Checkbox label='' isChecked={address.addressId === item.address_id} onClick={() => setAddress({ address: item.address, addressId: item.address_id })} />
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={SLA.container}>
                <H2 text={keywords.addAddress} />
                <TouchableOpacity style={SLA.icon} onPress={() => navigation.navigate('AddressesNav', {
                    screen: "AddAddresses"
                })}>
                    <FontAwesomeIcon icon={faPlus} size={18} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={addresses}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingAddress