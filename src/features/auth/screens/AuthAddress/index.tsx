import Wrapper from "@/components/Wrapper";
import { theme } from "@/components/styles/theme";
import { supabase } from "@/lib/supabase";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import { usermetaAdd } from "@/store/actions/usermetaActions";
import { reduxDispatch } from "@/types/reduxHooks";
import { normalizeWhitespaces, whiteUppercase } from "@/utils/formSanitization";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SAA } from "./AuthAddress.styles";
import Toast from "react-native-toast-message";
import { authSignIn } from "../../api/authSignIn";
import { getSettings } from "@/features/settings/api/getSettings";
import { authError, authLogin } from "@/store/actions/authActions";
import { settingsAdd } from "@/store/actions/settingsActions";
import { UsermetaReducerType } from "../../types/usermetaReducerType";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';


const AuthAddress = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets     = useSafeAreaInsets();
  const dispatch   = reduxDispatch();
  const signUpForm = route.params;

  console.log(signUpForm);

  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      address_line_1: '',
      address_line_2: '',
      address_city: '',
      address_province: '',
      address_postal_code: '',
      address_country: 'Canada',
    },
  });

  const saveAddress = async(formData, uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_meta')
        .update({
          street_address_line_1: normalizeWhitespaces(formData.address_line_1),
          street_address_line_2: normalizeWhitespaces(formData.address_line_2),
          city: normalizeWhitespaces(formData.address_city),
          state: normalizeWhitespaces(formData.address_province),
          postal_code: whiteUppercase(formData.address_postal_code),
          first_name: normalizeWhitespaces(formData.first_name),
          last_name: normalizeWhitespaces(formData.last_name),
          user_name: signUpForm.username
        })
        .eq('id', uid)
        .select()

      if (error) throw new Error(error.message);
      if (data) return data[0] as UsermetaReducerType;

    } catch (error) {
      errorToast((error as Error).message);
      setTimeout(() => {
        setError(null)
      }, 1000)
    }
  }

  const signUp = async (formData) => {
    try {
      setLoading(true);

      const userEmail    = signUpForm.email;
      const userPassword = signUpForm.password;
      const actionType   = 'signup'
      const sessionData  = await authSignIn({ userEmail, userPassword, actionType });
      // const usermeta     = await getUsermeta(sessionData.uid);
      const usermeta     = await saveAddress(formData, sessionData.uid);
      const userSettings = await getSettings(sessionData.uid);

      dispatch(authLogin(sessionData));
      dispatch(usermetaAdd(usermeta));
      dispatch(settingsAdd(userSettings));
      setError(null);

    } catch (error) {
      dispatch(authError(error as Error));
      setError((error as Error).message);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {    
    if (error) errorToast(error);
  }, [error])

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: theme.colors.background,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingLeft: insets.left,
            paddingBottom: insets.bottom,
            paddingRight: insets.right,
          }}
        >
          <Wrapper>
            <View style={SAA.header}>
              <TouchableOpacity
                style={SAA.headerButton}
                onPress={() => navigation.navigate('AuthSignUp')}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  color={'#000'}
                  size={20}
                />
              </TouchableOpacity>
              <Text style={SAA.headerTitle}></Text>
            </View>
          </Wrapper>
          <Wrapper>
            <ScrollView>
              <Text style={SAA.headerText}>Almost done, we just need your address for shipping purposes.</Text>
              <View style={[SAA.inputContainer, errors.first_name ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.first_name
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>first name</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="first name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="first_name"
                />
              </View>
              <View style={[SAA.inputContainer, errors.last_name ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.last_name
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>last name</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="first name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="last_name"
                />
              </View>
              <View style={[SAA.inputContainer, errors.address_line_1 ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.address_line_1
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>Address Line 1</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="90 Lane Rd"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="address_line_1"
                />
              </View>

              <View style={[SAA.inputContainer, errors.address_line_2 ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.address_line_2
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>Address Line 2</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="unit 100"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="address_line_2"
                />
              </View>

              <View style={[SAA.inputContainer, errors.address_city ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.address_city
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>city</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Toronto"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="address_city"
                />
              </View>

              <View style={[SAA.inputContainer, errors.address_province ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.address_province
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>province</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="ON"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="address_province"
                />
              </View>

              <View style={[SAA.inputContainer, errors.address_postal_code ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.address_postal_code
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>postal code</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="M7K0J4"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="address_postal_code"
                />
              </View>

              <View style={[SAA.inputContainer, errors.address_country ? SAA.inputContainerError : null]}>
                <Text style={
                  [
                    SAA.textInputLabel,
                    errors.address_country
                      ? SAA.textInputLabelError
                      : null
                  ]
                }>country</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Canada"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAA.textInput}
                    />
                  )}
                  name="address_country"
                />
              </View>

              <Wrapper>
                <View style={SAA.submissionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit(signUp)();
                    }}
                    style={[
                      SAA.buttonInput,
                      !isDirty && SAA.buttonInputDisabled // This style will apply when `isDirty` is false
                    ]}
                    disabled={!isDirty}
                  >
                    <Text style={SAA.buttonInputContent}>sign up</Text>
                  </TouchableOpacity>
                </View>
              </Wrapper>
            </ScrollView>
          </Wrapper>
        </KeyboardAvoidingView>
        <Toast config={toastConfig} />
      </View>
      { loading ? (
        <View style={SAA.load}><Text style={SAA.loadText}>Loading...</Text></View>
      ) : null }
    </>
  )
}

export default AuthAddress;