import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { SAM } from "./AuthModal.styles";
import { useContext, useState } from "react";
import { ModalContext } from "../../context/ModalContext";
import Wrapper from "@/components/Wrapper";

/**
 * NOTE: NOT IN USE
 * @version 0.1.3
 *
 * TODO: add keyboard popup functionality
 * TODO: create separate form component with state handling
 */
const AuthModal = () => {
  const { modalVisible, setModalVisible } = useContext(ModalContext);

  return (
    <GestureRecognizer onSwipeDown={ () => setModalVisible(false) }>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={SAM.modal}>
          <View style={SAM.modalAssist}></View>
          <Wrapper>
            <View style={SAM.modalForm}>
              <Text style={SAM.header}>Sign In</Text>
              <TextInput
                style={SAM.input}
                placeholder="email or username"
              />
              <TextInput
                style={SAM.input}
                placeholder="password"
                secureTextEntry
              />
              <Text style={SAM.link}>forgot password?</Text>
              <TouchableOpacity
                style={SAM.button}
                onPress={() => setModalVisible(true)}
              >
                <Text style={SAM.buttonText}>sign in</Text>
              </TouchableOpacity>
              <Text style={SAM.subtitle}>I accept Terms of Use & Privacy Policy</Text>
            </View>
          </Wrapper>
        </View>
      </Modal>
    </GestureRecognizer>
  )
}

export default AuthModal;