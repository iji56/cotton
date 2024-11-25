import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsAddresses from './SettingsAddresses';
import SettingsPreferences from './SettingsPreferences';
import SettingsFAQs from './SettingsFAQs';
import SettingsSupport from './SettingsSupport';
import SettingsMain from './SettingsMain';
import SettingsStripe from './PaymentMethods';
import DeleteAccount from './DeleteAccount';
import GeneralFAQs from '../components/GeneralFAQs';
import BorrowingFAQs from '../components/BorrowingFAQs';
import LendingFAQs from '../components/LendingFAQs';
import FAQsDetail from '../components/FAQsDetail';
import PaymentMethods from './PaymentMethods';
import PauseAccount from './PauseAccount';
import createPaymentMethod from './CreatePaymentMethod';
import BlockedAccounts from './BlockedAccounts';
import MyReports from './MyReports';

const SettingsNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="SettingsMain">
      <Stack.Screen
        name="SettingsMain"
        component={SettingsMain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethods}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreatePaymentMethod"
        component={createPaymentMethod}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingsAddresses"
        component={SettingsAddresses}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingsPreferences"
        component={SettingsPreferences}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingsFAQs"
        component={SettingsFAQs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingsSupport"
        component={SettingsSupport}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GeneralFAQs"
        component={GeneralFAQs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BorrowingFAQs"
        component={BorrowingFAQs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LendingFAQs"
        component={LendingFAQs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FAQsDetail"
        component={FAQsDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BlockedAccounts"
        component={BlockedAccounts}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MyReports"
        component={MyReports}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
};

export default SettingsNav;