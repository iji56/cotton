import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import ChatSingle from './ChatSingle';
import ChatMain from './ChatMain';

const ChatNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ChatMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ChatMain"
        component={ChatMain}
      />
      <Stack.Screen
        name="ChatSingle"
        component={ChatSingle}
      />
    </Stack.Navigator>
  );
};

export default ChatNav;
