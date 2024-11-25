import React, { useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { theme } from '@/components/styles/theme';
import { store } from '@/store/configureStore';
import RootNav from '@/navigation/RootNav';
import { StripeProvider } from '@stripe/stripe-react-native';
import notifee from '@notifee/react-native';
import 'react-native-get-random-values';
import { STRIPE_PUBLISHABLE } from '@env';
import { GOOGLE_MAP_API_KEY } from '@env';
import {
  faMagnifyingGlass,
  faHouse,
  faComment,
  faPlus,
  faBox,
  faUser,
  faStar,
  faGear,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faXmark,
  faFilter,
  faCheck,
  faChevronUp,
  faChevronRight,
  faHeart,
  faGlasses,
  faBagShopping,
  faUmbrellaBeach,
  faTimesCircle,
  faLocationPin,
  faChevronDown,
  faImages,
  faCircleXmark,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { MixpanelProvider } from './lib/mixpanel';
import { requestLocationPermission } from './utils/permissions';
import Geocoder from 'react-native-geocoding';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotificationProvider } from './features/Listeners/listeners';
import { AppState, AppStateStatus } from 'react-native';

library.add(
  faArrowRight,
  faMagnifyingGlass,
  faHouse,
  faComment,
  faPlus,
  faBox,
  faUser,
  faStar,
  faGear,
  faArrowLeft,
  faArrowUp,
  faXmark,
  faFilter,
  faCheck,
  faChevronRight,
  faChevronUp,
  faHeart,
  faGlasses,
  faBagShopping,
  faUmbrellaBeach,
  faLocationPin,
  faChevronDown,
  faTimesCircle,
  faImages,
  faCircleXmark,
  faFileLines,
);

const App = (): JSX.Element => {
  const ThemeContext = React.createContext({});

  useEffect(() => {
    Geocoder.init(GOOGLE_MAP_API_KEY);
    requestLocationPermission().then().catch();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        removeAllNotification();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    removeAllNotification();

    return () => {
      subscription.remove();
      removeAllNotification();
    };
  }, []);

  const removeAllNotification = () => {
    // Cancel notifications when app goes to background or inactive
    notifee.cancelAllNotifications().then().catch();
  };

  return (
    <Provider store={store}>
      <MixpanelProvider>
        <ThemeContext.Provider value={theme}>
          <SafeAreaProvider>
            <StripeProvider publishableKey={STRIPE_PUBLISHABLE}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <NotificationProvider>
                  <RootNav />
                </NotificationProvider>
              </GestureHandlerRootView>
            </StripeProvider>
          </SafeAreaProvider>
        </ThemeContext.Provider>
      </MixpanelProvider>
    </Provider>
  );
};

export default App;
