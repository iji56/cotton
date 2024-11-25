import { palette } from "@/components/styles/theme";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { reduxSelect } from "@/types/reduxHooks";
import React, { useEffect, useRef, useState } from "react";
import { SCBA } from "./CreateBankAccount.styles";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { keywords } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BottomSheets from "@/components/elements/BottomSheet";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env'
import Button from "@/components/elements/Button/Button";
import TextField from "@/components/elements/Forms/TextField";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import ListingHeader from "../ListingHeader";
import { validateBankNumber, validateRoutingNumber } from "../../utils/regexValidation";
import H2 from "@/components/elements/H2";

const CreateBankAccount = ({ route }: any) => {
    const showStep = route.params?.showStep; // you can use this flag to perform any task when you navigate from banks screen e.g. to show steps, Step 4: 
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const user = reduxSelect(state => state.usermeta);
    // const [snapPoint, setSnapPoint] = useState<number | string>(1);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [userDetail, setUserDetail] = useState({
        // name: '',
        country: 'CA',
        currency: 'CAD',
        bank: '',
        routing: '',
        accountNumber: '',
        // type: '',
    })
    const [errors, setErrors] = useState({
        // name: '',
        // country: '',
        // currency: '',
        routing: '',
        bank: '',
        accountNumber: '',
        // type: '',
    });
    const [loading, setLoading] = useState(false);
    const ref = useRef<any>();

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        }
    }, []);

    const addBankAccount = async () => {
        // if (userDetail.name === "") {
        //     updateErrors('name', "Account title is required");
        // } else
        if (userDetail.routing === "") {
            updateErrors('routing', "Routing number is required");
        } else if (userDetail.accountNumber === "") {
            updateErrors('accountNumber', "Account number is required");
        } else if (
            // errors.name !== "" ||
            errors.routing !== "" ||
            errors.accountNumber !== ""
        ) {
            errorToast(keywords.addListingErrorMessage)
        } else {
            setErrors({ routing: "", bank: '', accountNumber: "" })
            setLoading(true)
            try {
                const payload = {
                    country: userDetail.country.trim(),
                    currency: userDetail.currency.trim(),
                    // account_holder_name: userDetail.name,
                    account_holder_type: 'individual',
                    routing_number: userDetail.routing.trim(),
                    account_number: userDetail.accountNumber.trim(),
                }
                console.log(payload)
                const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-bank-account-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({ ...payload }),
                });
                const parsedData: any = await response.json();
                console.log("parsed data : ", parsedData, payload)

                if (parsedData?.error) {
                    setLoading(false)
                    errorToast(parsedData.error);
                    return
                }
                const bankAccountToken = parsedData?.token?.id;
                console.log("Bank account token : ", bankAccountToken)
                if (bankAccountToken) {
                    try {
                        const savePaymentMethodResponse = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-external-account`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                            },
                            body: JSON.stringify({
                                accountId: user.stripe_account_id,
                                externalAccount: bankAccountToken
                            }),
                        });
                        const data = await savePaymentMethodResponse.json();
                        console.log("add bank account response  : ", data)
                        if (data?.error) {
                            errorToast(data.error)
                        }

                        setLoading(false)
                        // setUserDetail({
                        //     name: '',
                        //     country: '',
                        //     currency: '',
                        //     type: '',
                        //     routing: '',
                        //     accountNumber: ''
                        // })
                        navigation.navigate("BankAccounts")
                    } catch (error) {
                        setLoading(false)
                        console.log("Error in create payment method api: ", error)
                    }
                } else {
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
                console.log("Error creating new payment : ", error)
            }
        }
    }

    const updateUserDetail = (key: string, value: string) => {
        if (key === 'name' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'routing' && value.length > 0) {
            if (validateRoutingNumber(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid transit number")
            }
        } else if (key === 'bank' && value.length > 0) {
            if (validateBankNumber(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid bank number")
            }
        } else if (key === 'accountNumber') {
            if (value.length > 4 && value.length < 13) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid bank number")
            }
        }
        setUserDetail((prev) => ({
            ...prev, [key]: value
            // key === 'routing' ?
            //     value.length === 5 ? value.includes('-') ? value.replace('-', '') : value.length < userDetail[key].length ? value.replace('-', '') : `${value}-` : 
            //         value.length === 6 ? value.includes('-') ? value.replace('-', '') : value.length < userDetail[key].length ? value.replace('-', '') : `${userDetail[key]}-${value.slice(value.length-2, -1)}` :
            //             value :
            //     value
        }));
    }

    const updateErrors = (key: string, value: string) => {
        setErrors((prev) => ({ ...prev, [key]: value }));
    }

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
            {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'android' ? 40 : 5}
                style={{
                    flex: 1,
                }}> */}
            <ListingHeader title={keywords.bankAccounts} headerType='createBank' goBack={showStep || false} />
            <ScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={{ marginHorizontal: 20, }}>
                    <H2 text={keywords.addBankInformation} style={{ marginVertical: 10 }} />
                    {/* <TextField
                        style={SCBA.input}
                        value={userDetail.name}
                        onChangeText={(value) => updateUserDetail('name', value)}
                        placeholder={`${user.user_name}'s ${keywords.namePlaceholder}`}
                    /> */}

                    {/* {errors.name && <Text style={SCBA.errorText}>{errors.name}</Text>} */}

                    <TextField
                        style={SCBA.input}
                        value={userDetail.country}
                        onChangeText={(value) => updateUserDetail('country', value)}
                        placeholder={keywords.countryPlaceholder}
                        disable={true}
                        min={2}
                    />
                    <TextField
                        style={SCBA.input}
                        value={userDetail.currency}
                        onChangeText={(value) => updateUserDetail('currency', value)}
                        placeholder={keywords.currencyPlaceholder}
                        disable={true}
                    />
                    <TextField
                        style={SCBA.input}
                        value={userDetail.routing}
                        onChangeText={(value) => updateUserDetail('routing', value)}
                        placeholder={keywords.routingPlaceholder}
                        keyboardType={'phone-pad'}
                    />

                    {errors.routing && <Text style={SCBA.errorText}>{errors.routing}</Text>}

                    <TextField
                        style={SCBA.input}
                        value={userDetail.bank}
                        onChangeText={(value) => updateUserDetail('bank', value)}
                        placeholder={keywords.bankPlaceholder}
                        keyboardType={'phone-pad'}
                    />

                    {errors.bank && <Text style={SCBA.errorText}>{errors.bank}</Text>}

                    <TextField
                        style={SCBA.input}
                        value={userDetail.accountNumber}
                        onChangeText={(value) => updateUserDetail('accountNumber', value)}
                        placeholder={keywords.accountNumberPlaceholder}
                        keyboardType={'phone-pad'}
                    />

                    {errors.accountNumber && <Text style={SCBA.errorText}>{errors.accountNumber}</Text>}
                    {/* 
                        <TouchableOpacity style={SCBA.stateInput} onPress={() => {
                            ref.current?.snapToIndex(1);
                            setSnapPoint('30%');
                        }}>
                            <Text style={SCBA.text}>{userDetail.type || keywords.typePlaceholder}</Text>
                            <FontAwesomeIcon size={16} icon={faChevronRight} />
                        </TouchableOpacity>

                        {errors.type && <Text style={SCBA.errorText}>{errors.type}</Text>} */}

                </View>
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
            {!keyboardVisible &&
                <View style={SCBA.button}>
                    <Button text={keywords.addBankAccount}
                        onPress={addBankAccount}
                        variant="main"
                        style={{ width: '50%' }}
                        loading={loading}
                    />
                </View>
            }
            {/* <BottomSheets bottomSheetRef={ref} handleSheetChanges={(index: number) => {
                if (index > 0) {
                    setSnapPoint(index);
                } else {
                    setSnapPoint(1);
                }
            }}
                snapPoint={snapPoint}
                setSnapPoint={setSnapPoint}>

                <View style={[SCBA.itemContainer, { borderBottomWidth: 1, }]} >
                    <TouchableOpacity style={SCBA.item} onPress={() => {
                        setSnapPoint(1);
                        updateUserDetail('type', keywords.individual)
                    }}>
                        <H2 text={keywords.individual} style={{ fontSize: 14 }} />
                    </TouchableOpacity>
                </View>

                <View style={SCBA.itemContainer} >
                    <TouchableOpacity style={SCBA.item} onPress={() => {
                        setSnapPoint(1);
                        updateUserDetail('type', keywords.company)
                    }}>
                        <H2 text={keywords.company} style={{ fontSize: 14 }} />
                    </TouchableOpacity>
                </View>
            </BottomSheets> */}
            <Toast config={toastConfig} />
        </View>
    )
}

export default CreateBankAccount