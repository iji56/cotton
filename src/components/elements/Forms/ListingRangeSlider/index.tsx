import React from 'react';
import { View, Text } from 'react-native';
import SListingRangeSlider from './ListingRangeSlider.styles';
import Slider from '@react-native-community/slider';
import { palette } from '../../../styles/theme';

interface ListingRangeSliderProps {
  onChange: (value: number) => void;
  value: null | number;
}

const ListingRangeSlider: React.FC<ListingRangeSliderProps> = ({
  onChange,
  value,
}) => {
  return (
    <View style={SListingRangeSlider.container}>
      <Slider
        step={1}
        style={SListingRangeSlider.slide}
        minimumValue={0}
        maximumValue={8}
        minimumTrackTintColor={palette.lightGrey}
        maximumTrackTintColor={palette.lightGrey}
        thumbTintColor={palette.black}
        value={value !== null ? value : 0}
        onValueChange={newValue => {
          onChange(newValue);
        }}
      />
      <Text style={SListingRangeSlider.text}>Perfect</Text>
    </View>
  );
};

export default ListingRangeSlider;
