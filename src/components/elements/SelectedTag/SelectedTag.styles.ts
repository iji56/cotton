import { StyleSheet } from 'react-native';
import { theme } from '@/components/styles/theme';

const SSelectedTag = StyleSheet.create({
  container: {
    minWidth: 60,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  contents: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    paddingRight: 5,
    textAlign: 'center',
    color: theme.colors.foreground,
  },
});

export default SSelectedTag;
