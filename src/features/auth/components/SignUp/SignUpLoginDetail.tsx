import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import H1 from '@/components/elements/H1';
import { keywords, privacyPolicyText, termsAndConditionText } from '../../utils/keywords';
import { Controller, useForm } from "react-hook-form";
import TextField from '@/components/elements/Forms/TextField';
import { SUS } from './SignUp.styles';
import Button from '@/components/elements/Button/Button';
import { validateEmail } from '../../utils/validateEmail';
import { hasDigit, hasLetter, validatePassword } from '../../utils/validatePassword';
import { errorToast } from '@/lib/toastConfig';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { authSignIn } from '../../api/authSignIn';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import TermsModal from '../TermsModal';
import { ModalContext } from '../../context/ModalContext';
import { signup } from '../../api/authSignUp';
import { getSettings } from '@/features/settings/api/getSettings';
import { authLogin } from '@/store/actions/authActions';
import { usermetaAdd } from '@/store/actions/usermetaActions';
import { settingsAdd } from '@/store/actions/settingsActions';
import { PropType } from '../../types/usermetaReducerType';
import { reduxDispatch } from '@/types/reduxHooks';
import { checkLocationPermission, requestLocationPermission } from '@/utils/permissions';
import { NotificationListener, requestUserPermission } from '@/features/notifications/pushnotification_helper';
import { getUsermeta } from '../../api/getUsermeta';

type FormPropType = {
    email: string;
    password: string;
    cpassword: string;
}

