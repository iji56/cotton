import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BorrowMain from './BorrowMain';
import BorrowDates from './BorrowDates';
import BorrowCheckout from './BorrowCheckout';
import EditDates from './EditDates';
import EditListing from './EditListing';
import ReviewAndpay from './ReviewAndPay';
import RequestSent from './RequestSent';
import BuyDates from './BuyDates';
import PaymentMethods from '@/features/settings/screens/PaymentMethods';
import CreatePaymentMethod from '@/features/settings/screens/CreatePaymentMethod';

const BorrowNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="BorrowMain">
      <Stack.Screen
        name="BorrowMain"
        component={BorrowMain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BorrowDates"
        component={BorrowDates}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BuyDates"
        component={BuyDates}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BorrowCheckout"
        component={BorrowCheckout}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditDates"
        component={EditDates}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditListing"
        component={EditListing}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReviewAndPay"
        component={ReviewAndpay}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestSent"
        component={RequestSent}
        options={{
          headerShown: false,
          gestureEnabled: false
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
        component={CreatePaymentMethod}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default BorrowNav;
