import { StyleSheet } from 'react-native';
import { palette, theme } from '@/components/styles/theme';
const SAM = StyleSheet.create({
  resetPasswordContainer: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: palette.lightGrey,
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
});
export default SAM;
