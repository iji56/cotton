import { palette } from '@/components/styles/theme';
import { StyleSheet } from 'react-native';

const SAddListingButton = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: palette.lightGrey,
    flex: 1,
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontWeight: '100',
    marginLeft: 16,
  },
  icon: {
    marginRight: 16,
  },
});

export default SAddListingButton;
