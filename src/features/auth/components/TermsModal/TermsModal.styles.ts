import { palette, theme } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const TMS = StyleSheet.create({
  backgroundContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: palette.white,
    paddingHorizontal: 20,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20
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
    fontSize: 14,
    lineHeight: 20,
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
  button: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: '90%',
    height: 40,
    marginVertical: 20,
  },
  content: {
    paddingBottom: '20%',
  },
})