import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SFS = StyleSheet.create({
  mainContainer: {
    // borderTopWidth: 1,
    borderBlockColor: 'lightgrey'
  },
  heading: {
    marginLeft: 10,
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey
  },
  text: {
    fontSize: 16,
    color: palette.black
  },
});

export default SFS;