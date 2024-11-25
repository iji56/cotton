import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window')

export const SFP = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    width: width * 0.9,
  },
  itemText: {
    paddingLeft: 10
  },
  heading: {
    marginVertical: 20,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 8,
    justifyContent: 'flex-start',
    width: width * .95,
    marginVertical: 2,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey
  },
  buttonText: {
    color: palette.red,
    paddingLeft: 20
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 40,
    alignSelf: 'center'
  },
  bottomButton: { height: 40, marginVertical: 10 },
  input: { borderWidth: 0, backgroundColor: palette.lightGrey, marginTop: 5 },
  blockContainer: {
    width: width * 0.9,
  },
  blockBody: { borderTopWidth: 1, borderColor: palette.lightGrey },
  label:{
    marginVertical: 8,
    color: palette.black,
  }
})