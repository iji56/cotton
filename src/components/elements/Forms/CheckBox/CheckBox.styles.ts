import { StyleSheet } from 'react-native';
import { palette } from '@/components/styles/theme';

const SCheckBox = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  box: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  unchecked: {
    borderColor: palette.black,
  },
  checked: {
    borderColor: '#08376B',
    backgroundColor: '#08376B',
  },
  checkmark: {
    color: palette.white,
    fontWeight: '400',
  },
  label: {
    marginLeft: 5,
    color: palette.black,
    fontWeight: 'bold',
  },
});

export default SCheckBox;
