import { theme } from '@/components/styles/theme';
import { StyleSheet } from 'react-native';

const SSS = StyleSheet.create({
  Container: {
    width: '100%',
  },
  innerComponents: {
    width: '45%',
    height: 44,
    // backgroundColor: 'yellow',
    paddingTop: 5,
    paddingLeft: 1,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 1)',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  Description: {
    width: '100%',
    marginBottom: 20,
    paddingTop: 8,
    paddingLeft: 14,
    flexDirection: 'row',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(51, 51, 51, 1)',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: '98%',
    gap: 20,
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 0,
  },
  innerContainer: {
    width: '98%',
    gap: 8,
    alignSelf: 'center',
    paddingTop: 8,
    paddingLeft: 5,
  },
  innerContainer2: {
    width: '98%',
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 5,
  },
  CustomText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(51, 51, 51, 1)',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  custInp: {
    width: '98%',
    height: 65,
    gap: 6,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingLeft: 5,
    borderBottomWidth: 0.6,
    borderColor: 'lightgray',
  },
  text: { fontSize: 14, fontWeight: '500', color: 'rgba(51, 51, 51, 1)' },

});

export default SSS;
