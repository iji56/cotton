import { StyleSheet } from 'react-native';
import { palette } from '@/components/styles/theme';

const SRadioButton = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.black,
    alignItems: 'center',
    backgroundColor: palette.white,
    justifyContent: 'center',
    marginBottom: 2,
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: palette.darkBlue,
    borderColor: palette.darkBlue,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  icon: { marginLeft: 10 },
  toolTipContainer: {
    backgroundColor: '#545454',
    borderRadius: 10,
    width: '74%',
  },
  toolTipText: {
    color: palette.white, fontSize: 11
  },

});

export default SRadioButton;
