import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import TextField from '@/components/elements/Forms/TextField';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import SettingsHeader from '../../components/SettingsHeader';
import Loader from '@/components/elements/Loader';
import { keywords } from '../../utils/keywords';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { Details } from '@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { reduxDispatch, reduxSelect } from '@/types/reduxHooks';
import { supabase } from '@/lib/supabase';
import { usermetaUpdate } from '@/store/actions/usermetaActions';
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env';
import { errorToast, successToast, toastConfig } from '@/lib/toastConfig';
import { colors } from '@/global/colors';
import Button from '@/components/elements/Button/Button';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCPM } from './CreatePaymentMethod.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import BottomSheets from '@/components/elements/BottomSheet';
import { states } from '@/features/addListing/utils/keywords';
import H2 from '@/components/elements/H2';
import { validatePhoneNumber, validatePostalCode } from '@/features/addListing/utils/regexValidation';
import { validateEmail } from '@/features/auth/utils/validateEmail';
import { FlatList } from 'react-native-gesture-handler';
import { PaymentCard } from '../../types/payment';

const { width, height } = Dimensions.get('window');

const CreatePaymentMethod = ({ route }: any) => {
    const payment: PaymentCard | undefined = route?.params?.payment;
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { createPaymentMethod } = useStripe();
    const dispatch = reduxDispatch();
    const uid = reduxSelect(state => state.auth.uid);
    const user = reduxSelect(state => state.usermeta);
    const customerId = reduxSelect(state => state.usermeta.stripe_customer_id);
    const insets = useSafeAreaInsets();
    const [snapPoint, setSnapPoint] = useState<number | string>(1);
    const [cardDetails, setCardDetail] = useState<Details | null>(null)
    const [userDetail, setUserDetail] = useState({
        email: payment?.billing_details?.email || '',
        phone: payment?.billing_details?.phone || '',
        city: payment?.billing_details?.address.city || '',
        country: 'CA',
        lane1: payment?.billing_details?.address.line1 || '',
        postalCode: payment?.billing_details?.address.postal_code || '',
        state: payment?.billing_details?.address.state || '',
    });
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        city: '',
        country: '',
        lane1: '',
        postalCode: '',
        state: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const ref = useRef<any>();


    useFocusEffect(
        React.useCallback(() => {
            if (!customerId) {
                createCustomerAccount().then().catch()
            }
            updateUser();

            return () => { };
        }, [])
    );

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
                .eq('id', uid)
                .select()

            if (error) throw new Error((error).message);
            if (data) {
                dispatch(usermetaUpdate(data[0]))
                setError(null);
            };

        } catch (error) {
            console.log((error as Error).message)
            setError((error as Error).message)
        }
    };


    const addPayment = async () => {
        if (userDetail.email === "") {
            updateErrors('email', "Email address is required");
        } else if (userDetail.phone === "") {
            updateErrors('phone', "Phone number is required");
        } else if (userDetail.city === "") {
            updateErrors('city', "City is required");
        } else if (userDetail.country === "") {
            updateErrors('country', "Country is required");
        } else if (userDetail.lane1 === "") {
            updateErrors('lane1', "Address is required");
        } else if (userDetail.postalCode === "") {
            updateErrors('postalCode', "Postal code is required");
        } else if (userDetail.state === "") {
            updateErrors('state', "State is required");
        } else if (
            errors.email !== "" ||
            errors.lane1 !== "" ||
            errors.city !== "" ||
            errors.phone !== "" ||
            errors.postalCode !== "" ||
            errors.state !== ""
        ) {
            errorToast(keywords.addListingErrorMessage)
        } else {
            setErrors({ email: "", city: "", phone: "", postalCode: "", state: "", lane1: "", country: "CA" })
            setLoading(true)
            try {

                const billingDetails = {
                    email: userDetail.email,
                    phone: userDetail.phone,
                    address: {
                        city: userDetail.city,
                        country: userDetail.country,
                        line1: userDetail.lane1,
                        state: userDetail.state,
                        postalCode: userDetail.postalCode
                    }
                }


                console.log("billing details : ", billingDetails)

                if (payment) {
                    let payload = JSON.stringify({
                        paymentMethodId: payment.id,
                        billingDetails: {
                            ...billingDetails,
                            address: {
                                city: billingDetails.address.city,
                                country: billingDetails.address.country,
                                line1: billingDetails.address.line1,
                                state: billingDetails.address.state,
                                "postal_code": billingDetails.address.postalCode,  // use postal_code instead of postalCode
                            }
                        }
                    });

                    console.log("Payload  : ", payload)
                    try {
                        let response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/update-payment-method`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                            },
                            body: payload
                        });
                        let parseData = await response.json();
                        console.log("updated address respone  : ", parseData)
                        setLoading(false)
                        if (parseData?.success) {
                            successToast("Successfully updated payment info")
                            setTimeout(() => {
                                navigation.goBack()
                            }, 1000)
                        }
                    } catch (error) {
                        setLoading(false)
                        console.log("Error updating payment : ", error)
                        return;
                    }

                } else {

                    const createPaymentResponse = await createPaymentMethod({
                        paymentMethodType: 'Card',
                        paymentMethodData: {
                            billingDetails: billingDetails
                        }
                    });

                    console.log(createPaymentResponse)
                    if (createPaymentResponse?.error) {
                        setLoading(false)
                        errorToast(createPaymentResponse.error.message);
                        return
                    }

                    const paymentMethodId = createPaymentResponse.paymentMethod?.id;
                    if (paymentMethodId) {
                        try {
                            const savePaymentMethodResponse = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-customer-payment-method`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                                },
                                body: JSON.stringify({
                                    customerId: customerId,
                                    paymentMethodId: paymentMethodId,
                                }),
                            });

                            const data = await savePaymentMethodResponse.json();
                            console.log("data : ", data)
                            setLoading(false)
                            if (data?.success) {
                                successToast("Successfully created payment method")
                                setTimeout(() => {
                                    navigation.goBack()
                                }, 1000)
                            } else {
                                errorToast(data?.message || "Error in creating payment! try again");
                            }
                        } catch (error) {
                            setLoading(false)
                            console.log("Error in create payment method api: ", error)
                        }
                    } else {
                        setLoading(false)
                    }
                }
            } catch (error) {
                setLoading(false)
                console.log("Error creating new payment : ", error)
            }
        }
    }

    const createCustomerAccount = async () => {
        try {
            const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-customer`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    email: user.email,
                    name: `${user.first_name} ${user.last_name}`,
                    userId: user.id,
                })
            });
            console.log("response :", response);
            const data = await response.json();
            console.log(data)
            if (data?.success) {
                await updateUser()
            } else {
                errorToast(data?.message || "unable to create account! try again")
            }
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }

    const updateUserDetail = (key: string, value: string) => {
        if (key === 'email' && value.length > 0) {
            if (validateEmail(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid email address")
            }
        } else if (key === 'name' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'city' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'lane1' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'lane2' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'state' && value.length > 0) {
            updateErrors(key, "")
        } else if (key === 'postalCode' && value.length > 0) {
            if (validatePostalCode(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid postal code")
            }
        } else if (key === 'phone' && value.length > 0) {
            if (validatePhoneNumber(value)) {
                updateErrors(key, "")
            } else {
                updateErrors(key, "Invalid phone number")
            }
        }
        setUserDetail((prev) => ({ ...prev, [key]: (key === 'phone' && value?.length > 0 && !value.startsWith('+')) ? `+${value}` : value }));
    }

    const updateErrors = (key: string, value: string) => {
        setErrors((prev) => ({ ...prev, [key]: value }));
    }


    const renderState = ({ item, index }: { item: string, index: number }) => (
        <View style={[SCPM.itemContainer, { borderBottomWidth: index === (states.length - 1) ? 0 : 1, }]} >
            <TouchableOpacity key={index} style={SCPM.item} onPress={() => {
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
            <SettingsHeader headerTitle={payment ? keywords.updatePaymentMethod : keywords.createPaymentMethod} />
            {loading ?
                <Loader /> :

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{
                        flex: 1
                    }}>
                    <ScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                        {!payment &&
                            <CardField
                                postalCodeEnabled={false}
                                onCardChange={(cardDetails) => {
                                    console.log('card details', cardDetails);
                                    setCardDetail(cardDetails);
                                }}
                                cardStyle={{ textColor: colors.background }}
                                style={{ height: height * 0.1 }}
                            />
                        }
                        <View style={{ marginHorizontal: 20, }}>
                            <TextField
                                style={SCPM.input}
                                value={userDetail.email}
                                onChangeText={(value) => updateUserDetail('email', value)}
                                placeholder={keywords.emailPlaceholders}
                                keyboardType={'email-address'}
                            />

                            {errors.email && <Text style={SCPM.errorText}>{errors.email}</Text>}

                            <TextField
                                style={SCPM.input}
                                value={userDetail.phone}
                                onChangeText={(value) => updateUserDetail('phone', value)}
                                placeholder={keywords.phonePlaceholder}
                                keyboardType={'phone-pad'}
                            />

                            {errors.phone && <Text style={SCPM.errorText}>{errors.phone}</Text>}

                            <TextField
                                style={SCPM.input}
                                value={userDetail.city}
                                onChangeText={(value) => updateUserDetail('city', value)}
                                placeholder={keywords.cityPlaceholder}
                            />

                            {errors.city && <Text style={SCPM.errorText}>{errors.city}</Text>}

                            <TextField
                                style={SCPM.input}
                                value={userDetail.country}
                                onChangeText={(value) => updateUserDetail('country', value)}
                                placeholder={keywords.countryPlaceholder}
                                disable={true}
                                min={2}
                            />
                            <TextField
                                style={SCPM.input}
                                value={userDetail.lane1}
                                onChangeText={(value) => updateUserDetail('lane1', value)}
                                placeholder={keywords.lane1Placeholder}
                            />

                            {errors.lane1 && <Text style={SCPM.errorText}>{errors.lane1}</Text>}

                            <TextField
                                style={SCPM.input}
                                value={userDetail.postalCode}
                                onChangeText={(value) => updateUserDetail('postalCode', value.trim())}
                                placeholder={keywords.postalCodePlaceholder}
                            />

                            {errors.postalCode && <Text style={SCPM.errorText}>{errors.postalCode}</Text>}

                            <TouchableOpacity style={SCPM.stateInput} onPress={() => {
                                ref.current?.snapToIndex(1);
                                setSnapPoint('60%');
                            }}>
                                <Text style={SCPM.text}>{userDetail.state || keywords.statePlaceholder}</Text>
                                <FontAwesomeIcon size={16} icon={faChevronRight} />
                            </TouchableOpacity>

                            {errors.state && <Text style={SCPM.errorText}>{errors.state}</Text>}

                        </View>
                        <View style={SCPM.button}>
                            <Button text={!payment ? keywords.addPayment : keywords.updatePayment}
                                onPress={addPayment}
                                variant="main" style={{ width: '50%' }}
                                loading={loading} />
                        </View>
                    </ScrollView>
                    <View style={{ height: 20 }} />
                </KeyboardAvoidingView>
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
                <FlatList
                    data={states}
                    contentContainerStyle={{flexGrow: 1}}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderState}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                />
            </BottomSheets>
            <Toast config={toastConfig} />
        </View>
    )
}

export default CreatePaymentMethod