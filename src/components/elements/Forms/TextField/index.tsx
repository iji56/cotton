import React from 'react';
import { KeyboardTypeOptions, TextInput, TextInputProps, TextStyle, TouchableOpacity, View } from 'react-native';
import STextField from './TextField.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { palette } from '@/components/styles/theme';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface TextFieldProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  onBlur?(): void;
  onFocus?(): void;
  value: string;
  style?: TextStyle;
  multiline?: boolean;
  autoCapitalize?: 'none'; // add more options
  secureTextEntry?: boolean;
  icon?: IconProp;
  handleIconPress?: () => void;
  min?: number;
  keyboardType?: KeyboardTypeOptions;
  disable?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  onChangeText,
  placeholder,
  onBlur,
  onFocus,
  value,
  style,
  multiline,
  autoCapitalize,
  secureTextEntry,
  icon,
  handleIconPress,
  min,
  keyboardType,
  disable,
  ...props
}) => {
  return (
    <View style={[STextField.input, style]}>
      <TextInput
        style={{ width: '90%' }}
        placeholder={placeholder}
        placeholderTextColor="#49454F"
        onBlur={onBlur}
        onFocus={onFocus}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry ? true : false}
        multiline={multiline ? true : false}
        maxLength={min || undefined}
        autoCapitalize={autoCapitalize ? autoCapitalize : undefined}
        keyboardType={keyboardType ? keyboardType : 'default'}
        editable={disable ? !disable : true}
        {...props}
      />
      {icon && (
        <TouchableOpacity style={{ padding: 15 }} onPress={handleIconPress}>
          <FontAwesomeIcon icon={icon} size={16} color={palette.black} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextField;
