import { palette } from "@/components/styles/theme";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { CCAS } from "./CreateConnectAccount.styles";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { keywords, states } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BottomSheets from "@/components/elements/BottomSheet";
import Button from "@/components/elements/Button/Button";
import TextField from "@/components/elements/Forms/TextField";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import ListingHeader from "../ListingHeader";
import DatePicker from 'react-native-date-picker'
import moment from "moment";
import H2 from "@/components/elements/H2";
import { FlatList } from "react-native-gesture-handler";
import { validatePhoneNumber, validatePostalCode } from "../../utils/regexValidation";
import { supabase } from "@/lib/supabase";
import { reduxDispatch, reduxSelect } from "@/types/reduxHooks";
import { usermetaUpdate } from "@/store/actions/usermetaActions";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from "@env";

const CreateConnectAccount = () => {
    const insets = useSafeAreaInsets();
    const dispatch = reduxDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const user = reduxSelect(state => state.usermeta);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [date, setDate] = useState<Date | null>(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phoneNumber: ''
    })
    const [errors, setErrors] = useState({
        date: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phoneNumber: ''
    })
    const ref = useRef<any>();


    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        }
    }, []);


    const updateUser = async () => {
        try {
            let { data, error } = await supabase
                .from('user_meta')
                .select(`
              id,
              email,
              user_name,
              first_name,
              last_name,
              street_address_line_1,
              street_address_line_2,
              city,
              state,
              postal_code,
              country,
              stripe_id,
              stripe_account_id,
              stripe_customer_id,
              bio,
              gender,
              height,
              weight,
              body_type,
              onboarding_complete,
              account_paused,
              user_picture:images!user_id(
                id,
                url_path
              ),
              favourites:listings_favourite!user_id(
                id
              )
            `)
                .eq('id', user.id)
                .select()

            if (error) throw new Error((error).message);
            if (data) {
                dispatch(usermetaUpdate(data[0]))
            };

        } catch (error) {
            console.log((error as Error).message)
        }
    };

    const createConnectAccount = async () => {
        if (date === null) {
            updateErrors('date', "Select your birth date");
        }
        else if (userDetail.address === "") {
            updateErrors('address', "Address is required");
        } else if (userDetail.city === "") {
            updateErrors('city', "City is required");
        } else if (userDetail.state === "") {
            updateErrors('state', "State is required");
        } else if (userDetail.postalCode === "") {
            updateErrors('postalCode', "Postal code is required");
        } else if (userDetail.phoneNumber === "") {
            updateErrors('phoneNumber', "Phone number is required");
        } else if (
            errors.address !== "" ||
            errors.city !== "" ||
            errors.phoneNumber !== "" ||
            errors.postalCode !== "" ||
            errors.state !== "" ||
            date === null
        ) {
            errorToast(keywords.addListingErrorMessage)
        } else {
            setErrors({ address: "", city: "", phoneNumber: "", postalCode: "", state: "", date: '' })


            setLoading(true)
            try {

                const dob = {
                    day: moment(date).date(),
                    month: moment(date).month() + 1,
                    year: moment(date).year()
                }

                const formData = new FormData();

                formData.append("userId", user.id);
                formData.append('email', user.email);
                formData.append('firstName', user.first_name);
                formData.append('lastName', user.last_name);
                formData.append('dob', JSON.stringify({
                    day: dob.day,
                    month: dob.month,
                    year: "2000",
                }));

                formData.append('address', JSON.stringify({
                    "line1": userDetail.address,
                    "city": userDetail.city,
                    "state": userDetail.state,
                    "postal_code": userDetail.postalCode,
                    "phone": userDetail.phoneNumber
                }));

                const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-connect?action=create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                    body: formData,
                });
                console.log("response  : , ", response)
                const parsedData: any = await response.json();
                console.log("parsed data : ", parsedData)

                if (parsedData?.error) {
                    setLoading(false)
                    errorToast(parsedData?.error || "Could not add account try again");
                    return
                }
                await updateUser();
                navigation.navigate('UploadIdentityDocument')
                setLoading(false)

            } catch (error: any) {
                setLoading(false)
                errorToast(error?.message || "Could not add account try again");
                console.log("Error creating new payment : ", error)
            }
        }
    }

    const updateUserDetail = (key: string, value: string) => {
        if (key === 'address' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'city' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'state' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'postalCode' && value.length > 0) {
            if (validatePostalCode(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid postal code")
            }
        } else if (key === 'phoneNumber' && value.length > 0) {
            if (validatePhoneNumber(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid phone number")
            }
        }
        setUserDetail((prev) => ({ ...prev, [key]: (key === 'phoneNumber' && value?.length > 0 && !value.startsWith('+')) ? `+${value}` : value }));
    }

    const updateErrors = (key: string, value: string) => {
        setErrors((prev) => ({ ...prev, [key]: value }));
    }

    const renderState = ({ item, index }: { item: string, index: number }) => (
        <View style={[CCAS.itemContainer, { borderBottomWidth: index === (states.length - 1) ? 0 : 1, }]} >
            <TouchableOpacity key={index} style={CCAS.item} onPress={() => {
                setSnapPoint(1);
                updateUserDetail('state', item)
            }}>
                <H2 text={item} style={{ fontSize: 14 }} />
            </TouchableOpacity>
        </View>
    )

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white,
            }}
        >
            <ListingHeader title={keywords.bankAccounts} headerType="others"/>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'android' ? 40 : 5} style={CCAS.flex1}>
                <ScrollView keyboardDismissMode="on-drag" style={{ flex: 1 }}>

                    <View style={CCAS.container}>
                        <H2 text={keywords.enterAddressInformation} />

                        {open &&
                            <DatePicker
                                modal
                                mode='date'
                                maximumDate={moment(new Date()).subtract(18, 'years').toDate()}
                                open={open}
                                date={date || moment(new Date()).subtract(18, 'years').toDate()}
                                onConfirm={(date) => {
                                    setOpen(false)
                                    setDate(date)
                                    updateErrors('date', '')
                                }}
                                onCancel={() => {
                                    setOpen(false)
                                }}
                            />
                        }

                        <Text onPress={() => setOpen(!open)} style={CCAS.dob}>
                            {date ? moment(date).format("DD-MM-YYYY") : keywords.dobPlaceholder}
                        </Text>

                        {errors.date && <Text style={CCAS.errorText}>{errors.date}</Text>}

                        <TextField
                            style={CCAS.input}
                            value={userDetail.address}
                            onChangeText={(value) => updateUserDetail('address', value)}
                            placeholder={keywords.addressPlaceholder}
                        />

                        {errors.address && <Text style={CCAS.errorText}>{errors.address}</Text>}

                        <TextField
                            style={CCAS.input}
                            value={userDetail.city}
                            onChangeText={(value) => updateUserDetail('city', value)}
                            placeholder={keywords.cityPlaceholder}
                        />

                        {errors.city && <Text style={CCAS.errorText}>{errors.city}</Text>}

                        <TouchableOpacity style={CCAS.stateInput} onPress={() => {
                            ref.current?.snapToIndex(1);
                            setSnapPoint('50%');
                        }}>
                            <Text style={CCAS.text}>{userDetail.state || keywords.statePlaceholder}</Text>
                            <FontAwesomeIcon size={16} icon={faChevronRight} />
                        </TouchableOpacity>

                        {errors.state && <Text style={CCAS.errorText}>{errors.state}</Text>}

                        <TextField
                            style={CCAS.input}
                            value={userDetail.postalCode}
                            onChangeText={(value) => updateUserDetail('postalCode', value.trim())}
                            placeholder={keywords.postalCodePlaceholder}
                        />
                        {errors.postalCode && <Text style={CCAS.errorText}>{errors.postalCode}</Text>}
                        <TextField
                            style={CCAS.input}
                            value={userDetail.phoneNumber}
                            onChangeText={(value) => updateUserDetail('phoneNumber', value)}
                            placeholder={keywords.phoneNumberPlaceholder}
                            keyboardType={'phone-pad' as 'phone-pad'}

                        />

                        {errors.phoneNumber && <Text style={CCAS.errorText}>{errors.phoneNumber}</Text>}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            {!keyboardVisible &&
                <View style={CCAS.button}>
                    <Button text={keywords.continue}
                        onPress={createConnectAccount}
                        variant="main" style={{ width: '50%' }}
                        loading={loading}
                    />
                </View>
            }
            <Toast config={toastConfig} />
            <BottomSheets bottomSheetRef={ref} handleSheetChanges={(index: number) => {
                if (index > 0) {
                    setSnapPoint(index);
                } else {
                    setSnapPoint(1);
                }
            }}
                snapPoint={snapPoint}
                setSnapPoint={setSnapPoint}>
                <FlatList
                    data={states}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderState}
                    showsVerticalScrollIndicator={false}
                />
            </BottomSheets>
        </View>
    )
}

export default CreateConnectAccount;