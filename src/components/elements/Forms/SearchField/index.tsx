import React from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import SSearchField from './SearchField.styles';
import { theme } from '@/components/styles/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBarsFilter } from '@fortawesome/pro-regular-svg-icons';

interface SearchFieldProps {
  placeholder: string;
  variant: keyof typeof SearchFieldStyles;
  icon?: boolean;
}

export const SearchFieldStyles = {
  white: { backgroundColor: 'white', color: theme.colors.foreground },
  gray: {
    backgroundColor: '#F2F2F2',
  },
} as const;

const SearchField: React.FC<SearchFieldProps & TextInputProps> = ({
  placeholder,
  variant,
  icon,
  ...props
}) => {
  const variantStyle = SearchFieldStyles[variant];
  return (
    <View style={[SSearchField.container, variantStyle]}>
      <FontAwesomeIcon icon={'magnifying-glass'} style={[SSearchField.icon]} />
      <TextInput
        style={SSearchField.input}
        placeholder={placeholder}
        placeholderTextColor="#49454F"
        {...props}
      />
      {icon &&
        <TouchableOpacity>
          <FontAwesomeIcon icon={faBarsFilter} style={[SSearchField.icon]} />
        </TouchableOpacity>
      }
    </View>
  );
};

export default SearchField;
