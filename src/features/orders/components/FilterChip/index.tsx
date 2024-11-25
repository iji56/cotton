import { Image, ImageSourcePropType, Text, TouchableOpacity } from "react-native"
import { SFC } from "./FilterChip.styles";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: ImageSourcePropType,
  showCrossIcon?: boolean
}
const FilterChip = ({ label, selected, onPress, icon, showCrossIcon }: FilterChipProps) => {

  return (
    <TouchableOpacity
      style={[SFC.mainContainer, selected && SFC.selectedContainer]}
      onPress={onPress}
    >
      {icon && <Image source={icon} style={SFC.image} />}
      <Text style={[SFC.mainText]}>{label}</Text>
      {selected ? (
        <TouchableOpacity
          style={SFC.cancelContainer}
          onPress={onPress}
        >
          <FontAwesomeIcon icon={'close'} size={18} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  )
}

export default FilterChip;