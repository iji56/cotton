import React from 'react';
import { Text, View } from 'react-native';
import STag from './Tag.styles';

interface TagProps {
  label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <View style={STag.container}>
      <Text style={STag.text}>{label}</Text>
    </View>
  );
};

export default Tag;
