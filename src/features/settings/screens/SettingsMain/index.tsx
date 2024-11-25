import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import DeviceInfo from 'react-native-device-info';
import Wrapper from '@/components/Wrapper';
import { authSignOut } from '@/features/auth/api/authSignOut';
import SPS from './SettingsMain.styles';
import {
  ParamListBase,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import SettingsHeader from '../../components/SettingsHeader';
import Button from '@/components/elements/Button/Button';
import { keywords } from '../../utils/keywords';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import H2 from '@/components/elements/H2';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import BottomSheets from '@/components/elements/BottomSheet';
import H1 from '@/components/elements/H1';
import { getAccountPausedStatus } from '../../api/getAccountPauseStatus';
import { reduxSelect } from '@/types/reduxHooks';
import { unPauseAccount } from '../../api/unPauseAccount';
import { errorToast, successToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';

const SettingsMain = () => {
  const userId = reduxSelect(state => state.usermeta.id);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [snapPoint, setSnapPoint] = useState<number | string>(1);
  const ref = useRef<any>(null);
  const [accountPaused, setAccountPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkAccountPausedStatus = async () => {
      const accountPaused = await getAccountPausedStatus(userId!);
      setAccountPaused(accountPaused);
    };
    checkAccountPausedStatus();
  }, [isFocused]);

  const handleNavigtion = (screen: string) => {
    navigation.navigate(screen);
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await authSignOut();
      setLoading(false);
      successToast('User logout succeesfully');
    } catch (error) {
      console.log('Error: ', error);
      errorToast('Error logging out : ' + error);
    }
  };

  const hanldeUnpause = async () => {
    setLoading(true);
    await unPauseAccount(userId!);
    setSnapPoint('60%');
    navigation.goBack();
    setLoading(false);
  };

  const hanldeAddListing = async () => {
    setSnapPoint(1);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        // paddingBottom: 50,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white
      }}>
      <SettingsHeader headerTitle={'Settings'} headerType={'main'} />
      <Wrapper>
        <ScrollView contentContainerStyle={SPS.navContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddressesNav', {
                screen: 'AddressesMain',
              })
            }
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>{keywords.myAddresses}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigtion('PaymentMethods')}
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>{keywords.paymentMethods}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => handleNavigtion('SettingsPreferences')}
            style={SPS.navButton}
          >
            <Text>{keywords.notifications}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => handleNavigtion('SettingsFAQs')}
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>{keywords.faq}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigtion('SettingsSupport')}
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>{keywords.contactUs}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigtion('BlockedAccounts')}
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>{keywords.blockedAccounts}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigtion('MyReports')}
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>{keywords.myReports}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <H2 text={keywords.accountAction} style={SPS.accountAction} />

          <TouchableOpacity
            onPress={() => {
              if (accountPaused) {
                ref.current?.snapToIndex(1);
                setSnapPoint('55%');
              } else {
                handleNavigtion('PauseAccount');
              }
            }}
            style={SPS.navButton}>
            <Text style={SPS.settingsOption}>
              {accountPaused ? keywords.unpauseAccount : keywords.pauseAccount}
            </Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigtion('DeleteAccount')}
            style={[SPS.navButton, { borderBottomWidth: 0 }]}>
            <Text style={SPS.settingsOption}>{keywords.deleteAccount}</Text>
            <FontAwesomeIcon icon={faChevronRight} color={palette.darkGrey} />
          </TouchableOpacity>

          <View style={SPS.secondaryNavContainer}>
            <Button
              text={keywords.logout}
              onPress={handleSignOut}
              variant="main"
              style={{}}
              loading={loading}
            />
          </View>

          <Text style={SPS.version}>
            {keywords.version}: {DeviceInfo.getVersion()} - {keywords.minorVersion}:{' '}
            {DeviceInfo.getBuildNumber()}
          </Text>

        </ScrollView>
      </Wrapper>

      <BottomSheets
        bottomSheetRef={ref}
        handleSheetChanges={index => { }}
        snapPoint={snapPoint}
        setSnapPoint={setSnapPoint}>
        <View style={SPS.bottomContainer}>
          {snapPoint === '55%' ? (
            <>
              <View style={SPS.bottomHeader}>
                <H1 text={keywords.unpauseAccount} />
              </View>
              <Text style={SPS.text}>
                {keywords.unpauseMessage1}
                <Text style={SPS.boldText}>
                  {keywords.borrowing.toLowerCase()}
                </Text>
                {keywords.and}
                <Text style={SPS.boldText}>{keywords.purchasing}</Text>
                {keywords.unpauseMessage2}
              </Text>
              <Text style={SPS.message}>{keywords.unpauseMessage3}</Text>
              <View style={SPS.buttonContainer}>
                <Button
                  text={keywords.unpause}
                  onPress={hanldeUnpause}
                  variant="main"
                  loading={loading}
                />
                <View style={SPS.emptyView} />
                <Button
                  text={keywords.close}
                  onPress={() => setSnapPoint(1)}
                  variant="secondary"
                />
              </View>
            </>
          ) : (
            snapPoint === '60%' && (
              <>
                <Image
                  source={require('../../components/assets/check.png')}
                  style={SPS.checkIcon}
                />
                <Text style={SPS.message}>
                  {keywords.accountUnapused}
                  <Text style={SPS.boldText}>{keywords.unpaused}</Text>
                </Text>
                <Text style={SPS.text}>
                  {keywords.unpauseConfirmMessage1}
                  <Text style={SPS.boldText}>
                    {keywords.borrowing.toLowerCase()}
                  </Text>
                  {keywords.and}
                  <Text style={SPS.boldText}>{keywords.purchasing}</Text>
                  {keywords.unpauseConfirmMessage2}
                </Text>
                <View style={SPS.buttonContainer}>
                  <Button
                    text={keywords.addListing}
                    onPress={hanldeAddListing}
                    variant="main"
                  />
                  <View style={SPS.emptyView} />
                  <Button
                    text={keywords.home}
                    onPress={() => setSnapPoint(1)}
                    variant="secondary"
                  />
                </View>
              </>
            )
          )}
        </View>
      </BottomSheets>
      <Toast config={toastConfig} />
    </View>
  );
};

export default SettingsMain;
