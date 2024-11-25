import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const FLV = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  divider: {
    borderWidth: 0.5,
    marginHorizontal: 8,
    height: 30,
    alignSelf: 'center'
  },
  line: {
    width: '100%',
    borderWidth: 1,
    borderColor: palette.lightGrey,
    marginVertical: 15,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scrollview: {
    paddingBottom: '50%',
  },
  // text: {
  //   paddingVertical: 15,
  //   color: theme.colors.accent,
  //   fontSize: 24,
  //   fontWeight: 'bold',
  // },
  warningText: {
    marginTop: 20,
    textAlign: 'center',
    color: palette.red,
  },
  filterContainer: {
    flexDirection: 'row'
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
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
  }
});

export default FLV;
