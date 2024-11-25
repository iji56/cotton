import { StyleSheet } from 'react-native';
import { palette } from '@/components/styles/theme';

const SFeedItem = StyleSheet.create({
  container: {
    width: '49%', // half of wrapper
    marginBottom: 24,
    marginRight: 10,
    gap: 2,
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  image: {
    width: '100%',
    aspectRatio: '83/96',
    position: 'relative',
  },
  headLines: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
    fontSize: 14,
    color: 'black',
  },
  userLocation: {
    fontWeight: '500',
    fontSize: 12,
    color: 'grey',
  },
  title: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  caption: {
    gap: 2,
  },
  details: {
    gap: 3,
  },
  category: {
    display: 'flex',
    gap: 5,
    flex: 1,
    flexDirection: 'row',
    fontSize: 12,
  },
  subTitleDetails: {
    color: '#757575',
  },
  buyPrice: {
    fontWeight: '500',
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  originalPrice: {
    fontWeight: '500',
  },
});

export default SFeedItem;
