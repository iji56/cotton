import React from 'react';
import {
  GestureResponderEvent,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SIconButton from '@/components/elements/Button/IconButton/IconButton.styles';

interface props {
  onPress: (event: GestureResponderEvent) => void;
  icon: IconProp;
  iconColor?: string;
  style?: ViewStyle;
  size?: number
}

const IconButton: React.FC<props> = ({ onPress, icon, iconColor, style, size }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <FontAwesomeIcon
        icon={icon}
        style={SIconButton.icon}
        size={size ?? 16}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
