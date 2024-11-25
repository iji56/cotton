import { StyleSheet } from 'react-native';
import { palette } from '@/components/styles/theme';

const SAccordion = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordContainer: {
    paddingBottom: 10,
  },
  accordHeader: {
    padding: 10,
    paddingBottom: 0,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: palette.black,
    // borderBottomWidth: 0.5,
  },
  accordTitle: {
    fontSize: 20,
  },
  accordBody: {
    // padding: 12,
  },
  textSmall: {
    fontSize: 16,
  },
});

export default SAccordion;
