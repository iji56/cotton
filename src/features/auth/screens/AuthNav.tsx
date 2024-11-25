import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthMain from './AuthMain';
import AuthSignIn from './AuthSignIn';
import AuthSignUp from './AuthSignUp';
import AuthOnboard from './AuthOnboard';
import AuthAddress from './AuthAddress';
import AddressMapSignUp from '../components/SignUp/AddressesMap';
import AuthNewSignIn from './AuthNewSignIn';
import AddressMapNewSignIn from '../components/NewSignIn/AddressesMapNewSignIn';
import ResetPassword from '../components/NewSignIn/ResetPassword';
import AuthResetPassEmailSent from './AuthResetPassEmailSent';

const AuthNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="AuthMain"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AuthMain" component={AuthMain} />
      <Stack.Screen name="AuthSignIn" component={AuthSignIn} />
      <Stack.Screen name="AuthSignUp" component={AuthSignUp} />
      <Stack.Screen name="AuthOnboard" component={AuthOnboard} />
      <Stack.Screen name="AuthAddress" component={AuthAddress} />
      <Stack.Screen name="AddressMapSignUp" component={AddressMapSignUp} />
      <Stack.Screen name="AuthNewSignIn" component={AuthNewSignIn} />
      <Stack.Screen
        name="AddressMapNewSignIn"
        component={AddressMapNewSignIn}
      />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNav;
