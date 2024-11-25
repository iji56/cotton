import { StyleSheet } from "react-native";

export const SCS = StyleSheet.create({
  mainContainer: {
    marginTop: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  listingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    paddingBottom: 14,
  },
  avatarContainer: {
    marginRight: 8,
    borderRadius: 50,
  },
  content: {
    justifyContent: 'flex-start',
  },
  title: {
    paddingBottom: 4,
  },
  meta: {
    color: 'grey',
    fontSize: 12,
  },
  lineItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  altValue: {
    color: 'grey'
  },
  totalValue: {
    fontWeight: 'bold'
  }
})