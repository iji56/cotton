import { StyleSheet } from "react-native";

const LTS = StyleSheet.create({
  slidersContainer: {},
  sliderContainer: {
    marginVertical: 14,
  },
  slider: {
    width: '100%',
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    flexWrap: 'nowrap',
  },
  sliderTitle: {
    marginTop: 10,
    marginBottom: 4,
  },
  sliderLabel: {
    // we have to force width due to varying string width
    width: 60,
    color: 'grey',
    fontSize: 10,
  },
  sliderLabelMiddle: {
    width: 60,
    color: 'grey',
    fontSize: 10,
    textAlign: 'center',
  },
  sliderLabelRight: {
    width: 60,
    color: 'grey',
    fontSize: 10,
    textAlign: 'right',
  },
  submissionContainer: {
    marginTop: 24,
  },
  submissionBody: {
    textAlign: 'center',
    color: 'grey',
  },
  submissionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  buttonLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLinkText: {
    textAlign: 'center',
  },
  buttonInput: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  buttonInputContent: {
    color: 'white',
  },
  load: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#91919125'
  },
  loadText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default LTS;