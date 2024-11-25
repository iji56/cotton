
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoficationModals from './NotificationModals/NotificationModals';

const NotificationNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="NotificationModal">
      <Stack.Screen
        name="NotificationModal"
        component={NoficationModals}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationNav;
