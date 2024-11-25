import { StyleSheet } from "react-native";

const CIV = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    flexDirection: 'row',
    // marginTop: 20,
    justifyContent: 'space-between',
    margin: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'stretch',
    marginRight: 10
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    padding: 5,
  },
  title: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  caption: {
    flex: 1,
    gap: 2,
  },
  details: {
    gap: 3,
  },
  category: {
    display: 'flex',
    gap: 5,
    flex: 1,
    flexDirection: 'row',
    fontSize: 12,
  },
  subTitleDetails: {
    color: '#757575',
  },
  buyPrice: {
    fontWeight: '500',
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  originalPrice: {
    fontWeight: '500',
  },
});

export default CIV;