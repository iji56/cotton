import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import SImageWrapper from '@/components/elements/FeedImageWrapper/ImageWrapper.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { keywords } from '@/features/profile/utils/keywords';

interface Props {
  image: string;
  iconBtn?: IconProp;
  ellipseIcon?: IconProp;
  color?: string;
  onPress?: () => void;
  onEllipsePress?: () => void;
}

const ImageWrapper: React.FC<Props> = ({ iconBtn, ellipseIcon, image, color, onPress, onEllipsePress }) => {
  return (
    <View>
      <Image
        style={SImageWrapper.image}
        source={{ uri: image }}
        resizeMode="cover"
      />
      {iconBtn ? (
        <TouchableOpacity
          onPress={onPress}
          style={
            iconBtn === keywords.sold
              ? SImageWrapper.sold
              : SImageWrapper.likeIcon
          }>
          {iconBtn === keywords.sold ? (
            <Text style={SImageWrapper.text}>{iconBtn}</Text>
          ) : (
            <FontAwesomeIcon icon={iconBtn} color={color} />
          )}
        </TouchableOpacity>
      ) : null}
      {
        ellipseIcon &&
        <TouchableOpacity
          onPress={onEllipsePress}
          style={
            SImageWrapper.ellipse
          }>
          <FontAwesomeIcon icon={ellipseIcon} color={'black'} size={20}/>
        </TouchableOpacity>
      }
    </View>
  );
};

export default ImageWrapper;
