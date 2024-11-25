import { palette } from '@/components/styles/theme';
import { StyleSheet } from 'react-native';

export const SMCC = StyleSheet.create({
  button: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginHorizontal: 10,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    paddingVertical: 10,
  },
  avatarContainer: {
    marginRight: 8,
    borderRadius: 50,
  },
  content: {
    justifyContent: 'flex-start',
  },
  name: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    paddingBottom: 4,
  },
  meta: {
    color: palette.black,
    fontSize: 12,
  },
  status: {
    marginTop: 2,
    color: palette.darkGrey,
    fontSize: 12,
  },
  timestamp: {
    marginLeft: 'auto',
  }
});
