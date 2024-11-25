import { StyleSheet } from 'react-native';
import { theme } from '@/components/styles/theme';

const STab = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.inactive,
    borderBottomWidth: 1,
  },
  labelStyle: {
    color: theme.colors.foreground,
    textTransform: 'capitalize',
  },
  indicatorStyle: {
    backgroundColor: theme.colors.foreground,
  },
});

export default STab;
