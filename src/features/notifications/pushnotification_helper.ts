import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Linking, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import notifee, { AndroidImportance, Event, EventType } from '@notifee/react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import { readNotification } from './api/readNotification';

const displayNotification = async (notification: FirebaseMessagingTypes.RemoteMessage) => {
  // Request permissions (required for iOS)

  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH
  });

  // Display a notification
  await notifee.displayNotification({
    title: notification.notification?.title,
    body: notification.notification?.body,
    data: notification?.data as any,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',

      },
    },
  });
}

// This checks the authorization status of the messaging client aka Firebase Cloud Messaging.
export const requestUserPermission = async (
  accessToken: any, userID: any
): Promise<any> => {
  if (Platform.OS === 'android') {
    await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken(accessToken, userID);
  }
};

const updateFCMToken = async (userID: string, fcmtoken: string) => {
  try {
    // Update the user_meta table with the new notification_token
    const { error } = await supabase
      .from('user_meta')
      .update({ notification_token: fcmtoken })
      .eq('id', userID);

    if (error) {
      console.error('Error updating usermeta:', error.message);
      return { data: null, error };
    }

    console.log('FCM token updated successfully in the database.');
  } catch (error: any) {
    console.error('Unexpected error during database update:', error.message);
  }
}

// This actually gets the token which we will use as a device address for sending our notifications.
// Once we have guaranteed that a fresh token has been acquired we update the usermeta to store the token.
const GetFCMToken = async (accessToken: any, userID: any) => {
  // Retrieve the FCM token from storage
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log(fcmtoken, 'old token');
  console.log(userID, "userID in notifications")
  // Retrieve user meta information from the Redux store

  // Check if the userMeta.id and fcmtoken are present
  if (userID && fcmtoken) {
    await updateFCMToken(userID, fcmtoken)
  } else if (!fcmtoken) {
    try {
      // Obtain a new FCM token if not present
      fcmtoken = await messaging().getToken();

      if (fcmtoken) {
        console.log(fcmtoken, 'new token');

        await AsyncStorage.setItem('fcmtoken', fcmtoken);
        await updateFCMToken(userID, fcmtoken)
      }
    } catch (error) {
      console.error('Error obtaining FCM token:', error);
    }
  } else {
    console.log('Missing userMeta.id or FCM token. Unable to update the database.');
  }

  // start listing for fcm token update
  messaging().onTokenRefresh(async (fcmtoken) => {
    console.log("fcmtoken refreshed : ", fcmtoken)
    await updateFCMToken(userID, fcmtoken)
    await AsyncStorage.setItem('fcmtoken', fcmtoken);
  });
};

// listening for notifications even when it is in a background state.
export const NotificationListener = () => {
  console.log('notification listener is listing')

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    clearNotification(remoteMessage.messageId!)
    performDeepLinking(remoteMessage.data);
  });

  // Check whether an initial notification is available.
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        performDeepLinking(remoteMessage.data);
        clearNotification(remoteMessage.messageId!)
      } else {
        clearNotification('')
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on foreground state....', remoteMessage);

    const data = JSON.parse(remoteMessage.data?.keysandvalues);
    console.log("data : ", data,)
    if (
      AppState.currentState === 'active' &&
      data?.p_buy_sell_lend_borrow == 3 &&
      data?.p_purchaser_or_borrower == 3
    ) {
      clearNotification(remoteMessage.messageId!)
      return; // don't show notification
    }

    await displayNotification(remoteMessage)

  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const onNotificationInteraction = async (event: Event) => {
    const { type, detail } = event;
    if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
      const { notification } = detail;
      console.log(notification?.data)
      console.log("original notification before parsed: ", notification)
      const data = JSON.parse(notification?.data?.keysandvalues!)
      console.log("parsed notification : ", data)

      if (notification?.title === "Reminder!") {
        clearNotification(detail.notification?.id!)
        return;
      }
      handleDeepLinking(data?.p_listing_p_b_id, data?.p_purchaser_or_borrower, data?.p_buy_sell_lend_borrow, data?.p_id)
      clearNotification(detail.notification?.id!)
    }
  };

  // Listen for notification interactions
  notifee.onForegroundEvent(onNotificationInteraction);
};

const performDeepLinking = async (notification: FirebaseMessagingTypes.RemoteMessage | any) => {
  console.log("original notification received: ", notification)
  const data = JSON.parse(notification?.keysandvalues);
  console.log("notification received : ", data, data?.p_purchaser_or_borrower, typeof data?.p_purchaser_or_borrower )

  if (notification?.notification?.title === "Reminder!" || data?.p_purchaser_or_borrower == 3) {
    return;
  }
  if (data?.p_listing_p_b_id) {
    handleDeepLinking(data?.p_listing_p_b_id, data?.p_purchaser_or_borrower, data?.p_buy_sell_lend_borrow, data?.p_id)
  }
}

// id => listing id, p_b => purchase/borrow status, b_s_l_b => buy/sell/lend/borrow status
export const handleDeepLinking = async (id: string, p_b: string, b_s_l_b: string, p_id: string) => {
  const response = await readNotification(p_id)
  console.log("read notification response :", response)
  console.log("listing id : ", id, " pb : ", p_b, " bslb : ", b_s_l_b)
  const scheme = Platform.OS === 'android' ? 'com.rax.android' : 'cotton'
  const path = 'cotton/NotificationNav';
  const suffix = (p_b == '1' && b_s_l_b == '1') ? 'lender' :
    (p_b == '1' && b_s_l_b == '0') ? 'borrower' :
      (p_b == '0' && b_s_l_b == '1') ? 'buyer' :
        (p_b == '0' && b_s_l_b == '0') && 'seller'
  const params = {
    purchaserId: id,
    modal: suffix
  };

  const buildUrl = (scheme: string, path: string, params: any) => {
    const url = `${scheme}://${path}`;
    const query = new URLSearchParams(params).toString();
    return `${url}?${query}`;
  };

  const url = buildUrl(scheme, path, params);
  if (id) {
    setTimeout(async () => {
      Linking.openURL(url).
        then(() => console.log("Navigated to  : ", url)).
        catch((err) => {
          console.error('An error occurred', err);
        });
    }, 500)
  }
}


export const clearNotification = async (id?: string) => {
  // await notifee.cancelAllNotifications();
  if (!id) {
    console.log("Notification ID is null or undefined");
    return;
  }

  notifee.cancelNotification(id)
    .then((res) => {
      console.log("clear notificatin resposen : ", res)
    })
    .catch(error => {
      console.log("Error clearing notifications : ", error)
    });
}
