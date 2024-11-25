import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ListingMain from './ListingMain';
import ListingTags from './ListingTags';
import ListingConfirmation from './ListingConfirmation';
import BankAccount from '../components/BankAccounts';
import CreateConnectAccount from '../components/CreateConnectAccount';
import UploadAdditionalDocument from '../components/UploadAdditionalDocument';
import UploadIdentityDocument from '../components/UploadIdentityDocument';
import CreateBankAccount from '../components/CreateBankAccount';

const AddListingNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ListingMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ListingMain" component={ListingMain} />
      <Stack.Screen name="ListingTags" component={ListingTags} />
      <Stack.Screen name="ListingConfirmation" component={ListingConfirmation} />
      <Stack.Screen name="BankAccounts" component={BankAccount} />
      <Stack.Screen name="CreateBankAccount" component={CreateBankAccount} />
      <Stack.Screen name='CreateConnect' component={CreateConnectAccount} />
      <Stack.Screen name='UploadIdentityDocument' component={UploadIdentityDocument} />
      <Stack.Screen name='UploadAdditionalDocument' component={UploadAdditionalDocument} />
    </Stack.Navigator>
  );
};

export default AddListingNav;
