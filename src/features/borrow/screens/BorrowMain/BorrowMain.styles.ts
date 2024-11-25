import { palette, theme } from '@/components/styles/theme';
import { StyleSheet } from 'react-native';

const SBM = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    marginRight: 10,
    backgroundColor: palette.lightGrey,
  },
  image: {
    width: '100%',
    aspectRatio: '83/96',
    position: 'relative',
  },
  actionContainer: {
    width: '100%',
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  headLines: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
    fontSize: 14,
  },
  userLocation: { fontWeight: '500', fontSize: 12, color: palette.lightGrey },
  title: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  caption: {
    gap: 2,
    backgroundColor: palette.white,
    paddingStart: 10,
    paddingVertical: 5,
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
    fontWeight: 'bold',
    color: palette.black
  },
  discount: {
    color: palette.black,
    textDecorationLine: 'none',
    fontWeight: 'bold'
  },
  actionButton: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: palette.darkBlue,
    marginBottom: 10,
    height: 45,
    justifyContent: 'center'
  },
  actionButtonDisabled: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    marginBottom: 10,
  },
  actionButtonText: {
    textAlign: 'center',
    paddingVertical: 6,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  captionContainer: {
    marginVertical: 8,
    paddingVertical: 5,
    backgroundColor: palette.white,
    paddingStart: 10,
    paddingRight: 10,
  },
  summary: {
    lineHeight: 25,
    color: palette.black,
    marginRight: 8
  },
  questionsContainer: {
    paddingVertical: 5,
    backgroundColor: palette.white,
    paddingStart: 10
  },
  borrowItemContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  borrowPeriod: {
    borderRadius: 10,
    margin: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  days: {
    color: palette.black,
    fontWeight: '500',
    fontSize: 18
  },
  price: {
    paddingTop: 5,
    color: palette.black
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { color: palette.black },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 8,
    justifyContent: 'space-between',
    backgroundColor: palette.white,
    marginTop: 5,
  },
  button: {
    height: 35,
    justifyContent: 'center'
  },
});

export default SBM;
