import { StyleSheet } from "react-native";

const ATS = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  titleContainer: {
    paddingVertical: 12,
  },
  nestedContainer: {
    display: 'none',
    paddingBottom: 12,
  },
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
  nestedText: {
    color: 'grey',
  }
})

export default ATS;