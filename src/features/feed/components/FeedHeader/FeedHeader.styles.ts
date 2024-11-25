import { StyleSheet } from 'react-native';

const SFeedHeader = StyleSheet.create({
  container: {
    paddingBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgrey',
  },
  profileContainer: {
    paddingBottom: 10,
  },
  flexParent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  logoContainer: {},
  logo: {
    marginTop: 10,
    width: 110,
    height: 50,
    resizeMode: 'contain',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  favorite: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 20,
    marginLeft: 5,
  },
  header: {
    fontSize: 16,
  },
  stackHeader: {
    marginLeft: 10,
    marginVertical: 20,
  },
  favourite: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SFeedHeader;
