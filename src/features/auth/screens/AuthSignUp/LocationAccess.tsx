import Wrapper from "@/components/Wrapper";
import { palette } from "@/components/styles/theme";
import { ActivityIndicator, Dimensions, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { SUS } from "./AuthSignUp.styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/elements/Button/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParamListBase, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import H1 from "@/components/elements/H1";
import { keywords } from "../../utils/keywords";
import { checkLocationPermission, directToSetting, requestLocationPermission, requestPermission } from "@/utils/permissions";
import { useEffect, useState } from "react";
import GetLocation from "react-native-get-location";
import { isLocationEnabled } from "react-native-android-location-enabler";
import { signup } from "../../api/authSignUp";
import Geocoder from "react-native-geocoding";
import { reduxDispatch } from "@/types/reduxHooks";
import { authLogin } from "@/store/actions/authActions";
import { usermetaAdd } from "@/store/actions/usermetaActions";
import { settingsAdd } from "@/store/actions/settingsActions";
import { getSettings } from "@/features/settings/api/getSettings";

const LocationAccess = ({ route }: any) => {
    const payload = route.params;
    const dispatch = reduxDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const insets = useSafeAreaInsets();
    const [showLocationPermission, setShowLocationPermission] = useState<boolean | null>(null);
    const [userLocation, setUserLocation] = useState<{
        city?: string,
        postalCode?: string;
        state?: string;
        street?: string;
    }>();
    console.log("params daa in location access screen : ", payload)
    const isFocused = useIsFocused()

    useEffect(() => {
        checkLocationPermission().then(async response => {
            console.log("permisison resposne : ", response)
            if (!response) {
                setShowLocationPermission(true);
            } else if (response) {
                if (Platform.OS === 'android') {
                    const hasLocationEnabled = await isLocationEnabled();
                    setShowLocationPermission(!hasLocationEnabled)
                }
            }
        })
    }, [isFocused]);

    useEffect(() => {

        fetchUserLocation();
    }, []);

    const fetchUserLocation = async () => {
        requestPermission().then().catch()
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                Geocoder.from(location.latitude, location.longitude)
                    .then(json => {
                        let address, streetName, city, state, postalCode
                        for (let i = 0; i < json.results.length; i++) {
                            address = json.results[0].address_components;
                            streetName = address.find((component) => component.types.includes('route'));
                            city = address.find((component) => component.types.includes('locality'));
                            state = address.find((component) => component.types.includes('administrative_area_level_1'));
                            postalCode = address.find((component) => component.types.includes('postal_code'));
                            if (streetName?.long_name && postalCode?.long_name) {
                                break;
                            }
                        }
                        setUserLocation({ street: streetName?.long_name, city: city?.long_name, state: state?.long_name, postalCode: postalCode?.long_name });
                        setShowLocationPermission(false);
                    })
                    .catch(error => console.warn(error));
            })
            .catch(async error => {
                if (error.message === 'Authorization denied') {
                    await directToSetting()
                }
                console.log(error)
            })
    }

    const handleAllow = () => {
        requestLocationPermission().then(async res => {
            await fetchUserLocation();
        })
    }

    const handleSkip = async () => {
        signup({ ...payload, uid: payload.sessionData.uid }).then(async res => {
            console.log("Response : ", res);
            const userSettings = await getSettings(payload.sessionData.uid);

            dispatch(authLogin(payload.sessionData));
            dispatch(usermetaAdd(res[0]));
            dispatch(settingsAdd(userSettings));
        })
    }
    if (showLocationPermission) {
        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top,
                    backgroundColor: palette.white,
                }}
            >
                <Wrapper>
                    <View style={SUS.header}>
                        <TouchableOpacity
                            style={SUS.headerButton}
                            onPress={() => navigation.goBack()}
                        >
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                color={'#000'}
                                size={16}
                            />
                        </TouchableOpacity>

                        <View style={[SUS.progressLine, { borderColor: palette.darkBlue }]} />
                        <View style={[SUS.progressLine, { borderColor: palette.darkBlue }]} />
                        <View style={SUS.progressContainer}>
                            <View style={SUS.halfColoredLine} />
                            <View style={SUS.remainingLine} />
                        </View>
                    </View>
                    <Image source={require('../../assets/location.png')} style={SUS.locationImage} />
                </Wrapper>

                <View style={SUS.mainContainer}>

                    <H1 text={keywords.allowLocation} />
                    <Text style={SUS.locationMessage}>{keywords.locationMessage}</Text>

                    <View style={SUS.submissionContainer}>
                        <View style={{
                            width: '100%',
                            height: 40,
                            marginVertical: 10,
                        }}>
                            <Button text="Allow" onPress={handleAllow} variant="main" />
                        </View>
                        <TouchableOpacity style={SUS.skipButton} onPress={handleSkip}>
                            <Text style={SUS.skipButtonText}>{keywords.skip}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    } else {
        console.log(userLocation)
        signup({ ...payload, uid: payload.sessionData.uid, ...userLocation }).then(async res => {
            console.log("Response : ", res[0]);
            const userSettings = await getSettings(payload.sessionData.uid);

            dispatch(authLogin(payload.sessionData));
            dispatch(usermetaAdd(res[0]));
            dispatch(settingsAdd(userSettings));
        })
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }
};

export default LocationAccess;
