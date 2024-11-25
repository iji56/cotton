import { palette, theme } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const SUS = StyleSheet.create({
  body: {
    backgroundColor: '#fff9ef',
    flex: 1,
  },
  header: {
    marginVertical: 10,
    marginBottom: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerButton: {
    position: 'absolute',
    top: 1,
    left: 0,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  progressLine: {
    borderWidth: 2,
    width: 60,
    borderRadius: 5,
    margin: 5,
    borderColor: palette.lightGrey
  },
  halfColoredLine: {
    borderWidth: 2,
    width: 30,
    borderColor: palette.darkBlue,
    borderRadius: 5
  },
  remainingLine: {
    borderWidth: 2,
    width: 30,
    borderColor: palette.lightGrey,
    borderRadius: 5
  },
  headerTitle: {
    marginTop: -10,
    marginBottom: 20,
    fontWeight: '300'
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: palette.lightGrey,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  nav: {},
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    marginHorizontal: 10
  },
  detailsContainer: {},
  inputContainer: {
    borderColor: 'grey',
  },
  textInputContainer: {
    backgroundColor: palette.lightGrey,
    // height: 20,
    // marginVertical: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  inputContainerError: {
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: 'red',
  },
  label: {
    fontSize: 12,
    color: palette.darkGrey,
    marginLeft: 15,
    marginTop: '1%',
    fontWeight: 'bold'
  },
  textInputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.black,
  },
  textInputLabelError: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginVertical: 10
  },
  textInput: {
    width: '100%',
    fontSize: 14,
    borderWidth: 0,
    backgroundColor: palette.lightGrey,
  },
  error: {
    marginLeft: 5,
    color: palette.red,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
  },
  submissionContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    bottom: 10,
    zIndex: 999999,
  },
  buttonInput: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  buttonInputAlt: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.colors.background,
    backgroundColor: theme.colors.background
  },
  userImage: {
    width: 110,
    height: 110
    , borderRadius: 60,
    borderColor: palette.darkGrey,
    borderWidth: 1
  },
  buttonInputDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'grey',
  },
  buttonInputContent: {
    color: 'white',
  },
  buttonInputContentAlt: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 12,
  },
  load: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#91919125'
  },
  loadText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationImage: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: '10%',
  },
  logo: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 0
  },
  passwordHintText: {
    color: palette.darkGrey,
    fontSize: 16,
    marginVertical: 3
  },
  locationMessage: {
    fontSize: 14,
    color: palette.black,
    lineHeight: 25,
    marginTop: 20
  },
  skipButton: {
    marginVertical: 10,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    width: '100%',
    marginTop: 4,
    fontSize: 14,
    borderWidth: 0,
    backgroundColor: palette.lightGrey,
  },
  editButton: {
    position: 'absolute',
    padding: 8,
    backgroundColor: palette.lightGrey,
    borderRadius: 5,
    top: '18%',
    right: '34%'
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
  },
  linkText: {
    color: palette.darkBlue,
    textDecorationLine: 'underline'
  },

  container: {
    flex: 1,
  },
  map: {
    flex: 0.45,
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  descriptionContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  addressDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressText: {
    marginLeft: 10
  },
  suitInput: {
    backgroundColor: palette.lightGrey,
    borderWidth: 0,
    marginVertical: 10,
  },
  instructionInput: {
    backgroundColor: palette.lightGrey,
    borderWidth: 0,
    lineHeight: 18,
    marginVertical: 10
  },
  button: {
    position: 'absolute',
    height: 40,
    width: '90%',
    bottom: 20,
    alignSelf: 'center'
  },
  mainText: {
    fontSize: 12,
    fontWeight: 'bold'
    , color: palette.black,
    marginVertical: 2
  },
  secondaryText: {
    fontSize: 12,
    color: palette.black,
    marginVertical: 2
  },
});