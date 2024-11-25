import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const SSA = StyleSheet.create({
  mainContainer: {},
  detailsContainer: {},
  inputContainer: {
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  inputContainerError: {
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: 'red',
  },
  textInputLabel: {
    fontSize: 12,
    color: 'grey',
  },
  textInputLabelError: {
    fontSize: 12,
    color: 'red',
  },
  textInput: {
    width: '100%',
    marginTop: 4, 
    paddingBottom: 8,
    fontSize: 14,
  },
  error: {
    marginBottom: 2,
    color: palette.red,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
  },
  submissionContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  buttonInput: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  buttonInputDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'grey',
  },
  buttonInputContent: {
    color: 'white',
  },
  load: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#91919125'
  },
  loadText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})