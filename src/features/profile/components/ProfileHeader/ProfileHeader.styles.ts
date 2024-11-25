import { StyleSheet } from 'react-native';

const SPH = StyleSheet.create({
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
    padding: 10,
  },
  settingsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 1,
    left: 0,
  }
});

export default SPH;