import React from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SFilterSectionButton from './FilterSectionButton.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { palette } from '@/components/styles/theme';

export interface FilterSectionButtonProps {
  id: number;
  title: string;
  // icon: IconProp;
  isSelected: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

const FilterSectionButton: React.FC<FilterSectionButtonProps> = ({
  id,
  title,
  // icon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} key={id}>
      <View
        style={[
          SFilterSectionButton.button,
          { borderRadius: isSelected ? 8 : 5 },
          {backgroundColor: isSelected ? '#FFD700' : palette.white}
        ]}>
        {/* <FontAwesomeIcon icon={icon} size={18} /> */}
        <Text style={SFilterSectionButton.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilterSectionButton;
