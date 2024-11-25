import { theme } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const LIS = StyleSheet.create({
  mainContainer: {
    gap: 8,
    display: 'flex',
    flexDirection: 'row',
    margin: 8,
  },
  altContainer: {
    height: 220,
    display: 'flex',
    justifyContent: 'center',
    margin: 8,
  },
  addContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  selectedContainer: {
    gap: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  imageAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    borderRadius: 8,
    gap: 6,
  },
  singleImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
  },
  coverImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: theme.colors.primary
  },
  selectedImages: {
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 10,
    right: 10,
    top: 10,
  },
  caption: {
    textAlign: 'center',
    fontSize: 12,
    color: 'grey'
  }
})

export default LIS;