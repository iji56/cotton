import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window')


const SOSLP = StyleSheet.create({
    mainContainer: {
        // paddingBottom: 100,
        backgroundColor: palette.lightGrey
    },
    infoCard: {
        backgroundColor: palette.white,
        paddingHorizontal: 10
    },
    listingContainer: {
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        backgroundColor: palette.white,
    },
    infoContainer: {
        width: '110%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical: 10,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        backgroundColor: palette.white,
    },
    infoRow: {
        flex: 1,
        justifyContent: 'space-around',
    },
    line: {
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
    },
    iconContainer: {
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: palette.black,
        paddingVertical: 10
    },
    userContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingVertical: 10,
        borderColor: palette.lightGrey,
    },
    userImage: {
        width: 30,
        height: 30,
        resizeMode: 'stretch',
        borderRadius: 15,
        marginRight: 10,
    },
    username: {
        fontSize: fontScale(16),
        color: palette.black
    },
    copyText: {
        color: palette.darkBlue,
        textDecorationLine: 'underline',
    },
    copyContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        paddingTop: 10,
        paddingBottom: 20,
        borderColor: palette.lightGrey,
    },
    WhenItemShipBack: {
        fontSize: fontScale(11),
        color: palette.black,
        textAlign: 'center',
        alignSelf: 'center'
    },
    bottom: {
        marginTop: 6,
        paddingVertical: 10,
        backgroundColor: palette.white,
        paddingHorizontal: 10
    },
    bottomText: {
        borderColor: palette.black,
        marginVertical: 5,
        color: palette.black,
        fontSize: fontScale(16),
    },
    iconButton: {
        padding: 10
    },
    trackTitle: {
        flexDirection: 'row',
        marginTop: 10
    },
    lendStepsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    lendStepNumber: {
        textAlign: 'center',
        width: 26,
        height: 26,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 243, 176, 1)',
        marginVertical: 5,
        textAlignVertical: 'center',
    },
    lendStep: {
        width: width * 0.9,
        fontSize: fontScale(16),
        color: palette.black,
        lineHeight: 25,
        marginVertical: 5,
        paddingLeft: 5,
        paddingRight: 10
    },
    button:{
        width: '90%',
        height: 50,
        margin: 20,
        marginBottom: 5
    },
    congratulationMessage:{
        margin: 20,
        fontSize: fontScale(16),
        lineHeight: 25,
    },
    checkIcon: {
        // marginTop: 20,
        width: 50,
        height: 50,
        alignSelf: 'center'
    },
    requestSent: {
        alignItems: 'center',
        marginTop: 10
    },
});

export default SOSLP;