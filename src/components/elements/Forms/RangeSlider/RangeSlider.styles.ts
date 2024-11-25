import { Platform, StyleSheet } from 'react-native';

const SRangeSlider = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  slide: {
    width: '70%',
    height: 20,
    transform: Platform.OS === 'ios' ? [{ scaleY: 1, }] : [{ scaleY: 1, }]
  },
  text: {
    fontWeight: 'bold',
    color: 'black'
  },
});

export default SRangeSlider;
