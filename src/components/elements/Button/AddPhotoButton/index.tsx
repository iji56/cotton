import React from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SAddPhotoButton from '@/components/elements/Button/AddPhotoButton/AddPhotoButton.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface AddPhotoButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  hasPhoto: boolean;
}

const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({
  onPress,
  hasPhoto,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          SAddPhotoButton.container,
          hasPhoto ? { width: 160 } : { width: '100%' },
        ]}>
        <FontAwesomeIcon icon={'plus'} size={30} />
        <Text style={SAddPhotoButton.text}>Add photos/video</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddPhotoButton;
