import { StyleSheet } from 'react-native';

const SProfileMain = StyleSheet.create({
  head: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headContainer: {
    flex: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  headBox: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    height: 64,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'column',
    gap: 4,
  },
  profile: {
    marginVertical: 10,
    gap: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: '500',
  },
  profileItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  edit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  details: {
    lineHeight: 24,
  },
});

export default SProfileMain;
