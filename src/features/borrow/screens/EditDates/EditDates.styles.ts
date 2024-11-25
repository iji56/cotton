import { palette, theme } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const SED = StyleSheet.create({
  container: {
    marginTop: 50
  },
  selectOptions: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  main: {
    marginHorizontal: 20,
    paddingVertical: 15
  },
  divider: {
    width: "100%",
    backgroundColor: theme.colors.background,
    height: 1,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: 'space-around'
  },
  textShow: {
    marginVertical: 30,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  text: {
    fontSize: 14,
    fontWeight: "700"
  },
  customButton: {
    backgroundColor: "transparent",
    borderColor: theme.colors.background,
    borderWidth: 1,
    borderRadius: 5
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  switchContainer: {
    position: 'absolute',
    right: -12,
  },
  switch: {
    transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }]
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
  buttonDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
  },
  buttonInputContent: {
    color: 'white',
  },
  modalBackground: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    display: 'flex',
    width: '80%',
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  navButton: {
    marginVertical: 6,
  },
  navNuttonText: {
    color: 'grey',
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
  },
  mainContainer: {
    paddingVertical: 8,
  },
  borrowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerTitle: {
    fontSize: 16,
  },
  backButton: {
  },
})