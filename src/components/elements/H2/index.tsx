import React from 'react';
import { Text, TextStyle, TouchableOpacity } from 'react-native';
import SH2 from './H2.styles';
import { palette } from '@/components/styles/theme';

interface H2Props {
  text: string;
  color?: string;
  style?: TextStyle;
  onPress?: () => void;
}

const H2: React.FC<H2Props> = ({
  text,
  style,
  color = palette.black,
  onPress,
  ...props
}) => {
  return onPress ? (
    <TouchableOpacity onPress={onPress}>
      <Text style={[SH2.text, { color }, style]} {...props}>
        {text}
      </Text>
    </TouchableOpacity>
  ) : (
    <Text style={[SH2.text, { color }, style]} {...props}>
      {text}
    </Text>
  );
};

export default H2;
