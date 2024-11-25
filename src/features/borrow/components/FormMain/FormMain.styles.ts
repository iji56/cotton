import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const BSFM = StyleSheet.create({
  mainContainer: { flex: 1 },
  detailsContainer: {},
  inputContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: palette.lightGrey,
    margin: 10,
    borderRadius: 5,
    paddingLeft: 10,
    height: 50,
  },
  inputContainerError: {
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: 'red',
  },
  textInputLabel: {
    fontSize: 12,
    color: 'grey',
  },
  textInputLabelError: {
    fontSize: 12,
    color: 'red',
  },
  textInput: {
    width: '100%',
    marginTop: 4,
    paddingBottom: 8,
    fontSize: 14,
    color: palette.black
  },
  error: {
    marginBottom: 2,
    color: palette.red,
    marginLeft: 12
  },
  button: {
    marginVertical: 8,
  },
  list: {
    marginVertical: 8,
    fontWeight: '600',
  },
  divider: {
    borderBottomColor: palette.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    color: palette.darkGrey,
    textAlign: 'center',
    fontSize: 12,
  },
  imageAdd: {
    backgroundColor: palette.lightGrey,
    fontSize: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 160,
  },
  imageAddFirst: {
    backgroundColor: palette.lightGrey,
    paddingHorizontal: 'auto',
    paddingVertical: 24,
    fontSize: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  imageAddContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  selectedImagesContainer: {
    gap: 8,
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 8,
  },
  selectedImageContainer: {
    gap: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  selectedImages: {
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  singleImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 10,
    right: 20,
    top: 20,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
  },
  submissionContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    height: 40,
    width: '80%',
  },
  buttonInput: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  buttonInputContent: {
    color: 'white',
  },
  wallContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50%'
  },
  wallText: {
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '95%',
    height: 45,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.lightGrey,
    marginVertical: 10,
  },
  text: {
    color: palette.darkGrey,
    marginLeft: 10
  },
  bottomContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderColor: palette.lightGrey,
    marginTop: 10
  },
  label: {
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 5
  },
  sliderHeading: {
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  slider: {
    width: '85%'
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  textBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: palette.black,
  },
  recommendedText: {
    fontSize: 10,
    marginLeft: 30,
    marginTop: -8
  },
  checkBox: {
    marginHorizontal: 10,
    marginTop: 15
  },
  checkBoxText: {
    fontWeight: '400',
    marginLeft: 10
  },
  connnectBankButton: {
    height: 40,
    marginVertical: 10
  },
  mediaContainer: {
    paddingVertical: 40,
    backgroundColor: palette.lightGrey,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 10,
  },
  addPhoto: {
    marginTop: 10,
    fontSize: 14,
    color: palette.black,
  },
  mediaCount: {
    color: palette.black,
    fontSize: 12,
    marginVertical: 10,
    marginLeft: 10,
  },
  media: {
    width: 130,
    height: 130,
    borderRadius: 10
  },
  icon: {
    marginLeft: -25,
    padding: 5,
    height: 30,
  },
})