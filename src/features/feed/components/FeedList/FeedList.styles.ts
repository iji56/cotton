import { Dimensions, StyleSheet } from 'react-native';
import { palette, theme } from '@/components/styles/theme';

const { width } = Dimensions.get('window')

const SFL = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 200,
    marginTop: 5,
  },
  divider: {
    borderWidth: 0.5,
    marginHorizontal: 8,
    height: 30,
    alignSelf: 'center',
  },
  text: {
    paddingVertical: 15,
    color: theme.colors.accent,
    fontSize: 24,
    fontWeight: 'bold',
  },
  warningText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'grey',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: palette.lightGrey,
  },
  icon: { width: 15, height: 15 },
  selectedFilter: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 20,
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF3B0',
    paddingVertical: 5,
  },
  permissionText: {
    flex: 0.8,
    fontSize: 11,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  location: {
    color: palette.darkBlue,
    marginLeft: 3,
  },
  locationText: {
    flexDirection: 'row',
    marginVertical: 10,
    marginLeft: 5,
    color: 'black',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    width: width * 0.9,
  },
  itemText: {
    paddingLeft: 10
  },
  heading: {
    marginVertical: 20,
    fontWeight: 'bold',
  },
  input: { borderWidth: 0, backgroundColor: palette.lightGrey, marginTop: 5 },
  bottomButton: { height: 40, marginVertical: 1},
});

export default SFL;
