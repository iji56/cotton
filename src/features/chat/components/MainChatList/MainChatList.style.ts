import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const SMCL = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: palette.black,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 190,
    height: 190,
  }
})