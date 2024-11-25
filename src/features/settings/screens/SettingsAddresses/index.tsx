import { theme } from "@/components/styles/theme";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsHeader from "../../components/SettingsHeader";
import { createClient } from "@supabase/supabase-js";
import { reduxDispatch, reduxSelect } from "@/types/reduxHooks";
import { Controller, useForm } from "react-hook-form";
import Wrapper from "@/components/Wrapper";
import { SSA } from "./SettingsAddresses.styles";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { normalizeWhitespaces, whiteUppercase } from "@/utils/formSanitization";
import { usermetaUpdate } from "@/store/actions/usermetaActions";
import Toast from "react-native-toast-message";
import { errorToast, successToast, toastConfig } from "@/lib/toastConfig";

type migrationUser = {
  email: string;
  password: string;
};

const SettingsAddresses = () => {
  const insets   = useSafeAreaInsets();
  const dispatch = reduxDispatch();
  const user     = reduxSelect(state => state.usermeta);

  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      address_line_1: user.street_address_line_1,
      address_line_2: user.street_address_line_2,
      address_city: user.city,
      address_province: user.state,
      address_postal_code: user.postal_code,
      address_country: user.country,
    },
  });

  const saveAddress = async(formData) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_meta')
        .update({
          street_address_line_1: normalizeWhitespaces(formData.address_line_1),
          street_address_line_2: normalizeWhitespaces(formData.address_line_2),
          city: normalizeWhitespaces(formData.address_city),
          state: normalizeWhitespaces(formData.address_province),
          postal_code: whiteUppercase(formData.address_postal_code)
        })
        .eq('id', user.id)
        .select()

      if (error) throw new Error(error.message);
      if (data) {
        console.log('success', data);
        dispatch(usermetaUpdate(data[0]));
        successToast('your address has been updated.');
      }

    } catch (error) {
      errorToast((error as Error).message);
      setTimeout(() => {
        setError(null)
      }, 1000)

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
        <SettingsHeader headerTitle={'addresses'} />
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
            <ScrollView>
              <View style={[SSA.inputContainer, errors.address_line_1 ? SSA.inputContainerError : null]}>
                <Text style={
                  [
                    SSA.textInputLabel,
                    errors.address_line_1
                      ? SSA.textInputLabelError
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
                      style={SSA.textInput}
                    />
                  )}
                  name="address_line_1"
                />
              </View>

              <View style={[SSA.inputContainer, errors.address_line_2 ? SSA.inputContainerError : null]}>
                <Text style={
                  [
                    SSA.textInputLabel,
                    errors.address_line_2
                      ? SSA.textInputLabelError
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
                      style={SSA.textInput}
                    />
                  )}
                  name="address_line_2"
                />
              </View>

              <View style={[SSA.inputContainer, errors.address_city ? SSA.inputContainerError : null]}>
                <Text style={
                  [
                    SSA.textInputLabel,
                    errors.address_city
                      ? SSA.textInputLabelError
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
                      style={SSA.textInput}
                    />
                  )}
                  name="address_city"
                />
              </View>

              <View style={[SSA.inputContainer, errors.address_province ? SSA.inputContainerError : null]}>
                <Text style={
                  [
                    SSA.textInputLabel,
                    errors.address_province
                      ? SSA.textInputLabelError
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
                      style={SSA.textInput}
                    />
                  )}
                  name="address_province"
                />
              </View>

              <View style={[SSA.inputContainer, errors.address_postal_code ? SSA.inputContainerError : null]}>
                <Text style={
                  [
                    SSA.textInputLabel,
                    errors.address_postal_code
                      ? SSA.textInputLabelError
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
                      style={SSA.textInput}
                    />
                  )}
                  name="address_postal_code"
                />
              </View>

              <View style={[SSA.inputContainer, errors.address_country ? SSA.inputContainerError : null]}>
                <Text style={
                  [
                    SSA.textInputLabel,
                    errors.address_country
                      ? SSA.textInputLabelError
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
                      style={SSA.textInput}
                    />
                  )}
                  name="address_country"
                />
              </View>

              <Wrapper>
                <View style={SSA.submissionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit(saveAddress)();
                    }}
                    style={[
                      SSA.buttonInput,
                      !isDirty && SSA.buttonInputDisabled // This style will apply when `isDirty` is false
                    ]}
                    disabled={!isDirty}
                  >
                    <Text style={SSA.buttonInputContent}>save address</Text>
                  </TouchableOpacity>
                </View>
              </Wrapper>
            </ScrollView>
          </Wrapper>
        </KeyboardAvoidingView>
        <Toast config={toastConfig} />
      </View>
      { loading ? (
        <View style={SSA.load}><Text style={SSA.loadText}>Loading...</Text></View>
      ) : null }
    </>
  )
}

export default SettingsAddresses;