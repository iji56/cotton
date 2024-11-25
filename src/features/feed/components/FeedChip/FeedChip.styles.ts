import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const SFC = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
    marginVertical: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: palette.lightGrey//'#FFEF8F',
  },
  selectedContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFD700',//'#D69900',
  },
  cancelContainer: {
    marginLeft: 10
  },
  mainText: {
    color: palette.black, //'#D69900',
    // fontWeight: 'bold',
    textAlign: 'center'
  },
  selectedText: {
    color: palette.black,
    fontWeight: 'bold',
    textAlign: 'center',
    verticalAlign: 'top'
  },
  image: {
    width: 12,
    height: 12,
    marginRight: 5,
  }
})