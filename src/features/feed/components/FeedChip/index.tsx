import { Image, ImageSourcePropType, Text, TouchableOpacity } from "react-native"
import { SFC } from "./FeedChip.styles";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type FeedChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: ImageSourcePropType,
  showCrossIcon?: boolean
}
const FeedChip = ({ label, selected, onPress, icon, showCrossIcon }: FeedChipProps) => {
  // const [toggle, setToggle] = useState<boolean>(false);

  // const toggleChip = () => {
  //   setToggle(!toggle);
  // }
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
          {showCrossIcon && <FontAwesomeIcon icon={'close'} size={18} />}
          {/* <Text style={[SFC.mainText, selected && SFC.selectedText]}> x</Text> */}
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  )
}

export default FeedChip;