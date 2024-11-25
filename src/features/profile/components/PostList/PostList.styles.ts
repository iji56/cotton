import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window')
export const PLS = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
    marginBottom: 5,
    marginTop: 5,
  },
  columnItem: {
    width: '49%', // Adjust the width to create space between columns
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
  warningText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'grey',
    fontWeight: 'bold',
  },
  iconContainer: {
    backgroundColor: '#E6EBF0',
    padding: 20,
    borderRadius: 100,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    width: width
  },
  itemText: {
    paddingLeft: 10
  }
});
