import { palette } from '@/components/styles/theme';
import { fontScale } from '@/utils/fontScale';
import { StyleSheet } from 'react-native';

const SImageWrapper = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: '83/96',
    backgroundColor: '#B5B5B5',
    position: 'relative',
  },
  likeIcon: {
    position: 'absolute',
    top: 10,
    right: 35,
    padding: 10
  },
  ellipse: {
    position: 'absolute',
    top: 5,
    right: -5,
    padding: 10
  },
  sold: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.lightYellow,
    borderRadius: 5,
  },
  text: {
    fontSize: fontScale(11),
    fontWeight: 'bold',
    color: palette.black
  }
});

export default SImageWrapper;
