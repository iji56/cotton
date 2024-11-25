import { theme } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const LIMS = StyleSheet.create({
  backgroundContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    display: 'flex',
    
    width: '100%',
    borderRadius: 10,
    backgroundColor: theme.colors.background,
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 40,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  modalHeader: {
    marginBottom: 14,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'black',
  },
  closeText: {
    color: 'white',
  },
});

export default LIMS;