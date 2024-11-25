import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window')

const SRC = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    paddingVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 40,
    resizeMode: 'stretch',
    marginRight: 10,
  },
  content: {
    justifyContent: 'flex-start',
  },
  title: {
    color: palette.black,
    paddingBottom: 4,
    fontSize: 14,
    fontWeight: 'bold',
    width: width * 0.55,
  },
  meta: {
    color: palette.black,
    fontSize: 12,
    textTransform: 'capitalize',
    width: width * 0.55,
  },
  itemStatus: {
    color: palette.black,
    fontSize: 12,
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
  yellowCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.yellow,
    position: 'absolute',
    left: '12%',
    bottom: '20%'
  }
});

export default SRC;