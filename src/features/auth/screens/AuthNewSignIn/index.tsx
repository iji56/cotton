import { View, TouchableOpacity } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { faArrowLeft } from "@fortawesome/sharp-light-svg-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { SUS } from "./AuthSignUp.styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Wrapper from "@/components/Wrapper";
import { palette, } from "@/components/styles/theme";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toastConfig";
import EmailAddressScreen from "../../components/NewSignIn/EmailAddressScreen";
import ResetPassword from "../../components/NewSignIn/ResetPassword";
import SignInDetail from "../../components/NewSignIn/SignInDetail";
import AddressesNewSignIn from "../../components/NewSignIn/AddressesNewSignIn";


const AuthNewSignIn = () => {

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  return (

    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: palette.white,
      }}
    >
      <Wrapper>
        <View style={SUS.header}>
          <TouchableOpacity
            style={SUS.headerButton}
            onPress={() => {
              if (index > 0) {
                setIndex(index - 1);
              } else {
                navigation.goBack()
              }
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              color={'#000'}
              size={20}
            />
          </TouchableOpacity>
          {index === 0 ? <>
            <View style={SUS.progressContainer}>
              <View style={SUS.halfColoredLine} />
              <View style={SUS.remainingLine} />
            </View>
            <View style={SUS.progressLine} />
            <View style={SUS.progressLine} />
            <View style={SUS.progressLine} />
          </> :
            index === 1 ? <>
              <View style={SUS.progressFullLine} />
              <View style={SUS.progressContainer}>
                <View style={SUS.halfColoredLine} />
                <View style={SUS.remainingLine} />
              </View>
              <View style={SUS.progressLine} />
              <View style={SUS.progressLine} />
            </> :
              index === 2 ? <>
                <View style={SUS.progressFullLine} />
                <View style={SUS.progressFullLine} />
                <View style={SUS.progressContainer}>
                  <View style={SUS.halfColoredLine} />
                  <View style={SUS.remainingLine} />
                </View>
                <View style={SUS.progressLine} />
              </> :
                <>
                  <View style={SUS.progressFullLine} />
                  <View style={SUS.progressFullLine} />
                  <View style={SUS.progressFullLine} />
                  <View style={SUS.progressContainer}>
                    <View style={SUS.halfColoredLine} />
                    <View style={SUS.remainingLine} />
                  </View>
                </>
          }
        </View>
      </Wrapper>
      {
        index === 0 ? <EmailAddressScreen index={index} setIndex={setIndex} /> :
          index === 1 ? <ResetPassword index={index} setIndex={setIndex} /> :
            index === 2 ? <SignInDetail index={index} setIndex={setIndex} /> :
              <AddressesNewSignIn />
      }
      <Toast config={toastConfig} />
    </View>

  )
}

export default AuthNewSignIn;