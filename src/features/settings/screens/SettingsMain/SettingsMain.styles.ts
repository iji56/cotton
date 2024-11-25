import { palette } from '@/components/styles/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');

const SPS = StyleSheet.create({
  navContainer: {
    // flexGrow: 1,
    // marginVertical: 12,
    // height: height * 0.7,
    paddingBottom: 200
  },

  navButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
    paddingBottom: 20,
  },
  secondaryButtonText: {
    color: 'grey',
  },
  secondaryNavContainer: {
    // position: 'absolute',
    // width: width * 0.95,
    marginTop: 20,
    height: 40,
    marginBottom: 30,
  },
  accountAction: {
    marginTop: 20,
    marginBottom: 10,
  },
  checkIcon: {
    marginTop: 20,
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 15,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 9,
  },
  bottomHeader: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
  },
  text: {
    marginVertical: 10,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  message: {
    marginVertical: 10,
  },
  buttonContainer: {
    // position: 'absolute',
    // bottom: 10,
    height: 90,
    width: '98%',
    alignSelf: 'center',
  },
  emptyView: {
    height: 10,
  },
  version: {
    textAlign: 'center',
    color: palette.darkGrey,
    zIndex: -1,
  },
  settingsOption: {
    color: '#333333',
    fontWeight: '400',
    fontSize: 16,
  },
});

export default SPS;
