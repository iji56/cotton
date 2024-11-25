import FeedMain from './FeedMain';
import Favorite from './Favorite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BorrowNav from '@/features/borrow/screens/BorrowNav';
import FeedProfile from './FeedProfile';
import Search from './Search';

const FeedNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="FeedMain">
      <Stack.Screen
        name="FeedMain"
        component={FeedMain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BorrowNav"
        component={BorrowNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FeedProfile"
        component={FeedProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default FeedNav;
