import React from 'react';
import { ActivityIndicator, TouchableOpacity, View, ViewProps, ViewStyle } from 'react-native';
import { palette } from '@/components/styles/theme';
import { Text } from 'react-native';
import SButton from '@/components/elements/Button/Button/Button.styles';
import { fontScale } from '@/utils/fontScale';

interface ButtonProps {
  text: string;
  variant: keyof typeof ButtonPropsStyles;
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  color?: string;
  buttonTextColor?: string;
  fontSize?: number;
}

export const ButtonPropsStyles = {
  main: { backgroundColor: palette.darkBlue, color: palette.white, flex: 1 },
  secondary: { backgroundColor: palette.white, color: palette.darkBlue, borderWidth: 1, borderColor: palette.darkBlue, flex: 1 },
  logout: {
    backgroundColor: 'rgba(165, 40, 52, 1)',
    color: 'white',
    flex: 1,
    padding: 10,
  },
} as const;

const Button: React.FC<ButtonProps> = ({
  text,
  variant,
  onPress,
  style,
  loading,
  color,
  buttonTextColor,
  fontSize,
  ...props
}) => {
  const variantStyle = ButtonPropsStyles[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[SButton.container, variantStyle, style]}>
      <View {...props}>
        {loading ? <ActivityIndicator size={'small'} color={color || variant === 'main' ? palette.white : palette.darkBlue} /> :
          <Text style={{ color: buttonTextColor ? buttonTextColor : variantStyle.color, fontWeight: '700', fontSize: fontScale(fontSize || 16) }}>
            {text}
          </Text>
        }

      </View>
    </TouchableOpacity>
  );
};

export default Button;
