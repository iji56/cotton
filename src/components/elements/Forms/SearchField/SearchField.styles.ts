import { StyleSheet } from 'react-native';

const SearchField = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  input: {
    width: 150,
    flex: 1,
    height: 45,
    paddingLeft: 10,
    paddingRight: 10,
    color: "black"
  },
  icon: {
    marginHorizontal: 16,
  },
});

export default SearchField;
