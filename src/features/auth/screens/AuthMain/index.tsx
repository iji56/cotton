import {
  Image,
  ImageBackground,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SAM } from './AuthMain.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Wrapper from '@/components/Wrapper';
import { keywords } from '../../utils/keywords';
import { privacyPolicyUrl, termsOfUseUrl } from '../../utils/urls';
import BottomSheets from '@/components/elements/BottomSheet';
import { useRef, useState } from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import AuthResetPassword from '../../components/AuthResetPassword';
import AuthSignIn from '../AuthSignIn';

const AuthMain = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [snapPoint, setSnapPoint] = useState(1);
  const [userMustResetPassword, setUserMustResetPassword] = useState(false);
  const ref = useRef<any>(null);

  const handleOpenLink = async (type: 'termsOfUse' | 'privacy') => {
    try {
      let canOpenUrl = await Linking.canOpenURL(
        type === 'privacy' ? privacyPolicyUrl : termsOfUseUrl,
      );
      if (canOpenUrl) {
        await Linking.openURL(
          type === 'privacy' ? privacyPolicyUrl : termsOfUseUrl,
        );
      }
    } catch (error) { }
  };

  return (
    <ImageBackground source={require('../../assets/background.png')} style={{justifyContent: 'space-between'}}>
      <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
        <SafeAreaView>
          <Wrapper>
            <View style={SAM.section}>
              <Image
                source={require('../../assets/homePageLogo.png')}
                style={SAM.header}
              />
              <View style={SAM.nav}>
                <TouchableOpacity
                  style={SAM.button}
                  onPress={() => {
                    console.log('first');
                    ref.current?.snapToIndex(1);
                    setSnapPoint('95%');
                    // navigation.navigate('AuthSignIn');
                  }}>
                  <Text style={SAM.buttonText}>{keywords.logIn}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={SAM.buttonAccent}
                  onPress={() => navigation.navigate('AuthSignUp')}>
                  <Text style={SAM.buttonAccentText}>{keywords.signup}</Text>
                </TouchableOpacity>
                <View>
                  <Text style={SAM.subtitle}>
                    {keywords.privacyText}
                    <Text
                      style={SAM.linkText}
                      onPress={() => handleOpenLink('termsOfUse')}>
                      {keywords.termsOfUse}
                    </Text>
                    <Text>{keywords.and}</Text>
                    <Text
                      style={SAM.linkText}
                      onPress={() => handleOpenLink('privacy')}>
                      {keywords.privacyPolicy}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </Wrapper>
        </SafeAreaView>
      </LinearGradient>
      <BottomSheets
        snapPoint={snapPoint}
        handleSheetChanges={(index: number) => {
          if (index < 1) {
            setSnapPoint(1);
          }
        }}
        bottomSheetRef={ref}>
        <BottomSheetView style={{ flex: 1 }}>
          {userMustResetPassword ? (
            <AuthResetPassword setSnapPoint={setSnapPoint} />
          ) : (
            <AuthSignIn setUserMustResetPassword={setUserMustResetPassword} />
          )}
        </BottomSheetView>
      </BottomSheets>
    </ImageBackground>
  );
};

export default AuthMain;
