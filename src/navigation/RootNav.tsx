import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reduxSelect } from '../types/reduxHooks';
import PrimaryNav from './PrimaryNav';
import AuthNav from '../features/auth/screens/AuthNav';
import AddListingNav from '@/features/addListing/screens/AddListingNav';
import {
  requestUserPermission,
  NotificationListener,
  clearNotification,
} from '@/features/notifications/pushnotification_helper';
import { useEffect } from 'react';
import Addressesnav from '@/features/addresses/screens/AddressesNav';
import { requestAllRequiredPermission } from '@/utils/permissions';
import linking from '@/utils/config';
import { ActivityIndicator } from 'react-native';
import { palette, theme } from '@/components/styles/theme';
import NotificationNav from '@/features/notifications/screens/NotificationNav';

const Stack = createNativeStackNavigator();

const RootNav: React.FC = () => {
  const currentUser = reduxSelect(state => state.auth.uid);
  const accessToken = reduxSelect(state => state.auth.access_token);
  const userMeta = reduxSelect(state => state.usermeta) ?? null;

  useEffect(() => {
    NotificationListener();
    requestUserPermission(accessToken, userMeta.id);
    requestAllRequiredPermission();

    return () => {
      clearNotification();
    };
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
      }>
      <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: palette.white }} initialRouteName={currentUser ? "PrimaryNav" : "AuthNav"}>
        {currentUser !== '' ? (
          <Stack.Group>
            <Stack.Screen name="PrimaryNav" component={PrimaryNav} />
            <Stack.Screen name="AddListing" component={AddListingNav} />
            <Stack.Screen name="AddressesNav" component={Addressesnav} />
            <Stack.Screen name="NotificationNav" component={NotificationNav} />

             {/* added this to enable deeplinking to reset password screen in both case, login or logout */}
            <Stack.Screen name="AuthNav" component={AuthNav} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="AuthNav" component={AuthNav} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNav;
