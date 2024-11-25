import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SOLC = StyleSheet.create({
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
    }
});

export default SOLC;