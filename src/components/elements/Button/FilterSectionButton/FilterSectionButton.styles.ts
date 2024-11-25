import { StyleSheet } from 'react-native';
import { palette, theme } from '@/components/styles/theme';

const SFilterSectionButton = StyleSheet.create({
  button: {
    // display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 80,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    borderWidth: 0.5,
  },
  text: {
    // marginTop: 6,
    fontSize: 12,
    color: 'black'
  },
});

export default SFilterSectionButton;
