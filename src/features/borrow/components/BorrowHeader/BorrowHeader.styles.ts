import { palette } from '@/components/styles/theme';
import { StyleSheet } from 'react-native';

const SBH = StyleSheet.create({
  mainContainer: {
    paddingVertical: 8,
    backgroundColor: palette.white
  },
  borrowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  iconsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 16,
  },
  backButton: {
    marginRight: 20,
    marginLeft: 10
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },

  cancelText: { fontSize: 20, color: palette.darkGrey },

});

export default SBH;
