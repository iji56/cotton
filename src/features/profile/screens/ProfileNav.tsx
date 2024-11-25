import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMain from './ProfileMain';
import SettingsNav from '@/features/settings/screens/SettingsNav';


const ProfileNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ProfileMain">
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingsNav"
        component={SettingsNav}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNav;
