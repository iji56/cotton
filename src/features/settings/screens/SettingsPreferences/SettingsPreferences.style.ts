import { StyleSheet } from "react-native";

export const SSP = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
  },
  containerHeader: {
    marginBottom: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  switchContainer: {
    position: 'absolute',
    right: -8,
  },
  switch: {
    transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }]
  },
});