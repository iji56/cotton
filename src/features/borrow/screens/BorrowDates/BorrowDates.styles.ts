import { palette } from "@/components/styles/theme";
import { colors } from "@/global/colors";
import { StyleSheet } from "react-native";

export const SBD = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    paddingHorizontal: 15
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
    backgroundColor: colors.background,
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
  days: {
    fontSize: 14,
    color: palette.black
  },
  actionContainer: {
    width: '100%',
  },
  actionButton: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: palette.darkBlue,
    marginBottom: 10,
    height: 45,
    justifyContent: 'center'
  },
  actionButtonText: {
    textAlign: 'center',
    paddingVertical: 6,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  customButton: {
    backgroundColor: "transparent",
    borderColor: colors.background,
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
  distanceMessageContainer: {
    backgroundColor: '#FFF3B0', //palette.yellow,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  distanceMessage: {
    color: palette.black,
    lineHeight: 20
  },
  note: { fontWeight: 'bold', color: palette.black, fontSize: 12 },
  noteMessage: { fontWeight: '400', fontSize: 12 },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: palette.lightGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginVertical: 15,
    height: 50,
  },
  buttonMainContainer: {
    backgroundColor: palette.white,
    borderTopWidth: 2,
    borderColor: palette.lightGrey
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  button: {
    height: 35,
    justifyContent: 'center'
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: palette.lightGrey,
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF3B0',
    paddingVertical: 5,
  },
  permissionText: {
    flex: 0.9,
    fontSize: 14,
    color: palette.black,
    lineHeight: 20,
  },
  addressInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: -1
  },
  addressContainer: {
    flex: 1,
    marginBottom: 20
  },
  addressInputMainContainer:{
    marginHorizontal: 5,
    maxHeight: 100,
  },
  addressInputContainerStyle:{
    position: 'relative',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    margin: 0,
    zIndex: 999
  },
  addressInputStyle:{
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    margin: 0,
  },
  addressInput: {
    flex: 0.8,
    borderWidth: 0,
  },
  addressButton: {
    flex: 0.2,
    backgroundColor: palette.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    borderRadius: 5,
    height: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.lightGrey,
    marginVertical: 10,
  },
});