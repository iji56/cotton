import { StyleSheet } from 'react-native';
import { palette, theme } from '@/components/styles/theme';

export const SAM = StyleSheet.create({
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    resizeMode: 'cover'
  },
  header: {
    marginTop: 320,
    resizeMode: 'contain',
    width: 150
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: palette.darkBlue,
    color: palette.white,
  },
  buttonAccent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.white,
    borderRadius: 5,
  },
  buttonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonAccentText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: palette.white,
    fontWeight: 'bold',
  },
  linkText: {
    textDecorationLine: 'underline'
    // color: palette.darkBlue,
    // fontSize: 12,
    // textAlign: 'center',
    // fontWeight: 'bold',
    // lineHeight: 25,
  },
  resetPasswordContainer: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey
  },
  resetPasswordText: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.black,
  },
  resetPasswordDetailContainer: {
    padding: 10,
    top: 15,
  },
  welcomeTextContainer: {
    gap: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 0.5,
    color: palette.black,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: palette.black,
  },

  resetButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: 410,
    height: 79,
    gap: 25,
    borderColor: palette.white,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 358,
    height: 43,
    borderRadius: 8,
    gap: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.darkBlue,
  },
  resetButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
})
