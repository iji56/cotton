import { Keyboard, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geocoder from 'react-native-geocoding';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SUS } from './SignUp.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import TextField from '@/components/elements/Forms/TextField';
import Button from '@/components/elements/Button/Button';
import { reduxDispatch } from '@/types/reduxHooks';
import { toastConfig } from '@/lib/toastConfig'
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { saveAddress } from '@/features/addresses/api/saveAddress';
import { keywords } from '../../utils/keywords';
import AddressesHeader from '@/features/addresses/components/AddressesHeader';
import { authLogin } from '@/store/actions/authActions';
import { updateAddress } from '@/features/addresses/api/updateAddress';


const AddressMapNewSignIn = ({ route }: any) => {
    const dispatch = reduxDispatch();
    const insets = useSafeAreaInsets();
    const { address, isEdit, sessionData }: { address: any, isEdit: any, sessionData: any } = route.params;
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [suiteText, setSuiteText] = useState(isEdit === true ? address.apartment_suite : isEdit?.apartment_suite || '');
    const [instruction, setInstruction] = useState(isEdit === true ? address.delivery_hand_off_instructions : isEdit?.delivery_hand_off_instructions || '');
    const [loading, setLoading] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setInputFocused(true));
        const keyboradDidHideListener = Keyboard.addListener('keyboardDidHide', () => setInputFocused(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboradDidHideListener.remove()

        }
    }, []);

    useEffect(() => {
        Geocoder.from(address.description).then(res => {
            if (res.status === 'OK') {
                setLocation(res.results[0].geometry.viewport.northeast);
            }
        }).catch(error => {
            console.log("Error getting lat/lon  : ", error);
        })
    }, [])

    const handleSave = async () => {
        setLoading(true);
        if (isEdit?.address === '') {
            await saveAddress(
                sessionData?.uid!,
                address.description + "#" + address.mainText + "#" + address.secondaryText,
                location.lat,
                location.lng,
                suiteText,
                instruction,
                address?.postalCode || ""
            )
        } else {
            await updateAddress(
                isEdit.address_id || address.address_id,
                address.description + "#" + address.mainText + "#" + address.secondaryText,
                location.lat,
                location.lng,
                suiteText,
                instruction,
                address?.postalCode || ""
            )
        }
        setLoading(false);
        dispatch(authLogin(sessionData));
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
            <AddressesHeader headerTitle={!isEdit ? keywords.editAddress : keywords.addressInfo} headerType='map' />
            <MapView
                provider={PROVIDER_GOOGLE}
                style={SUS.map} region={{
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
                    title={'marker.title'}
                />
            </MapView>
            <View style={SUS.descriptionContainer}>
                <View style={SUS.addressDetail}>
                    <FontAwesomeIcon icon={faLocationDot} size={25} />
                    <View style={SUS.addressText}>
                        <Text style={SUS.mainText}>{address.mainText}</Text>
                        <Text style={SUS.secondaryText}>{address.secondaryText}</Text>
                    </View>
                </View>
                <TextField
                    value={suiteText}
                    onChangeText={setSuiteText}
                    placeholder={keywords.apartment}
                    onBlur={() => { }}
                    style={SUS.suitInput}
                    autoCapitalize='none'
                />
                <TextField
                    value={instruction}
                    onChangeText={setInstruction}
                    placeholder={keywords.deliverHandOff}
                    onBlur={() => { }}
                    style={SUS.instructionInput}
                    multiline
                    autoCapitalize='none'
                />
            </View>
            {!inputFocused &&
                <View style={SUS.button}>
                    <Button
                        text={(isEdit?.address === '') ? keywords.save : keywords.update}
                        onPress={handleSave}
                        variant='main'
                        loading={loading} />
                </View>
            }
            <Toast config={toastConfig} />
        </View>
    )
}
export default AddressMapNewSignIn