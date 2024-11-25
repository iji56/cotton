import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GetLocation, { Location } from 'react-native-get-location'
import { GooglePlaceData } from 'react-native-google-places-autocomplete'
import { AddressesMainContext } from '../../context/AddressesMainContext'
import AddressesList from '../../components/AddressesList'
import Toast from 'react-native-toast-message'
import { toastConfig } from '@/lib/toastConfig'
import { useIsFocused } from '@react-navigation/native'
import { getSavedAddresses } from '../../api/getSavedAddressed'
import { reduxSelect } from '@/types/reduxHooks'
import { getNearByAddresses } from '../../api/getNearByAddresses'
import { directToSetting, requestPermission } from '@/utils/permissions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'

const Addresses = () => {
    const [addresses, setAddresses] = useState<GooglePlaceData[]>([]);
    const [address, setAddress] = useState({ address_id: '' });
    const [nearbyAddresses, setNearbyAddresses] = useState<any>([]);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const uid = reduxSelect(state => state.auth.uid);
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        requestPermission().then().catch()
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                console.log(location);
                setUserLocation(location)
            })
            .catch(async error => {
                if (error.message === 'Authorization denied') {
                    await directToSetting()
                }
            })
    }, []);
    useEffect(() => {
        const fetchSavedAdresses = async () => {
            if (userLocation) {
                const response = await getNearByAddresses(userLocation);
                if (response?.results) {
                    setNearbyAddresses(response.results)
                }
            }
            let addresses = await getSavedAddresses(uid!);
            console.log("user addresses : ", addresses)
            if (addresses) {
                setAddresses(addresses)
            }
        }
        fetchSavedAdresses()
    }, [isFocused, userLocation, address]);


    return (
        <AddressesMainContext.Provider value={{
            addresses,
            address,
            nearbyAddresses,
            setAddresses,
            setAddress,
            setNearbyAddresses
        }}>
            <View style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white,
            }}>
                <AddressesList />
            </View>
            <Toast config={toastConfig} />
        </AddressesMainContext.Provider>
    )
}

export default Addresses

const styles = StyleSheet.create({})