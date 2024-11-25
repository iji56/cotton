import { StyleSheet } from "react-native";

export const SCD = StyleSheet.create({
  mainContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  columnContainer: {
    width: '50%',
  },
  detailContainer: {
    width: '50%',
    padding: 4,
  },
  header: {
    fontSize: 14,
    marginBottom: 14,
  },
  subHeader: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  meta: {
    fontSize: 14,
    color: 'grey',
    marginRight: 16,
		textTransform: 'capitalize'
  }
})