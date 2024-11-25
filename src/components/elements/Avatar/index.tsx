import React from 'react';
import FastImage from 'react-native-fast-image'
import SAvatar from '@/components/elements/Avatar/Avatar.styles';

type Props = {
  avatar: null | string;
  size?: null | 'xs' | 's' | 'm';
}

const getSizeStyle = (size: string) => {
  switch (size) {
    case 'xs':
      return { width: 24, height: 24 };
    case 's':
      return { width: 32, height: 32 };
    case 'm':
      return { width: 48, height: 48 };
    default:
      return { width: 48, height: 48 };
  }
};

const Avatar: React.FC<Props> = ({ avatar, size = 'medium' }) => {
  const sizeStyle = getSizeStyle(size);
  const image = avatar ? avatar : 'https://placecage.vercel.app/placecage/g/200/300';

  return <FastImage
    source={{ uri: image, cache: 'web', priority: 'high' }}
    style={[SAvatar.avatar, sizeStyle]}
  />;
};

export default Avatar;
