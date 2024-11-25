import React from 'react';
import { TextInput } from 'react-native';
import SNumericInput from './NumericInput.styles';

interface NumericInput {
  placeholder: string;
  onChangeText: (text: number) => void;
  onBlur(): void;
  value: number | null;
}

const NumericInput: React.FC<NumericInput> = ({
  onChangeText,
  placeholder,
  onBlur,
  value,
}) => {
  const handleChange = (value: string) => {
    //convert to number
    const filteredText = value.replace(/[^0-9]/g, '');
    const numericValue = parseInt(filteredText, 10);
    if (!isNaN(numericValue)) {
      onChangeText(numericValue);
    } else {
      onChangeText(0);
    }
  };

  return (
    <TextInput
      style={SNumericInput.input}
      placeholder={placeholder}
      placeholderTextColor="#49454F"
      onBlur={onBlur}
      keyboardType="numeric"
      onChangeText={handleChange}
      value={value ? value.toString() : ''}
    />
  );
};

export default NumericInput;
