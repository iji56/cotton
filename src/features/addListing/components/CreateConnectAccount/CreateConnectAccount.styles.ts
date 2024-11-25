import { palette, theme } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

export const CCAS = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  bottomButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
  },
  buttonText: {
    color: palette.black,
    marginLeft: 15
  },
  input: {
    marginVertical: 10,
    backgroundColor: palette.lightGrey,
    borderWidth: 0,
    height: 50,
    borderRadius: 5,
  },
  dob: {
    marginVertical: 12,
    paddingVertical: 16,
    paddingLeft: 15,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: palette.lightGrey,
  },
  text: {
    color: palette.darkGrey,
    marginLeft: 10
  },
  stateInput: {
    marginVertical: 10,
    backgroundColor: palette.lightGrey,
    borderWidth: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  itemContainer: {
    borderColor: palette.darkGrey,
    width: width * 0.9,
    paddingLeft: 20,
  },
  item: {
    marginVertical: 5,
    paddingVertical: 10,
  },
  errorText: {
    color: palette.red,
    marginBottom: 5,
    fontSize: 12,
    marginLeft: 2
  },
  button: {
    position: 'absolute',
    width: width,
    bottom: 10,
    height: 40,
    marginVertical: 5,
    alignItems: 'center',
    zIndex: 0,
  },
  flex1: { flex: 1 },
})