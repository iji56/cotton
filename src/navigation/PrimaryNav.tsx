import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { palette, theme } from '@/components/styles/theme';
import FeedNav from '@/features/feed/screens/FeedNav';
import ChatNav from '@/features/chat/screens/ChatNav';
import ProfileNav from '@/features/profile/screens/ProfileNav';
import { useMixpanel } from '@/lib/mixpanel';
import AddListingNav from '@/features/addListing/screens/AddListingNav';
import OrdersNav from '@/features/orders/screens/OrdersNav';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { NotificationContext } from '@/features/Listeners/listeners';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
const Tab = createBottomTabNavigator();

const PrimaryNav: React.FC = () => {
  const mixpanel = useMixpanel();
  const mixpanelTabPress = (tagPress: string) => {
    mixpanel?.track(`${tagPress}`);
  };
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { notifications } = useContext(NotificationContext);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log(url, 'Deeplink URL');
      if (url.startsWith('cotton://account')) {
        // Navigate directly to the Profile screen in PrimaryNav
        navigation.navigate('ListingMain');
      } else if (url === "https://app.raxapp.ca/reset-password") {
        navigation.navigate("AuthNav", {
          screen: "ResetPassword"
        })
      } else {
        let parsedUrl = url.split('/');

        let name = parsedUrl[parsedUrl.length - 1].split('?');
        let id = name[1].split('=');
        console.log('testing : ', name, id);
        if (id[2] === 'borrower' || id[2] === 'lender') {
          navigation.navigate('Orders');
        } else {
          navigation.navigate(name[0], {
            screen: 'NotificationModal',
            params: {
              purchaserId: id[1].split('&')[0],
              modal: id[2],
            },
          });
        }
      }
    };

    Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: palette.white,
          borderTopWidth: 1,
        },
        tabBarIcon({ focused }) {
          let iconSize: number = 20;
          let iconColor: string = focused
            ? theme.colors.secondaryForeground
            : theme.colors.foreground;
          switch (route.name) {
            case 'Feed':
              return (
                <FontAwesomeIcon
                  color={iconColor}
                  size={iconSize}
                  icon={'home'}
                />
              );
            case 'Chat':
              return (
                <FontAwesomeIcon
                  color={iconColor}
                  size={iconSize}
                  icon={'comment'}
                />
              );
            case 'Add':
              return (
                <FontAwesomeIcon
                  color={iconColor}
                  size={iconSize}
                  icon={'plus'}
                />
              );
            case 'Orders':
              return (
                <FontAwesomeIcon
                  color={iconColor}
                  size={iconSize}
                  icon={'file-lines'}
                />
              );
            case 'Profile':
              return (
                <FontAwesomeIcon
                  color={iconColor}
                  size={iconSize}
                  icon={'user'}
                />
              );
            default:
              return;
          }
        },
      })}>
      <Tab.Screen
        name="Feed"
        component={FeedNav}
        listeners={{
          tabPress: e => {
            mixpanelTabPress('Feed');
          },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNav}
        listeners={{
          tabPress: e => {
            mixpanelTabPress('Chat');
          },
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddListingNav}
        listeners={{
          tabPress: e => {
            mixpanelTabPress('Add');
          },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersNav}
        listeners={{
          tabPress: e => {
            mixpanelTabPress('Orders');
          },
        }}
        options={{
          tabBarBadge:
            notifications?.length > 0 ? notifications.length : undefined,
          tabBarBadgeStyle: { backgroundColor: palette.yellow },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNav}
        listeners={{
          tabPress: e => {
            mixpanelTabPress('Profile');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Profile' }],
            });
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default PrimaryNav;
