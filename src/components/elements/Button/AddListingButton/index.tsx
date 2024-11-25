import React from 'react';
import { Pressable, Text } from 'react-native';
import SAddListingButton from './AddListingButton.styles';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface AddListingButtonProps {
  title: string;
  onPress?: () => void;
}

const AddListingButton: React.FC<AddListingButtonProps> = ({
  title,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={SAddListingButton.container}>
      <Text style={SAddListingButton.text}>{title}</Text>
      <FontAwesomeIcon icon={faChevronRight} style={SAddListingButton.icon} />
    </Pressable>
  );
};

export default AddListingButton;
