import { Text, TouchableOpacity, View } from 'react-native';
import SAM from './AuthResetPassword.styles.ts';
import React from 'react';
import { keywords } from '../../utils/keywords.ts';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface AuthResetPasswordProps {
  setSnapPoint: (index: number) => void;
}
const AuthResetPassword = ({ setSnapPoint }: AuthResetPasswordProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <>
      <View style={SAM.resetPasswordContainer}>
        <Text style={SAM.resetPasswordText}>{keywords.resetPassword}</Text>
      </View>
      <View style={SAM.resetPasswordDetailContainer}>
        <View style={SAM.welcomeTextContainer}>
          <Text style={SAM.welcomeText}>{keywords.welcomeMessage}</Text>
          <Text style={SAM.detailText}>
            {keywords.excitingUpdates}
            {'\n'}
            🏃🏼‍♀️{keywords.fasterApp}
            {'\n'}
            📱{keywords.newFeatures}
            {'\n'}
            👗{keywords.andMore}
            {'\n'}
            {'\n'}
            {keywords.newPlatform}
            {'\n'}
            {'\n'}
            {keywords.previousLisings}
            {'\n'}
            {'\n'}
            {keywords.weAreExcited}
          </Text>
        </View>
      </View>
      <View style={SAM.resetButtonContainer}>
        <TouchableOpacity
          style={SAM.resetButton}
          onPress={() => {
            setSnapPoint(1);
            navigation.navigate('AuthNewSignIn');
          }}>
          <Text style={SAM.resetButtonText}>{keywords.resetPassword}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
export default AuthResetPassword;
