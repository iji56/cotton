import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SRS = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    checkIcon: {
        marginTop: 20,
        width: 50,
        height: 50,
        alignSelf: 'center'
    },
    requestSentMessage: {
        color: palette.black,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    },
    requestSent: {
        alignItems: 'center',
        marginTop: 20
    },
    orderDetail:{
        marginVertical: 20,
    },
    listingContainer: {
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderColor: palette.lightGrey,
        paddingBottom: 20
    },
    calculationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        paddingVertical: 20,
    },
    value: {
        color: palette.black,
        marginTop: 10,
    },
    userContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        borderBottomWidth: 2,
        paddingBottom: 10,
        borderColor: palette.lightGrey,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10
    },
    buttonContainer: {
        marginVertical: 20,
        height: 120,
    },
    button: {
        height: 35,
        justifyContent: 'center',
    },
});

export default SRS;