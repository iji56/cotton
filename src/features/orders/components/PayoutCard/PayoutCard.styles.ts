import { StyleSheet } from "react-native";

export const SPC = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    paddingVertical: 10,
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
  status: {
    marginLeft: 'auto',
  },
  complete: {
    color: 'green',
  }
})