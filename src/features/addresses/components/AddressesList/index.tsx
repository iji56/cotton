import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import AddressesHeader from '../AddressesHeader'
import { Address, AddressesMainContext } from '../../context/AddressesMainContext'
import IconButton from '@/components/elements/Button/IconButton'
import { faEllipsisVertical, faLocationCrosshairs, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot as dot } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ALS from './Addresslist.styles'
import { keywords } from '../../utils/keywords'
import BottomSheets from '@/components/elements/BottomSheet'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPencil, } from '@fortawesome/sharp-regular-svg-icons'
import { palette } from '@/components/styles/theme'
import { deleteAddress } from '../../api/deleteAddress'
import { saveDefaultAddress } from '../../api/setDefaultAddress'
import { reduxSelect } from '@/types/reduxHooks'
import { errorToast, successToast } from '@/lib/toastConfig'
import Loader from '@/components/elements/Loader'


const AddressesList = () => {
    const { addresses, address, setAddress, setAddresses } = useContext(AddressesMainContext)
    const { id } = reduxSelect(state => state.usermeta);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const [loading, setLoading] = useState(false);
    const ref = useRef<any>();
    const isFocused = useIsFocused();

    useEffect(() => {
        setAddress({ address_id: "" });
    }, [isFocused]);


    const handleDelete = async () => {
        setLoading(true)
        setSnapPoint(1)
        deleteAddress(address?.address_id!).then(() => {
            successToast('Address deleted successfully')
            setAddress({ address_id: "" });
            setLoading(false)
        }).catch(error => {
            errorToast("This address cannot be deleted because it is linked to multiple products.")
            console.log("Error deleting address : ", error)
            setLoading(false)
        })

    }

    const handleDefault = (addressId: string) => {
        setLoading(true)
        setSnapPoint(1)
        saveDefaultAddress(id!, addressId,).
            then(() => {
                successToast(keywords.updatedDefaultAddress)
                setLoading(false)
                setAddress({ address_id: "" });
            }).catch(error => {
                errorToast("Failed to add addresses as default")
                console.log("Error : ", error)
                setLoading(false)
            })

    }

    const handleEdit = () => {
        setSnapPoint(1)
        navigation.navigate('AddressesMap', { address: address, isEdit: true });
    }

    const renderItem = (address: Address, index: number) => {
        console.log("address : ", address.address)
        const mainText = address.address?.split(',')[0]; // split address to main text and secondary
        let indesx = address.address.lastIndexOf(mainText) + (mainText.length - 1) //  index main text to extract secondary text
        const secondaryText = address.address.substring(indesx + 2) //  extracting secondary text by removing ',' and space

        return (
            <View key={index} style={ALS.listItemContainer}>
                <FontAwesomeIcon icon={address?.default_status ? faLocationDot : dot} size={20} style={ALS.icon} />
                <View style={{ flex: 1 }}>
                    <Text style={ALS.mainText}>{mainText}</Text>
                    <Text style={ALS.secondaryText}>{secondaryText}</Text>
                    {address?.default_status &&
                        <View style={ALS.default}>
                            <Text style={ALS.defaultText}>{keywords.default}</Text>
                        </View>
                    }
                </View>
                <IconButton // address nearby
                    onPress={() => {
                        console.log(address)
                        setAddress({
                            description: address.address?.split("#")[0],
                            mainText: mainText,
                            secondaryText: secondaryText,
                            apartment_suite: address.apartment_suite,
                            delivery_hand_off_instructions: address.delivery_hand_off_instructions,
                            address_id: address.address_id,
                            postalCode: address.postal_code
                        })
                        setSnapPoint(250)
                    }}
                    icon={faEllipsisVertical}
                    style={ALS.editIcon}
                />
            </View>
        )
    }

    return (
        <>
            <AddressesHeader headerTitle={keywords.myAddresses} headerType='main' />
            <View style={ALS.container}>
                {loading ? <Loader /> :
                    <View style={ALS.listContainer}>
                        <FlatList
                            data={addresses}
                            ListFooterComponent={() => (
                                <View style={ALS.buttonContainer}>
                                    <Text>{keywords.addAnAddress}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('AddAddresses')} style={{ padding: 5 }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                }
                <BottomSheets bottomSheetRef={ref} handleSheetChanges={(index: number) => {
                    if (index > 0) {
                        setSnapPoint(index);
                    } else {
                        setSnapPoint(1);
                    }
                }}
                    snapPoint={snapPoint}
                    setSnapPoint={setSnapPoint}>
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity onPress={handleEdit} style={ALS.bottomButtonContainer}>
                            <FontAwesomeIcon icon={faPencil} size={20} />
                            <Text style={ALS.buttonText}>{keywords.editAddress}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={ALS.bottomButtonContainer}>
                            <FontAwesomeIcon icon={faTrashAlt} size={20} color={palette.red} />
                            <Text style={[ALS.buttonText, { color: palette.red }]}>{keywords.deleteAddress}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDefault(address?.address_id!)} style={ALS.bottomButtonContainer}>
                            <FontAwesomeIcon icon={faLocationCrosshairs} size={20} />
                            <Text style={ALS.buttonText}>{keywords.setAsDefault}</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheets>
            </View>

        </>
    )
}

export default AddressesList