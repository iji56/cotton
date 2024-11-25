import { FlatList, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Button from '@/components/elements/Button/Button'
import { GooglePlaceData, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete'
import H2 from '@/components/elements/H2'
import { faLocationCrosshairs, faLocationDot } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { errorToast } from '@/lib/toastConfig'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'
import AddressesSearchBar from '@/features/addresses/components/AddressSearchBar'
import SAA from '@/features/addresses/screens/AddAddresses/AddAddresses.styles'
import GetLocation, { Location } from 'react-native-get-location'
import { getNearByAddresses } from '@/features/addresses/api/getNearByAddresses'
import { checkLocationPermission, directToSetting, requestLocationPermission } from '@/utils/permissions'
import H1 from '@/components/elements/H1'
import { keywords } from '../../utils/keywords'
import { ModalContext } from '../../context/ModalContext'
import { isLocationEnabled } from 'react-native-android-location-enabler'


const AddressesSignUp = () => {
    const { sessionData } = useContext(ModalContext);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [nearbyAddresses, setNearbyAddresses] = useState([]);
    const [address, setAddress] = useState<GooglePlaceData>();
    const addressRef = useRef<GooglePlacesAutocompleteRef>(null);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [showLocationPermission, setShowLocationPermission] = useState<boolean | null>(null);
    const [inputFocused, setInputFocused] = useState(false);
    const intervalIdRef = useRef<any>(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setInputFocused(true));
        const keyboradDidHideListener = Keyboard.addListener('keyboardDidHide', () => setInputFocused(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboradDidHideListener.remove()

        }
    }, []);

    useEffect(() => {
        const fetchSavedAdresses = async () => {
            if (userLocation) {
                const response = await getNearByAddresses(userLocation);
                if (response?.results) {
                    setNearbyAddresses(response.results)
                }
            }
        }
        fetchSavedAdresses()
    }, [isFocused, userLocation]);


    useEffect(() => {
        checkLocationPermission().then(async response => {
            if (!response) {
                setShowLocationPermission(true);
            } else if (response) {
                const hasLocationEnabled = await isLocationEnabled();
                setShowLocationPermission(!hasLocationEnabled)
            }
        })
    }, [isFocused]);

    useEffect(() => {
        intervalIdRef.current = setInterval(() => {
            fetchUserLocation();
        }, 1000); // Runs every second

        return () => {
            // Cleanup interval on unmount
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    }, []);

    const stopInterval = () => {
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };

    const fetchUserLocation = async () => {
        checkLocationPermission().then(async res => {
            // await fetchUserLocation();
            res && GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            })
                .then(location => {
                    stopInterval();
                    setShowLocationPermission(false)
                    setUserLocation(location)
                })
                .catch(async error => {
                    if (error.message === 'Authorization denied') {
                        setShowLocationPermission(true)
                    }
                })
        })

    }

    const handleAllow = () => {
        directToSetting().then(async res => {
            await fetchUserLocation();
        })
    }

    const handleContinue = () => {
        if (address) {
            console.log(address)
            navigation.navigate('AddressMapSignUp', { address: address, sessionData: sessionData })
        } else {
            errorToast("Select any address first")
        }
    }


    const handleEdit = (address: any) => {
        if (addressRef.current) {
            addressRef.current?.focus()
            addressRef.current?.setAddressText(address.address)
        }
    }

    const onPress = (data: GooglePlaceData, details: any = null) => {
        let postalCode = '';
        if (details) {
            // Extract address components
            const addressComponents = details?.address_components;

            // Find the postal code component
            postalCode = addressComponents.find((component: any) =>
                component.types.includes("postal_code")
            )?.long_name;

            console.log('Postal Code: ', postalCode);
        } else {
            console.error('No details available');
        }
        setAddress({
            mainText: data.structured_formatting.main_text,
            secondaryText: data.structured_formatting.secondary_text,
            description: data.description,
            postalCode: postalCode,
        });
    }

    const renderItem = (address: { address: string }, index: number) => {
        // console.log("address : ", address.vicinity)
        const mainText = address.address?.split(',')[0]; // split address to main text and secondary
        let indesx = address.address.lastIndexOf(mainText) + (mainText.length - 1) //  index main text to extract secondary text
        const secondaryText = address.address.substring(indesx + 2) //  extracting secondary text by removing ',' and space

        return (
            <TouchableOpacity key={index} style={SAA.listItemContainer} onPress={() => handleEdit(address)}>
                <FontAwesomeIcon icon={faLocationDot} size={18} style={SAA.icon} />
                <View style={{ flex: 1 }}>
                    <Text style={[SAA.text, { color: palette.black }]}>{mainText}</Text>
                    <Text style={SAA.text}>{secondaryText}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white,
        }}>
            <ScrollView
                style={SAA.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>
                <View style={SAA.header}>
                    <H1 text={keywords.selectAddress} />
                    <Text style={SAA.message}>{keywords.addressMessage}</Text>
                </View>
                <AddressesSearchBar onPress={onPress} addressRef={addressRef} />
                <View style={SAA.listContainer}>
                    <H2 text={keywords.nearBy} style={SAA.nearbyText} />
                    <View style={SAA.locationContainer}>
                        {showLocationPermission &&
                            <View style={SAA.flexRow}>
                                <FontAwesomeIcon icon={faLocationCrosshairs} size={20} style={SAA.icon} />
                                <View style={SAA.textContainer}>
                                    <Text style={SAA.text}>{keywords.myCurrentLocation}</Text>
                                </View>
                            </View>}
                        {showLocationPermission &&
                            <TouchableOpacity style={SAA.enableButton} onPress={handleAllow}>
                                <Text style={SAA.enableText}>{keywords.enable}</Text>
                            </TouchableOpacity>}
                    </View>
                    <FlatList
                        data={nearbyAddresses}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => renderItem({ address: item.vicinity }, index, true)}
                    />
                </View>

            </ScrollView>
            {!inputFocused &&
                <View style={SAA.button}>
                    <Button text='Continue' onPress={handleContinue} variant='main' />
                </View>
            }
        </View>
    )
}

export default AddressesSignUp