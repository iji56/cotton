import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AUR } from './AuthResetPassEmailSent.styles';
import { keywords } from '../../utils/keywords';
import { SUS } from '../AuthSignUp/AuthSignUp.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import H1 from '@/components/elements/H1';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AuthResetPassEmailSent = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: palette.white,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <View
        style={{
          gap: 40,
          width: '92%',
        }}>
        <View style={SUS.header}>
          <TouchableOpacity
            style={SUS.headerButton}
            onPress={() => {
              navigation.goBack();
            }}>
            <FontAwesomeIcon icon={faArrowLeft} color={'#000'} size={20} />
          </TouchableOpacity>
        </View>
        <View style={SUS.emailSentHeader}>
          <Image
            source={require('../../../../components/assets/check.png')}
            style={SUS.checkIcon}
          />

          <H1 text={keywords.emailSentTitle} style={SUS.loadText} />
        </View>
        <Text style={AUR.text}>{keywords.emailSent}</Text>
        <Text style={AUR.text}>{keywords.ifNoEmail}</Text>
        <Text style={AUR.text}>
          {keywords.didNotReceiveEmail}
          <Text style={SUS.linkText}> Resend</Text>
        </Text>
      </View>
    </View>
  );
};
export default AuthResetPassEmailSent;
