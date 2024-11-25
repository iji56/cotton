import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SR = StyleSheet.create({
    mainContainer: {
        paddingBottom: 100,
        backgroundColor: palette.white
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
    marginTop10: {
        marginTop: 10
    },
    marginVertical10: {
        marginVertical: 10
    },
    star: {
        marginHorizontal: 3,
        marginVertical: 10,
    },
    starContainer: {
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        paddingBottom: 10,
        marginBottom: 10,
    },
    button: {
        position: 'absolute',
        bottom: 10,
        width: '90%',
        height: fontScale(40),
        alignSelf: 'center'
    },
    mediaMainContainer: {
        flex: 1,
        flexDirection: 'row',
        height: fontScale(100),
        borderRadius: 10,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaContainer: {
        flex: 1,
        backgroundColor: palette.lightGrey,
        height: fontScale(100),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        backgroundColor: palette.lightGrey,
        borderWidth: 0,
        height: fontScale(60),
        marginBottom: 20
    },
    multilineInputField: {
        backgroundColor: palette.lightGrey,
        borderWidth: 0,
        paddingTop: 10,
        height: fontScale(80),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
        borderRadius: 10,
    },
    removeIcon: {
        marginTop: -fontScale(95),
        marginLeft: -8,
        padding: 5
    },
});

export default SR;