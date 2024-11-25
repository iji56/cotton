import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

export const SOH = StyleSheet.create({
  mainContainer: {
    backgroundColor: palette.white,
  },
  centerParent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  betweenParent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  headerTitle: {
    fontSize: fontScale(22),
    marginLeft: 30,
    color: palette.black,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 0,
  },
  dollorIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },

})