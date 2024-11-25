import {
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { SAS } from './AuthSignIn.styles';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { reduxDispatch } from '@/types/reduxHooks';
import { useEffect, useState } from 'react';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { authSignIn } from '../../api/authSignIn';
import { getUsermeta } from '../../api/getUsermeta';
import { getSettings } from '@/features/settings/api/getSettings';
import { authError, authLogin } from '@/store/actions/authActions';
import { usermetaAdd } from '@/store/actions/usermetaActions';
import { settingsAdd } from '@/store/actions/settingsActions';
import { supabase } from '@/lib/supabase';
import { ModalContext } from '../../context/ModalContext';
import TermsModal from '../../components/TermsModal';
import H2 from '@/components/elements/H2';
import H1 from '@/components/elements/H1';
import TextField from '@/components/elements/Forms/TextField';
import Button from '@/components/elements/Button/Button';
import { keywords } from '../../utils/keywords';
import LinearGradient from 'react-native-linear-gradient';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { resetPasswordRequest } from '../../api/passwordResetRequest';
import { checkUserMigrationStatus } from '../../api/userMigrationStatus';

type FormPropType = {
  email: string;
  password: string;
};

type AuthSignInProps = {
  setUserMustResetPassword: (userMustResetPassword: boolean) => void;
};

const AuthSignIn = ({ setUserMustResetPassword }: AuthSignInProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const dispatch = reduxDispatch();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (formData: FormPropType) => {
    try {
      setLoading(true);
      const status = await checkUserMigrationStatus(
        normalizeWhitespaces(formData.email),
      );
      setLoading(false);
      console.log('status', status);
      // const response = await resetPasswordRequest(
      //   normalizeWhitespaces(formData.email),
      // );
      // console.log('password reset response : ', response);
      //user is present prompt to sign in
      if (status === 1) {
        await signIn(formData);
      } else if (status === 2) {
        //user is not present, prompt to sign up
        navigation.navigate('AuthSignUp');
      } else if (status === 0) {
        //user is present but has been migrated from adalo, reset password
        setUserMustResetPassword(true);
        // setIndex(index + 1);
      }
    } catch (error) {
      dispatch(authError(error as Error));
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (formData: FormPropType) => {
    try {
      const userEmail = formData.email;
      const userPassword = formData.password;
      const actionType = 'signin';
      const sessionData = await authSignIn({
        userEmail,
        userPassword,
        actionType,
      });
      const usermeta = await getUsermeta(sessionData.uid);
      if (usermeta.is_deleted) {
        errorToast('Your account is deleted');
        await supabase.auth.signOut();
        navigation.goBack();
        return;
      }
      const userSettings = await getSettings(sessionData.uid);
      dispatch(usermetaAdd(usermeta));
      dispatch(settingsAdd(userSettings));
      dispatch(authLogin(sessionData));
      setError(null);
    } catch (error) {
      dispatch(authError(error as Error));
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const handleForgotPassword = () => {
    // handle forgot password
  };

  const toggleIcon = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleLogin = () => {
    // add logic to handle login with google
  };

  const handleFacebookLogin = () => {
    // add logic to handle login with facebook
  };

  return (
    <ModalContext.Provider
      value={{
        modalVisible,
        setModalVisible,
      }}>
      <View
        style={{
          flex: 1,
          // paddingTop: insets.top,
          // backgroundColor: '#FFF3B0',
        }}>
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            paddingLeft: insets.left,
            paddingBottom: insets.bottom,
            paddingRight: insets.right,
          }}> */}
          <View style={SAS.parentContainer}>
            <ScrollView
              contentContainerStyle={SAS.inputMainContainer}
              showsVerticalScrollIndicator={false}>
              <View
                style={[
                  SAS.inputContainer,
                  errors.email ? SAS.inputContainerError : null,
                ]}>
                <H1 text={keywords.login} style={SAS.login} />
                <Text
                  style={
                    [
                      SAS.textInputLabel,
                      errors.email ? SAS.textInputLabelError : null,
                    ]
                    //keywords.email
                  }>
                  { }
                </Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      value={value ?? ''}
                      placeholder={keywords.email}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={SAS.textInput}
                      autoCapitalize={'none'}
                    />
                  )}
                  name="email"
                />
              </View>

              <View
                style={[
                  SAS.inputContainer,
                  errors.password ? SAS.inputContainerError : null,
                ]}>
                <Text
                  style={
                    [
                      SAS.textInputLabel,
                      errors.email ? SAS.textInputLabelError : null,
                    ]
                    //keywords.password
                  }>
                  { }
                </Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      secureTextEntry={passwordVisible}
                      placeholder={keywords.password}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={SAS.textInput}
                      icon={passwordVisible ? faEye : faEyeSlash}
                      handleIconPress={toggleIcon}
                      autoCapitalize={'none'}
                    />
                  )}
                  name="password"
                />
              </View>
              <View style={SAS.submissionContainer}>
                {errors.email && (
                  <Text style={SAS.error}>{errors.email.message}</Text>
                )}
                <View style={SAS.forgotContainer}>
                  <H2
                    text={keywords.forgotPassword}
                    onPress={handleForgotPassword}
                    style={SAS.forgotPassword}
                  />
                </View>
                <View style={SAS.buttonInput}>
                  <Button
                    text={loading ? keywords.loading : keywords.logIn}
                    onPress={handleSubmit(onSubmit)}
                    variant="main"
                    style={SAS.buttonInput}
                  />
                </View>
                <View style={SAS.bottomContainer}>
                  <View style={SAS.line} />
                  <Text style={SAS.bottomText}>{keywords.loginWith}</Text>
                  <View style={SAS.line} />
                </View>
              </View>

              <TouchableOpacity
                style={SAS.buttonContainer}
                onPress={() => navigation.navigate('AuthSignUp')}>
                <Text style={SAS.newUser}>
                  {keywords.newUser}{' '}
                  <Text style={SAS.signUp}>{keywords.signup}</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        {/* </KeyboardAvoidingView> */}
        <Toast config={toastConfig} />
      </View>
    </ModalContext.Provider>
  );
};

export default AuthSignIn;
