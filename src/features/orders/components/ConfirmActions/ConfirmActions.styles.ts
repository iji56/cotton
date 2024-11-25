import { StyleSheet } from "react-native";

export const SCA = StyleSheet.create({
  mainContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  header: {
    fontSize: 14,
    marginBottom: 14,
  },
  subHeader: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 8,
    backgroundColor: 'black'
  },
  actionButtonText: {
    textAlign: 'center',
    paddingVertical: 6,
    color: 'white'
  },
  actionButtonAlt: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 8,
  },
  actionButtonTextAlt: {
    textAlign: 'center',
    paddingVertical: 6,
  }
})