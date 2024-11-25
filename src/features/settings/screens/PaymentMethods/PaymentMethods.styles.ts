import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const SSS = StyleSheet.create({
  submissionContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  listContainer: {
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 10
  },
  buttonInput: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  buttonInputContent: {
    color: 'white',
  },
  wallContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50%'
  },
  wallText: {
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
    paddingVertical: 20,
  },
  icon: {
    marginRight: 10,
    alignSelf: 'center'
  },
  secondaryText: { fontSize: 12, color: palette.black, marginVertical: 2 },
  default: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: 'center',
    backgroundColor: palette.lightGrey,
    width: 70,
    borderRadius: 5,
    margin: 5,

  },
  defaultText: {
    fontSize: 12,
    color: palette.black
  },
  editIcon: {
    marginLeft: 20,
  },
  plusIcon: {
    padding: 5,
  },
  bottomButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
  },
  bottomContainer: {
    marginHorizontal: 10
  },
  buttonText: {
    color: palette.black,
    marginLeft: 15
  },
})