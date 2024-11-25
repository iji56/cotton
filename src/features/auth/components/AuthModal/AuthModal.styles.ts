import { StyleSheet } from "react-native";

export const SAM = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 50,
    borderRadius: 5,
    backgroundColor: '#fff9ef',
  },
  modalAssist: {
    height: 4,
    width: 40,
    borderRadius: 2,
    backgroundColor: '#bdb9b9',
    marginBottom: 40,
  },
  modalForm: {
    width: '100%',
  },
  header: {
    color: '#202020',
    textAlign: 'center',
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#8f857d',
  },
  link: {
    marginTop: 10,
    marginBottom: 30,
    color: '#8f857d'
  },
  input: {
    padding: 10,
    marginBottom: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: '#bdb9b9',
    borderRadius: 5,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: '#202020',
    color: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
  },
})

// offwhite #fff9ef
// grey #8f857d
// lightgrey #bdb9b9
// darkgrey 
// black #202020
// yellow #f9f137