import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geocoder from 'react-native-geocoding';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AMS from './AddressMap.styles';
import AddressesHeader from '../AddressesHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import H2 from '@/components/elements/H2';
import TextField from '@/components/elements/Forms/TextField';
import Button from '@/components/elements/Button/Button';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { saveAddress } from '../../api/saveAddress';
import { reduxSelect } from '@/types/reduxHooks';
import { errorToast, toastConfig } from '@/lib/toastConfig'
import { updateAddress } from '../../api/updateAddress';
import Toast from 'react-native-toast-message';
import { keywords } from '../../utils/keywords';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { validatePostalCode } from '@/features/addListing/utils/regexValidation';


const AddressMap = ({ route }: any) => {
    const insets = useSafeAreaInsets();
    const { address, isEdit }: { address: any, isEdit: any } = route.params;
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const uid = reduxSelect(state => state.auth.uid);
    const [suiteText, setSuiteText] = useState(isEdit === true ? address.apartment_suite : isEdit?.apartment_suite || '');
    const [instruction, setInstruction] = useState(isEdit === true ? address.delivery_hand_off_instructions : isEdit?.delivery_hand_off_instructions || '');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [postalCode, setPostalCode] = useState(address?.postalCode || '')
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();


    useEffect(() => {
        console.log("address : ", address)
        console.log("is edit : ", isEdit)
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener?.remove();
            keyboardHideListener?.remove();
        }
    }, [])

    useEffect(() => {
        if (isEdit?.address === '' && address?.postalCode && !validatePostalCode(address?.postalCode)) {
            setError(keywords.invalidPostalCode)
        }
        if (address?.postalCode === undefined || !validatePostalCode(address?.postalCode)) {
            setError(keywords.invalidPostalCode)
        }
        Geocoder.from(address.description).then(res => {
            if (res.status === 'OK') {
                setLocation(res.results[0].geometry?.location);
            } else {
                console.log("location lat/lng cannot be found")
            }
        }).catch(error => {
            console.log("Error getting lat/lon  : ", error);
        })
    }, [])

    const handleSave = async () => {
        setIsLoading(true)
        if (isEdit?.address === '') {
            if (error !== "") {
                errorToast(keywords.invalidPostalCode);
                setIsLoading(false)
                return
            }
            console.log("saving address")
            await saveAddress(
                uid!,
                address.description + "#" + address.mainText + "#" + address.secondaryText,
                location.lat,
                location.lng,
                suiteText,
                instruction,
                postalCode
            )
            setIsLoading(false)
        } else {
            console.log("updating address")
            await updateAddress(
                isEdit.address_id || address.address_id,
                address.description + "#" + address.mainText + "#" + address.secondaryText,
                location.lat,
                location.lng,
                suiteText,
                instruction,
                postalCode
            )
            setIsLoading(false)
        }

        navigation.goBack();
        if (navigation.getState().routes.length === 1) {
            navigation.goBack();
        }
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white,
        }}>
            <AddressesHeader headerTitle={isEdit ? keywords.editAddress : keywords.addressInfo} headerType='map' />
            <MapView
                provider={PROVIDER_GOOGLE}
                style={AMS.map} region={{
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.1,
                }}
            >
                <Marker
                    icon={{}}
                    key={0}
                    coordinate={{
                        latitude: location.lat,
                        longitude: location.lng
                    }}
                    title={address.secondaryText}
                />
            </MapView>
            <KeyboardAvoidingView style={AMS.descriptionContainer} behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
                <ScrollView keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false}>
                    <View style={AMS.addressDetail}>
                        <FontAwesomeIcon icon={faLocationDot} size={25} />
                        <View style={AMS.addressText}>
                            <Text style={AMS.mainText}>{address.mainText}</Text>
                            <Text style={AMS.secondaryText}>{address.secondaryText}</Text>
                        </View>
                    </View>

                    {/*                     

                    <H2 text={keywords.city} />
                    <TextField
                        value={city}
                        onChangeText={setCity}
                        placeholder={keywords.cityPlaceholder}
                        style={AMS.suitInput}
                    />
                    <H2 text={keywords.state} />
                    <TextField
                        value={state}
                        onChangeText={setState}
                        placeholder={keywords.statePlaceholder}
                        style={AMS.suitInput}
                    />

                    */}


                    {(address?.postalCode === undefined || !validatePostalCode(address?.postalCode)) &&
                        <>
                            <H2 text={keywords.postalCode} />
                            <TextField
                                value={postalCode}
                                onChangeText={(code) => {
                                    if (validatePostalCode(code)) {
                                        setError("")
                                    } else {
                                        setError(keywords.invalidPostalCode)
                                    }
                                    setPostalCode(code)
                                }}
                                placeholder={keywords.postalCodePlaceholder}
                                style={AMS.suitInput}
                            />
                            {error && <Text style={AMS.errorText}>{error}</Text>}
                        </>
                    }
                    { }
                    <H2 text={keywords.apprtmentSuit} />
                    <TextField
                        value={suiteText}
                        onChangeText={setSuiteText}
                        placeholder={keywords.apprtmentSuitPlaceholder}
                        style={AMS.suitInput}
                    />
                    <H2 text={keywords.deliveryHandOffIntruction} />
                    <TextField
                        value={instruction}
                        onChangeText={setInstruction}
                        placeholder={keywords.deliveryHandOffIntructionPlaceholder}
                        style={AMS.instructionInput}
                        multiline
                    />
                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>
            {!keyboardVisible &&
                < View style={AMS.button}>
                    <Button text={(isEdit?.address === '') ? keywords.save : keywords.saveAddress} onPress={handleSave} variant='main' loading={isLoading} />
                </View>
            }
            <Toast config={toastConfig} />
        </View >
    )
}

export default AddressMap