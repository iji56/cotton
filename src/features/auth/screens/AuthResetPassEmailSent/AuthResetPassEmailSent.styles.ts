import { palette, theme } from '@/components/styles/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const AUR = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    marginHorizontal: 10,
    gap: 40,
    borderColor: 'red',
    borderWidth: 2,
  },
  headerTitle: {
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '700',
    color: 'black',
    fontSize: 24,
    lineHeight: 24,
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
    color: palette.black,
    lineHeight: 24,
  },
});
