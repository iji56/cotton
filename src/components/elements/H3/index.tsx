import React from 'react';
import { Text, TextStyle } from 'react-native';
import SH3 from './H3.styles';
import { palette } from '@/components/styles/theme';

interface H3Props {
  text: string;
  color?: string;
  style?: TextStyle
}

const H3: React.FC<H3Props> = ({ text, color = palette.black, style, ...props }) => {
  return (
    <Text style={[SH3.text, { color: color }, style]} {...props}>
      {text}
    </Text>
  );
};

export default H3;
