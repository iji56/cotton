import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import H1 from '@/components/elements/H1';
import { keywords } from '../../utils/keywords';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@/components/elements/Forms/TextField';
import { SUS } from './SignUp.styles';
import Button from '@/components/elements/Button/Button';
import { PropType } from '../../types/usermetaReducerType';
import { ModalContext } from '../../context/ModalContext';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { validateEmail } from '../../utils/validateEmail';
import { checkUserMigrationStatus } from '../../api/userMigrationStatus';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { resetPasswordRequest } from '../../api/passwordResetRequest';

type FormPropType = {
  email: string;
};

const EmailAddressScreen = ({ index, setIndex }: PropType) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { setEmail } = useContext(ModalContext);
  const [isFocused, setIsFocused] = useState({
    email: false,
  });
  const [loading, setLoading] = useState(false);

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
    },
  });

  const emailValidation = (email: string) => {
    if (validateEmail(email)) {
      clearErrors();
    } else {
      if (email.length === 0) {
        clearErrors();
      } else {
        setError('email', { type: 'pattern', message: 'Invalid email' });
      }
    }
  };

  const nextPage = async (formData: FormPropType) => {
    setLoading(true);
    setEmail(normalizeWhitespaces(formData.email));
    // const status = await checkUserMigrationStatus(
    //   normalizeWhitespaces(formData.email),
    // );
    // console.log(status);
    // const response = await resetPasswordRequest(
    //   normalizeWhitespaces(formData.email),
    // );
    setLoading(false);
    // console.log('password reset response : ', response);
    console.log('next page');
    navigation.navigate('AuthResetPassEmailSent');

    //user is present prompt to sign in
    // if (status === 1) {
    //   navigation.navigate('AuthSignIn');
    // } else if (status === 2) {
    //   //user is not present, prompt to sign up
    //   navigation.navigate('AuthSignUp');
    // } else if (status === 0) {
    //   //user is present but has been migrated from adalo, reset password
    //   //   const response = await resetPasswordRequest(
    //   //     normalizeWhitespaces(formData.email),
    //   //   );
    //   //   console.log(response);
    //   setIndex(index + 1);
    // }
  };

  return (
    <View style={SUS.mainContainer}>
      <H1 text={keywords.email} style={SUS.headerTitle} />
      <Text style={SUS.text}>{keywords.emailAddressMessage}</Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
        <View style={SUS.inputContainer}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[
                  SUS.textInputContainer,
                  { borderWidth: isFocused.email ? 1 : 0 },
                ]}>
                {isFocused.email && (
                  <Text style={SUS.label}>{keywords.email}</Text>
                )}
                <TextField
                  value={value ?? ''}
                  placeholder={keywords.email}
                  onChangeText={text => {
                    onChange(text.trim()); // Update the form value
                    emailValidation(text);
                  }}
                  onBlur={() => {
                    setIsFocused({ ...isFocused, email: false });
                    onBlur();
                  }}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  style={[SUS.textInput, { height: isFocused.email ? 40 : 50 }]}
                  autoCapitalize={'none'}
                />
              </View>
            )}
            name="email"
          />
          <Text style={SUS.error}>{errors.email?.message || ''}</Text>
        </View>
      </ScrollView>
      {!isFocused.email && (
        <View style={SUS.submissionContainer}>
          <View style={SUS.button}>
            <Button
              text={keywords.next}
              onPress={() => {
                if (control.getFieldState('email').invalid) {
                  setError('email', { message: 'Email is missing' });
                } else {
                  clearErrors();
                  handleSubmit(nextPage)();
                }
              }}
              variant="main"
              loading={loading}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default EmailAddressScreen;
