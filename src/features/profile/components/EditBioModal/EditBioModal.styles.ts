import { StyleSheet } from 'react-native';
import { palette, theme } from '@/components/styles/theme';

export const SEBM = StyleSheet.create({
  backgroundContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainContainer: {
    backgroundColor: palette.white,
    borderRadius: 10,
    display: 'flex',
    height: '90%',
    width: '100%',
  },
  headerContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBlockColor: 'lightgrey'
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tertiaryButton: {
    flex: 0.25,
  },
  tertiaryText: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 12,
  },
  errorMessage: {
    marginTop: 4,
    marginBottom: 14,
    color: theme.colors.danger,
    fontSize: 14,
    textAlign: 'center'
  },
  pictureContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarContainer: {
    marginBottom: 6,
  },
  inputButton: {
    fontSize: 12,
  },
  inputContainer: {},
  textInput: {
    width: '100%',
    padding: 10,
    marginBottom: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: '#bdb9b9',
    borderRadius: 5,
  },
  textInputLarge: {
    width: '100%',
    height: 100,
    padding: 10,
    marginBottom: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: '#bdb9b9',
    borderRadius: 5,
  },
});