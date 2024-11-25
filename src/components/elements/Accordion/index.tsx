import React, { PropsWithChildren, useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import SAccordion from '@/components/elements/Accordion/Accordion.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import H2 from '@/components/elements/H2';

export type AccordionItemProps = PropsWithChildren<{
  title: string;
  textStyle?: TextStyle;
  viewStyle?: ViewStyle;
  iconRight?: boolean;
}>;

const AccordionItem = ({
  children,
  title,
  textStyle,
  viewStyle,
  iconRight = true,
}: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  function toggleItem() {
    setExpanded(!expanded);
  }
  return (
    <View style={SAccordion.accordContainer}>
      <TouchableOpacity
        style={[SAccordion.accordHeader, viewStyle]}
        onPress={toggleItem}>
        <H2 text={title} style={textStyle} />
        {iconRight ? (
          <FontAwesomeIcon icon={expanded ? 'chevron-up' : 'chevron-right'} />
        ) : (
          <FontAwesomeIcon icon={expanded ? 'chevron-up' : 'chevron-down'} />
        )}
      </TouchableOpacity>
      {expanded && <View style={SAccordion.accordBody}>{children}</View>}
    </View>
  );
};

export default AccordionItem;