const SignUpLoginDetail = ({ index, setIndex }: PropType) => {
    const { image, username, name, setModalVisible, setSessionData, } = useContext(ModalContext);
    const dispatch = reduxDispatch();
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [validateRule1, setValidateRule1] = useState(false)
    const [validateRule2, setValidateRule2] = useState(false)
    const [validateRule3, setValidateRule3] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [privacy, setPrivacy] = useState(true);
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        setError,
        clearErrors,
        watch,
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
            cpassword: '',
        },
    });

    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false,
        cpassword: false
    });

    const [isChecked, setIsChecked] = useState({
        privacyPolicy: false,
        termsAndCondition: false,
    })

    const emailValidation = (email: string) => {
        if (validateEmail(email)) {
            clearErrors('email');
        } else {
            if (email.length === 0) {
                clearErrors('email')
            } else {
                setError('email', { type: 'pattern', message: "Invalid email" })
            }
        }
    }

    const passwordValidation = (password: string) => {
        const confirmPassword = watch("cpassword")
        console.log(password, confirmPassword)
        setValidateRule1(password.length > 7)
        setValidateRule2(hasDigit(password))
        setValidateRule3(hasLetter(password))
        if (validatePassword(password)) {
            clearErrors('password')
        } else {

            if (password.length === 0) {
                clearErrors('password')
            } else {
                setError('password', { type: 'pattern', message: "Invalid Password" })
            }
        }

        if (password !== confirmPassword) {
            setError('cpassword', { type: 'pattern', message: "Password does not match" });
        } else {
            clearErrors('cpassword');
        }
    }

    const ConfirmPasswordValidation = (password: string) => {
        const confirmPassword = watch("password")

        if (password !== confirmPassword) {
            // setError('cpassword', { type: 'pattern', message: "Password does not match" });
        } else {
            clearErrors('cpassword');
        }
    }


    const nextPage = async (formData: FormPropType) => {
        let payload = {
            email: normalizeWhitespaces(formData.email),
            password: formData.password,
            userImage: image!,
            username: username,
            name: name,
            gender: ''
        }
        setIsLoading(true)
        // sign up
        const actionType = 'signup'
        authSignIn({ userEmail: payload.email, userPassword: payload.password, actionType }).
            then(session => {
                setSessionData(session);
                // save user image and detail then save user meta

                signup({ ...payload, uid: session.uid }).then(async res => {
                    NotificationListener();
                    const usermeta = await getUsermeta(session.uid);
                    await requestUserPermission('', res[0]?.id);
                    console.log("Response : ", res);
                    const userSettings = await getSettings(session.uid);

                    dispatch(usermetaAdd(usermeta));
                    dispatch(settingsAdd(userSettings));
                    // check location permission

                    const hasLocationPermission = await checkLocationPermission();
                    if (hasLocationPermission) {
                        setIsLoading(false)
                        // navigate to feed screen
                        dispatch(authLogin(session));
                    } else {
                        await requestLocationPermission();
                        const hasLocationPermission = await checkLocationPermission();
                        if (hasLocationPermission) {
                            setIsLoading(false)
                            dispatch(authLogin(session));
                        } else {
                            setIsLoading(false)
                            setIndex(index + 1);
                        }
                    }
                }).catch(e => {
                    setIsLoading(false)
                })

            }).catch(error => {
                setIsLoading(false)
                errorToast(error?.message)
                console.log("Error while sign up : ", error);
                return;
            })
    }

    const handleFormSubmit = () => {
        if (control.getFieldState('email').invalid) {
            setError("password", { message: "Email is missing" })
            clearErrors('email');
        } else if (control.getFieldState('password').error) {
            setError("password", { message: "Invalid password" })
            clearErrors('email');
        }
        else if (control.getFieldState('cpassword').error) {
            setError("cpassword", { message: "password does not matching" })
            clearErrors('email');
        } else {
            clearErrors();
            if (!isChecked.privacyPolicy || !isChecked.termsAndCondition) {
                errorToast("Please check both privacy policy and terms and condition")
                return;
            } else {
                handleSubmit(nextPage)();
            }
        }
    }

    const toggleIcon = () => {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <View style={SUS.mainContainer}>
            <H1 text={keywords.enterLoginInfo} style={SUS.headerTitle} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='on-drag'>
                <View style={SUS.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[SUS.textInputContainer, { borderWidth: isFocused.email ? 1 : 0 }]}>
                                {isFocused.email && <Text style={SUS.label}>{keywords.email}</Text>}
                                <TextField
                                    value={value ?? ''}
                                    placeholder={keywords.email}
                                    onChangeText={(email) => {
                                        onChange(email);
                                        emailValidation(email)
                                    }}
                                    onBlur={() => {
                                        setIsFocused({ ...isFocused, email: false })
                                        onBlur()
                                    }}
                                    onFocus={() => setIsFocused({ ...isFocused, email: true })}

                                    style={[SUS.textInput, { height: isFocused.email ? 40 : 50 }]}
                                    autoCapitalize={'none'}
                                />
                            </View>
                        )}
                        name="email"
                    />
                    <Text style={SUS.error}>{errors?.email?.message || ''}</Text>
                </View>

                <View style={SUS.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[SUS.textInputContainer, { borderWidth: isFocused.password ? 1 : 0 }]}>
                                {isFocused.password && <Text style={SUS.label}>{keywords.password}</Text>}
                                <TextField
                                    secureTextEntry={passwordVisible}
                                    value={value ?? ''}
                                    placeholder={keywords.password}
                                    onChangeText={(password) => {
                                        onChange(password);
                                        passwordValidation(password)
                                    }}
                                    onBlur={() => {
                                        setIsFocused({ ...isFocused, password: false })
                                        onBlur()
                                    }}
                                    onFocus={() => setIsFocused({ ...isFocused, password: true })}

                                    style={[SUS.textInput, { height: isFocused.password ? 40 : 50 }]}
                                    autoCapitalize={'none'}
                                    icon={passwordVisible ? faEye : faEyeSlash}
                                    handleIconPress={toggleIcon}
                                />
                            </View>
                        )}
                        name="password"
                    />
                    <Text style={SUS.error}>{errors?.password?.message || ''}</Text>
                </View>

                <View style={SUS.bottomContainer}>
                    {validateRule1 ?
                        <Image source={require('../../assets/check.png')} style={SUS.logo} />
                        :
                        <View style={SUS.logo} />
                    }
                    <Text style={SUS.passwordHintText}>{keywords.passwordHint1}</Text>
                </View>
                <View style={SUS.bottomContainer}>
                    {validateRule2 ?
                        <Image source={require('../../assets/check.png')} style={SUS.logo} />
                        :
                        <View style={SUS.logo} />
                    }
                    <Text style={SUS.passwordHintText}>{keywords.passwordHint2}</Text>
                </View>
                <View style={SUS.bottomContainer}>
                    {validateRule3 ?
                        <Image source={require('../../assets/check.png')} style={SUS.logo} />
                        :
                        <View style={SUS.logo} />
                    }
                    <Text style={SUS.passwordHintText}>{keywords.passwordHint3}</Text>
                </View>

                <View style={SUS.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[SUS.textInputContainer, { borderWidth: isFocused.cpassword ? 1 : 0 }]}>
                                {isFocused.cpassword && <Text style={SUS.label}>{keywords.reEnterPassword}</Text>}
                                <TextField
                                    secureTextEntry={passwordVisible}
                                    value={value ?? ''}
                                    placeholder={keywords.reEnterPassword}
                                    onChangeText={(password) => {
                                        onChange(password);
                                        ConfirmPasswordValidation(password)
                                    }}
                                    onBlur={() => {
                                        setIsFocused({ ...isFocused, cpassword: false })
                                        onBlur()
                                    }}
                                    onFocus={() => setIsFocused({ ...isFocused, cpassword: true })}

                                    style={[SUS.textInput, { height: isFocused.cpassword ? 40 : 50 }]}
                                    autoCapitalize={'none'}
                                    icon={passwordVisible ? faEye : faEyeSlash}
                                    handleIconPress={toggleIcon}
                                />
                            </View>
                        )}
                        name="cpassword"
                    />
                    <Text style={SUS.error}>{errors?.cpassword?.message || ''}</Text>
                </View>

                <View>
                    <View style={SUS.checkbox}>
                        <Checkbox
                            isChecked={isChecked.privacyPolicy}
                            label={""}
                            onClick={() => setIsChecked({ ...isChecked, privacyPolicy: !isChecked.privacyPolicy })} />
                        <Text style={SUS.text}>{keywords.read}
                            <Text style={SUS.linkText} onPress={() => {
                                setPrivacy(true);
                                setModalVisible(true)
                            }}>{keywords.readPrivacyPolicy}</Text>
                        </Text>
                    </View>
                    <View style={SUS.checkbox}>
                        <Checkbox
                            isChecked={isChecked.termsAndCondition}
                            label={""}
                            onClick={() => setIsChecked({ ...isChecked, termsAndCondition: !isChecked.termsAndCondition })} />
                        <Text style={SUS.text}>
                            {keywords.accept}
                            <Text style={SUS.linkText} onPress={() => {
                                setPrivacy(false);
                                setModalVisible(true)
                            }}>{keywords.termsAndCondition}</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <TermsModal
                headerText={privacy ? keywords.readPrivacyPolicy : keywords.termsAndCondition}
                contentText={privacy ? privacyPolicyText : termsAndConditionText}
            />

            {(!isFocused.email && !isFocused.password && !isFocused.cpassword) &&
                <View style={SUS.submissionContainer}>
                    <View style={SUS.button}>
                        <Button text={keywords.next}
                            onPress={handleFormSubmit}
                            variant="main"
                            loading={isLoading} />
                    </View>
                </View>
            }
        </View>
    )
}

export default SignUpLoginDetail