import { StyleSheet } from 'react-native';

/**
 * TODO: make buttons reusable components with width as an argument
 * TODO: (Fix) FontAwesome Icon adding marginHorizontal
 */
export const SPB = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 14,
  },
  profileContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 10,
  },
  highlightsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 14,
  },
  highlight: {
    fontSize: 12,
    color: 'grey',
    marginRight: 8,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  icon: {
    marginRight: 2,
    color: 'grey',
  },
  profileText: {
    marginBottom: 14,
    color: 'black',
  },
  subtitle: {
    fontSize: 12,
    color: 'grey',
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionButton: {
    width: '49%',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#08376B',
  },
  actionButtonText: {
    textAlign: 'center',
    paddingVertical: 6,
    color: 'white',
    fontWeight: 'bold'
  },
  locationWarningContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFF3B0',
    alignItems: 'center',
    marginBottom: 14,
    borderRadius: 8,
    padding: 10,
  },
  locationWarningText: {
    fontSize: 12,
    flex: 8,
    fontWeight: 'bold',
  },
  locationWarningButton: {
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: '#E6E6E6',
    padding: 5,
    alignItems: 'center',
    flex: 1,
  },
  locationWarningButtonText: {
    fontWeight: 'bold',
  },
  profileInfoContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileDescription: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
  },
  profilePanelContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 10,
  },
  leftProfilePanelContainer: {
    borderRightColor: 'lightgrey',
    borderRightWidth: 1,
  },
  verticalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginBottom: 14,
  },
});
