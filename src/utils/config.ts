import ResetPassword from '@/features/auth/components/NewSignIn/ResetPassword';
import { Linking } from 'react-native';

const config = {
  screens: {
    AddressesNav: 'AddressesNav',
  },
};

const linking = {
  // prefixes: ["https://www.raxapp.ca/reset-password",
  //     "com.rax.android://cotton",
  //     "com.rax.android://cotton/AddressesNav",
  //     'com.rax.android://cotton/PrimaryNav/Orders/SellerInfo',
  //     'com.rax.android://cotton/PrimaryNav/Orders/BuyerInfo',
  //     'com.rax.android://cotton/PrimaryNav/Orders/LenderInfo',
  //     'com.rax.android://cotton/PrimaryNav/Orders/BorrowerInfo',
  //     "https://www.google.com",
  //     "cotton://cotton",
  // ],

  prefixes: [
    "cotton://cotton",
    'https://app.raxapp.ca',
    'com.rax.android://cotton',
  ],
  config: {
    screens: {
      PrimaryNav: {
        screens: {
          Orders: {
            screens: {
              SellerInfo: 'SellerInfo',
              BuyerInfo: 'BuyerInfo',
              LenderInfo: 'LenderInfo',
              BorrowerInfo: 'BorrowerInfo',
            },
          },
        },
      },
      AuthNav: {
        screens: {
          ResetPassword: 'reset-password',
        },
      },
    },
  },
  getInitialURL: async () => {
    const url = await Linking.getInitialURL();
    console.log('initial url : ', url);
    return url;
  },
};

export default linking;
