import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ATS from "./AccordionToggle.styles";
import Wrapper from "@/components/Wrapper";
import { AccordionToggleType } from "../../types/accordionToggleType";

const AccordianToggle = (props: AccordionToggleType) => {
  const [itemFocus, setItemFocus] = useState<boolean>(false)

  const focusToggle = () => {
    setItemFocus(!itemFocus);
  }

  return (
    <TouchableOpacity
      style={ATS.mainContainer}
      onPress={focusToggle}
    >
      <Wrapper>
        <View style={ATS.titleContainer}><Text>{props.title}</Text></View>
        <View
          id="accordion_nest"
          style={[
            ATS.nestedContainer,
            itemFocus ? ATS.visible : ATS.hidden,
          ]}
        >
          <Text style={ATS.nestedText}>{props.content}</Text>
        </View>
      </Wrapper>
    </TouchableOpacity>
  )
}

export default AccordianToggle;