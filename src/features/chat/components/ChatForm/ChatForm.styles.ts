import { palette, theme } from '@/components/styles/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export const SCF = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'center'
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
  },
  inputContainer: {
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width: '80%',
    height: 45,
    backgroundColor: palette.lightGrey,
  },
  textInput: {
  },
  buttonInput: {
    paddingVertical: 5,
  },
  buttonInputContent: {
    color: palette.black,
  }
});
