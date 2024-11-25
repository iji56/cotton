import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

const SBI = StyleSheet.create({
    infoText: {
        backgroundColor: 'rgba(255, 243, 176, 1)',
        textAlign: 'center',
        paddingVertical: 12,
        marginVertical: 10,
        fontSize: fontScale(16),
        fontWeight: '700',
        color: palette.black
    },
    title: {
        fontSize: fontScale(20),
        fontWeight: 'bold'
    },
    userContainer: {
        marginVertical: 10,
        flexDirection: 'row',
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        resizeMode: 'stretch',
        marginRight: 10
    },
    usernameContainer: {
        justifyContent: 'space-evenly',
        height: 40,
        alignSelf: 'center'
    },
    distanceText: {
        fontStyle: 'italic',
        fontSize: fontScale(12),
        marginVertical: 5
    },
    infoCard: {},
    infoContainer: {
        width: '110%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    infoRow: {
        flex: 1,
        justifyContent: 'space-around',
        height: 50
    },
    subHeading: {
        marginBottom: 10,
        marginTop: 20,
    },
    listingContainer: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        paddingBottom: 10
    },
    text: {
        color: palette.black
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        alignSelf: 'center',
        // borderTopWidth: 2,
        borderColor: palette.lightGrey,
        // backgroundColor: palette.white
    },
    buttonContainer: {
        width: width * 0.8,
        marginVertical: 10,
        height: height * 0.15
    },
    bottomButtons: {
        // width: 100,
        height: 35,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'rgba(3, 101, 25, 1)',
        borderRadius: 10,
        width: '45%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: palette.white,
        fontSize: fontScale(14),
        fontWeight: 'bold'
    },
    userSmallContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        marginTop: 20,
        borderTopWidth: 2,
        borderColor: palette.lightGrey
    },
    username: { marginLeft: 10 },
    input: {
        borderWidth: 0,
        backgroundColor: palette.lightGrey,
        alignItems: 'center',
        height: 80,
        fontSize: 16,
        paddingTop: 5,
    },
    note: {
        color: palette.black,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.2,
        marginVertical: 10,
    },
    noteText: {
        fontWeight: '400'
    },
    listingsContainer: {
        borderTopWidth: 2,
        borderColor: palette.lightGrey,
        paddingVertical: 20,
        marginTop: 10,
    },
    bottomSheetContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10
    },
    bottomSheetTitle: {
        marginVertical: 10
    },
    bottomSheetHeader: {
        borderTopWidth: 2,
        borderColor: palette.lightGrey
    },
    bottomSheetText: {
        marginTop: 10,
        // marginBottom: 20,
        color: palette.black,
    },
    bottomSheetButtonContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        marginLeft: 10
    },
    grayButton: {
        borderWidth: 0,
        backgroundColor: palette.lightGrey
    },
    disableButtonContainer: {
        width: '90%',
        height: 40,
        alignItems: 'center',
        marginTop: 4,
    },
    disableButton: {
        borderWidth: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '90%',
    },
    space: {
        width: 20
    },
    bottomButton: {
        position: 'absolute',
        bottom: 20,
        height: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10
    },
    boldText: {
        fontWeight: 'bold'
    },
    linkText: {
        color: palette.darkBlue,
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    checkIcon: {
        marginTop: 20,
        width: 50,
        height: 50,
        alignSelf: 'center'
    },
    requestSent: {
        alignItems: 'center',
        marginTop: 20
    },
    message: {
        backgroundColor: palette.lightGrey,
        width: width * 0.95,
        height: 80,
        padding: 10,
        marginVertical: 8,
        borderRadius: 10,
        overflow: 'hidden'
    },
});

export default SBI;