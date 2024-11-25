import { colors } from "@/global/colors";
import { StyleSheet } from "react-native";

export const SBCH = StyleSheet.create({
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
  customButton: {
    backgroundColor: "transparent",
    borderColor: colors.background,
    borderWidth: 1,
    borderRadius: 5,
		padding: 5,
		width: '25%'
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
	heading: {
		fontSize: 32
	}
});