import { StyleSheet } from 'react-native';
import { theme } from '@/components/styles/theme';

const STag = StyleSheet.create({
  container: {
    flex: 0,
    minWidth: 60,
    height: 32,
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: theme.colors.foreground,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  text: {
    textAlign: 'center',
    color: theme.colors.foreground,
  },
});

export default STag;
