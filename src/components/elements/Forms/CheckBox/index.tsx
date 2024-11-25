import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextStyle } from 'react-native';
import SCheckBox from './CheckBox.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onClick: () => void;
  textStyle?: TextStyle
  borderRadius?: number
}

interface CheckBoxnGroupProps {
  options: string[];
  onChange: (selectedValues: string[]) => void;

}

export const Checkbox = ({ label, isChecked, onClick, textStyle, borderRadius }: CheckboxProps) => {
  return (
    <View style={SCheckBox.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          SCheckBox.box,
          isChecked ? SCheckBox.checked : SCheckBox.unchecked,
          { borderRadius: borderRadius || 0 }
        ]}
        onPress={onClick}>
        {isChecked && (
          <FontAwesomeIcon icon={'check'} style={SCheckBox.checkmark} />
        )}
      </TouchableOpacity>
      <Text style={[SCheckBox.label, textStyle]}>{label}</Text>
    </View>
  );
};

const CheckBoxGroup = ({ options, onChange }: CheckBoxnGroupProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const toggleSelection = (option: string) => {
    setSelectedValues(prevSelectedValues => {
      const updatedSelectedValues = [...prevSelectedValues];
      // Check if the option is already selected
      if (prevSelectedValues.includes(option)) {
        const index = updatedSelectedValues.indexOf(option);
        updatedSelectedValues.splice(index, 1);
      } else {
        updatedSelectedValues.push(option);
      }
      // Update the parent component
      onChange(updatedSelectedValues);
      return updatedSelectedValues;
    });
  };
  return (
    <View>
      {options.map((option, i) => (
        <Checkbox
          key={i}
          label={option}
          isChecked={selectedValues.includes(option)}
          onClick={() => toggleSelection(option)}
        />
      ))}
    </View>
  );
};

export default CheckBoxGroup;
