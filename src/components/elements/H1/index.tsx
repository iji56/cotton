import React from 'react';
import { Text, TextStyle } from 'react-native';
import SH1 from './H1.styles';
import { palette } from '@/components/styles/theme';

interface H1Props {
  text: string;
  color?: string;
  style?: TextStyle
}

const H1: React.FC<H1Props> = ({ text, color = palette.black, style, ...props }) => {
  return (
    <Text style={[SH1.text, style, { color: color }]} {...props}>
      {text}
    </Text>
  );
};

export default H1;
