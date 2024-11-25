import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { TMS } from "./TermsModal.styles";
import { faArrowLeft } from "@fortawesome/sharp-light-svg-icons";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import Modal from 'react-native-modal';
import Button from "@/components/elements/Button/Button";
import { keywords } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import H1 from "@/components/elements/H1";

type ListingInfoModalProps = {
  headerText: string;
  contentText: string;
}

const TermsModal = ({ headerText, contentText }: ListingInfoModalProps) => {
  const { modalVisible, setModalVisible } = useContext(ModalContext);

  const closeModal = () => setModalVisible(false);

  return (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={modalVisible}
        style={TMS.backgroundContainer}
        propagateSwipe={true}
      >
        <View style={TMS.modalContainer}>
          <View style={TMS.flexContainer}>
            <TouchableOpacity style={TMS.backButton} onPress={closeModal}>
              <FontAwesomeIcon icon={faArrowLeft} size={25} />
            </TouchableOpacity>
            <H1 text={headerText} />
          </View>
          <ScrollView contentContainerStyle={TMS.content} showsVerticalScrollIndicator={false}>
            <Text style={TMS.modalBody}>{contentText}</Text>
          </ScrollView>
          <View style={TMS.button}>
            <Button text={keywords.continue}
              onPress={closeModal}
              variant="main" />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default TermsModal;