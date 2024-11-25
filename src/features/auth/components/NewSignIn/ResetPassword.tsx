import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import H1 from '@/components/elements/H1';
import {
  keywords,
  privacyPolicyText,
  termsAndConditionText,
} from '../../utils/keywords';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@/components/elements/Forms/TextField';
import { SUS } from './SignUp.styles';
import Button from '@/components/elements/Button/Button';
import { validateEmail } from '../../utils/validateEmail';
import {
  hasDigit,
  hasLetter,
  validatePassword,
} from '../../utils/validatePassword';
import { errorToast } from '@/lib/toastConfig';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { authSignIn } from '../../api/authSignIn';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import { faEye, faEyeSlash } from '@fortawesome/pro-light-svg-icons';
import TermsModal from '../TermsModal';
import { ModalContext } from '../../context/ModalContext';
import { signup } from '../../api/authSignUp';
import { getSettings } from '@/features/settings/api/getSettings';
import { authLogin } from '@/store/actions/authActions';
import { usermetaAdd } from '@/store/actions/usermetaActions';
import { settingsAdd } from '@/store/actions/settingsActions';
import { PropType } from '../../types/usermetaReducerType';
import { reduxDispatch } from '@/types/reduxHooks';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/utils/permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';

type FormPropType = {
  password: string;
  cpassword: string;
};

const ResetPassword = ({ index, setIndex, route }: PropType) => {
  console.log('reset pass route-----------------', route);
  const insets = useSafeAreaInsets();
  const { } = useContext(ModalContext);
  const dispatch = reduxDispatch();
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [validateRule1, setValidateRule1] = useState(false);
  const [validateRule2, setValidateRule2] = useState(false);
  const [validateRule3, setValidateRule3] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      cpassword: '',
    },
  });

  const [isFocused, setIsFocused] = useState({
    password: false,
    cpassword: false,
  });

  const passwordValidation = (password: string) => {
    setValidateRule1(password.length > 7);
    setValidateRule2(hasDigit(password));
    setValidateRule3(hasLetter(password));
    if (validatePassword(password)) {
      clearErrors('password');
    } else {
      if (password.length === 0) {
        clearErrors('password');
      } else {
        setError('password', { type: 'pattern', message: 'Invalid Password' });
      }
    }
  };

  const ConfirmPasswordValidation = (password: string) => {
    const confirmPassword = watch('password');

    if (password !== confirmPassword) {
      setError('cpassword', {
        type: 'pattern',
        message: 'Password does not match',
      });
    } else {
      clearErrors('cpassword');
    }
  };

  const nextPage = async (formData: FormPropType) => {
    let payload = {
      password: formData.password,
      cpassword: formData.cpassword,
    };
    setIsLoading(true);
    //  call password reset api

    setIndex(index + 1);
  };

  const handleFormSubmit = () => {
    if (control.getFieldState('password').invalid) {
      setError('password', { message: 'Password is missing' });
      clearErrors('cpassword');
    } else if (control.getFieldState('cpassword').invalid) {
      setError('cpassword', { message: 'Confirm password is missing' });
      clearErrors('password');
    } else {
      clearErrors();
      handleSubmit(nextPage)();
    }
  };

  const toggleIcon = () => {
    setPasswordVisible(!passwordVisible);
  };
  console.log('index is --------------------------', index);

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: palette.white,
      marginTop: 30
    }}>
      <View style={SUS.mainContainer}>
        <H1 text={keywords.passwordReset} style={SUS.headerTitle} />
        <Text style={SUS.text}>{keywords.passwordResetMessage}</Text>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View style={SUS.inputContainer}>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    SUS.textInputContainer,
                    { borderWidth: isFocused.password ? 1 : 0 },
                  ]}>
                  {isFocused.password && (
                    <Text style={SUS.label}>{keywords.password}</Text>
                  )}
                  <TextField
                    secureTextEntry={passwordVisible}
                    value={value ?? ''}
                    placeholder={keywords.newPassword}
                    onChangeText={password => {
                      onChange(password);
                      passwordValidation(password);
                    }}
                    onBlur={() => {
                      setIsFocused({ ...isFocused, password: false });
                      onBlur();
                    }}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    style={[
                      SUS.textInput,
                      { height: isFocused.password ? 40 : 50 },
                    ]}
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

          {watch('password').length > 0 && (
            <>
              <View style={SUS.bottomContainer}>
                {validateRule1 ? (
                  <Image
                    source={require('../../assets/check.png')}
                    style={SUS.logo}
                  />
                ) : (
                  <View style={SUS.logo} />
                )}
                <Text style={SUS.passwordHintText}>{keywords.passwordHint1}</Text>
              </View>
              <View style={SUS.bottomContainer}>
                {validateRule2 ? (
                  <Image
                    source={require('../../assets/check.png')}
                    style={SUS.logo}
                  />
                ) : (
                  <View style={SUS.logo} />
                )}
                <Text style={SUS.passwordHintText}>{keywords.passwordHint2}</Text>
              </View>
              <View style={SUS.bottomContainer}>
                {validateRule3 ? (
                  <Image
                    source={require('../../assets/check.png')}
                    style={SUS.logo}
                  />
                ) : (
                  <View style={SUS.logo} />
                )}
                <Text style={SUS.passwordHintText}>{keywords.passwordHint3}</Text>
              </View>
            </>
          )}

          <View style={SUS.inputContainer}>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    SUS.textInputContainer,
                    { borderWidth: isFocused.cpassword ? 1 : 0 },
                  ]}>
                  {isFocused.cpassword && (
                    <Text style={SUS.label}>{keywords.reEnterPassword}</Text>
                  )}
                  <TextField
                    secureTextEntry={passwordVisible}
                    value={value ?? ''}
                    placeholder={keywords.reEnterNewPassword}
                    onChangeText={password => {
                      onChange(password);
                      ConfirmPasswordValidation(password);
                    }}
                    onBlur={() => {
                      setIsFocused({ ...isFocused, cpassword: false });
                      onBlur();
                    }}
                    onFocus={() =>
                      setIsFocused({ ...isFocused, cpassword: true })
                    }
                    style={[
                      SUS.textInput,
                      { height: isFocused.cpassword ? 40 : 50 },
                    ]}
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
        </ScrollView>

        {!isFocused.password && !isFocused.cpassword && (
          <View style={SUS.submissionContainer}>
            <View style={SUS.button}>
              <Button
                text={keywords.next}
                onPress={handleFormSubmit}
                variant="main"
                loading={isLoading}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ResetPassword;
