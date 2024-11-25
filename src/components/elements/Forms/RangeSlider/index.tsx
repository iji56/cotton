import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import SRangeSlider from './RangeSlider.styles';
import Slider, { SliderProps } from '@react-native-community/slider';
import { palette } from '@/components/styles/theme';

type RangeSliderProp = {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  minimumValue?: number,
  maximumValue?: number,
  label?: string;
  steps?: number;
  style?: ViewStyle;
} & SliderProps

const RangeSlider = ({ value, setValue, minimumValue, maximumValue, steps, label, style, ...props }: RangeSliderProp) => {

  const roundUpToOneDecimalPlace = (num: number) => {
    return Math.floor(num * 10) / 10;
  };
  return (
    <>
      <View style={SRangeSlider.container}>
        <Slider
          step={steps || 0.1}
          {...props}
          thumbImage={require('../../../assets/circle.png')}
          style={[SRangeSlider.slide, style]}
          minimumValue={minimumValue || 0.0}
          maximumValue={maximumValue || 10000}
          minimumTrackTintColor={palette.lightBlue2}
          // maximumTrackTintColor={palette.darkGrey}
          thumbTintColor={palette.darkBlue}
          value={value}
          onValueChange={setValue}
        />
        <Text style={SRangeSlider.text}>
          {label ? label : roundUpToOneDecimalPlace(value)+'.0kms'}
        </Text>
      </View>
    </>
  );
};

export default RangeSlider;
