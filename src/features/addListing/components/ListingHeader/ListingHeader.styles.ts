import { StyleSheet } from 'react-native';

const LHS = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerNavItem: {
    marginLeft: 12,
  },
  settingsContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    marginLeft: 20,
  },
});

export default LHS;