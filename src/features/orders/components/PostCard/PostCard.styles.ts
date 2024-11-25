import { theme } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const PCS = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 160, // half of wrapper
    marginBottom: 24,
    marginRight: 10,
    gap: 2,
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  headLines: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
    fontSize: 14,
  },
  userLocation: {
    fontWeight: '500',
    fontSize: 12,
    color: 'grey'
  },
  title: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  caption: {
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