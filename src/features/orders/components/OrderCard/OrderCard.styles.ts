import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window')

export const SOC = StyleSheet.create({
  button: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgrey',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    paddingVertical: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'stretch',
    marginRight: 10
  },
  content: {
    justifyContent: 'flex-start',
  },
  title: {
    color: palette.black,
    paddingBottom: 4,
    fontSize: fontScale(16),
    fontWeight: 'bold',
    width: width * 0.55,
  },
  meta: {
    color: palette.black,
    fontSize: fontScale(12),
    textTransform: 'capitalize',
    width: width * 0.55,
  },
  itemStatus: {
    color: palette.black,
    fontSize: fontScale(12),
    fontWeight: 'bold',
    textTransform: 'capitalize',
    borderRadius: 5,
    // borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 243, 176, 1)',
    overflow: 'hidden'
  },
  timestamp: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    padding: 5,
  },
});
