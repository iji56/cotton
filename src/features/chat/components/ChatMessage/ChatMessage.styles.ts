import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const CMS = StyleSheet.create({
  mainContainer: {
    marginVertical: 5,
  },
  senderWrapper: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  senderContainer: {
    padding: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 10,
    backgroundColor: palette.black,
  },
  receiverMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiverWrapper: {
    maxWidth: '80%',
  },
  receiverContainer: {
    alignSelf: 'flex-start',
    padding: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 10,
    backgroundColor: palette.darkBlue,
  },
  message: {
    color: palette.white,
  },
  time: {
    textAlign: 'right',
    fontSize: 10,
    marginTop: 2,
    marginRight: 10,
  },
});

export default CMS;
