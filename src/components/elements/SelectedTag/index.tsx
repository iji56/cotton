import React from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SSelectedTag from './SelectedTag.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SIconButton from '../Button/IconButton/IconButton.styles';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface SelectedTagProps {
  onPress: (event: GestureResponderEvent) => void;
  label: string;
}

const SelectedTag: React.FC<SelectedTagProps> = ({ onPress, label }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={SSelectedTag.container}>
        <View style={SSelectedTag.contents}>
          <Text style={SSelectedTag.text}>{label}</Text>
          <FontAwesomeIcon icon={faXmark} style={SIconButton.icon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SelectedTag;
