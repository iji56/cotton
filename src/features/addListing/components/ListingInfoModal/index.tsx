import Wrapper from "@/components/Wrapper";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import LIMS from "./ListingInfoModal.styles";
import { useContext } from "react";
import { ListingMainContext } from "../../context/ListingMainContext";

type ListingInfoModalProps = {
  headerText: string;
  contentText: string;
  action?: () => void;
  actionLabel?: string;
}

const ListingInfoModal = ({ headerText, contentText, action, actionLabel }: ListingInfoModalProps) => {
  const { modalVisible, setModalVisible } = useContext(ListingMainContext);

  const closeModal = () => setModalVisible(false);

  return (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={modalVisible}
        style={LIMS.backgroundContainer}
        propagateSwipe={true}
      >
        <View style={LIMS.modalContainer}>
          <Wrapper>
            <View style={LIMS.flexContainer}>
              <View>
                <Text style={LIMS.modalHeader}>{headerText}</Text>
                <Text style={LIMS.modalBody}>{contentText}</Text>
              </View>
              <View style={LIMS.actionContainer}>
                { action ? (
                  <TouchableOpacity style={LIMS.closeButton} onPress={action}>
                    <Text style={LIMS.closeText}>{actionLabel}</Text>
                  </TouchableOpacity>
                ) : null }
                <TouchableOpacity style={LIMS.closeButton} onPress={closeModal}>
                  <Text style={LIMS.closeText}>continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Wrapper>
        </View>
      </Modal>
    </View>
  )
}

export default ListingInfoModal;