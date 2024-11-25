import { palette } from '@/components/styles/theme';
import { fontScale } from '@/utils/fontScale';
import { StyleSheet } from 'react-native';

const SLC = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
  },
  checkIcon: {
    marginTop: 20,
    alignSelf: 'center',
  },
  requestSentMessage: {
    color: palette.black,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  requestSent: {
    alignItems: 'center',
    marginTop: 20,
  },
  orderDetail: {
    marginVertical: 20,
  },
  addressUpdateContainer: {
    backgroundColor: 'rgba(255, 243, 176, 1)',
    padding: 20,
    marginTop: 20,
  },
  addressUpdateInnerContainer: {
    backgroundColor: palette.white,
    borderRadius: 10,
    padding: 20,
  },
  addressUpdateButtonContainer: {
    flexDirection: 'row',
  },

  listingContainer: {
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: palette.lightGrey,
    paddingBottom: 20,
  },
  calculationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
    paddingVertical: 20,
  },
  value: {
    color: palette.black,
    marginTop: 10,
  },
  userContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderColor: palette.lightGrey,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonContainer: {
    marginVertical: 20,
    height: 120,
  },
  button: {
    height: 35,
    justifyContent: 'center',
  },
  message: {
    fontSize: fontScale(16),
    color: palette.black,
    marginBottom: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  boldText: {
    marginTop: 5,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  updateButton: {
    marginTop: 20,
    height: 40,
  },
  space: {
    width: 20,
    height: 10,
  },
});

export default SLC;
