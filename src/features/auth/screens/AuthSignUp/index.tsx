import { Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { faCamera } from "@fortawesome/pro-regular-svg-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { SUS } from "./AuthSignUp.styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Wrapper from "@/components/Wrapper";
import { palette, } from "@/components/styles/theme";
import { useState } from "react";
import { ModalContext } from "../../context/ModalContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toastConfig";
import SignUpDetail from "../../components/SignUp/SignUpDetail";
import SignUpLoginDetail from "../../components/SignUp/SignUpLoginDetail";
import Button from "@/components/elements/Button/Button";
import { keywords } from "../../utils/keywords";
import AddressesSignUp from "../../components/SignUp/Addresses";


const AuthSignUp = () => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  return (
    <ModalContext.Provider value={{
      image,
      setImage,
      username,
      setUsername,
      name,
      setName,
      sessionData,
      setSessionData,
      modalVisible,
      setModalVisible
    }}>
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
            </> :
              index === 1 ? <>
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
                  <View style={SUS.progressContainer}>
                    <View style={SUS.halfColoredLine} />
                    <View style={SUS.remainingLine} />
                  </View>
                </>
            }
          </View>
        </Wrapper>
        {
          index === 0 ? <SignUpDetail index={index} setIndex={setIndex} /> :
            index === 1 ? <SignUpLoginDetail index={index} setIndex={setIndex} /> :
              <AddressesSignUp />
        }
        <Toast config={toastConfig} />
      </View>
    </ModalContext.Provider>
  )
}

export default AuthSignUp;