import { palette, theme } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const SAS = StyleSheet.create({
  body: {
    backgroundColor: '#fff9ef',
    flex: 1,
  },
  header: {
    alignSelf: 'center',
    resizeMode: 'contain',
    aspectRatio: '7/9',
    width: 100,
    height: '30%',
  },
  container: {
    flex: 1,
  },
  imageStyle: {
    width: '100%',
    height: '40%',
    resizeMode: 'contain'
  },
  parentContainer: {
    flex: 1,
    backgroundColor: palette.white,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  headerButton: {
    position: 'absolute',
    top: 1,
    left: 0,
  },
  headerTitle: {},
  nav: {},
  mainContainer: {},
  detailsContainer: {},
  inputMainContainer: {
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingBottom: 50
  },
  inputContainer: {
    // paddingTop: 8,
  },
  inputContainerError: {
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: 'red',
  },
  textInputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.black,
    // marginVertical: 10
  },
  textInputLabelError: {
    fontSize: 12,
    color: 'red',
  },
  textInput: {
    width: '100%',
    // marginTop: 4,
    fontSize: 14,
    backgroundColor: palette.lightGrey,
    borderWidth: 0
  },
  error: {
    marginBottom: 2,
    color: palette.red,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
  },
  submissionContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  buttonInput: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: width * 0.9,
    height: 50,
    marginTop: 10,
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
  login: {
    marginVertical: 10
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
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: palette.black
  },
  bottomText: {
    marginHorizontal: 10,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
  },
  forgotPassword: {
    fontSize: 14,
    color: palette.darkBlue,
    fontWeight: '300',
    textAlign: 'right'
  },
  newUser: { fontSize: 14, color: palette.darkBlue },
  signUp: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: width * 0.8,
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.08,
    marginHorizontal: 10,
  },
  bottomLoginButton: {
    // backgroundColor: 'rgba(190, 180, 0, 0.05)',
    borderWidth: 1,
    borderColor: palette.lightGrey,
    borderRadius: 5,
    width: width * 0.3,
    height: height * 0.1,
    padding: 10,
    justifyContent: 'center'
  },
  logo: {
    alignSelf: 'center',
    width: 30,
    height: 30,
  },
  buttonContainer: {
    alignItems: 'center'
  },
});