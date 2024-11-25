import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SPA = StyleSheet.create({
    mainContainer: {
        backgroundColor: palette.white,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    emptyViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.white
    },
    image: {
        marginVertical: 20,
        height: '35%',
        resizeMode: 'contain'
    },
    addlistingMessage: {
        fontSize: 16,
        color: palette.black,
        lineHeight: 25,
        width: '70%',
        textAlign: 'center'
    },
    addListingButton: {
        width: '90%',
        height: 45,
        marginVertical: 20
    },
    headerContainer: {
        backgroundColor: 'rgba(255, 243, 176, 1)',
        padding: 20,
        paddingTop: 10,
        borderRadius: 10,
    },
    noBankAccountText: {
        color: palette.black,
        lineHeight: 25,
        fontSize: 14
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
    },
    availablePayoutContainer: {
        borderWidth: 2,
        borderColor: palette.lightGrey,
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    bankAccountContainer: {
        backgroundColor: palette.lightGrey,
        borderRadius: 5,
        padding: 10,
        paddingVertical: 20,
        marginVertical: 4
    },
    totalEarningContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: palette.lightGrey,
        borderRadius: 5,
        padding: 10,
        paddingVertical: 20,
        marginVertical: 4
    },
    amountText: {
        fontSize: 16,
        color: palette.black
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100,
    },
    getPaidButton: {
        height: 45,
        marginVertical: 20,
    },
    availablePayoutText: { fontWeight: '400', marginBottom: 10 },
    pendingPayoutContainer: {
        marginVertical: 10,
    },
    pendingMessage: {
        color: palette.black,
        marginVertical: 15,
        lineHeight: 20
    },
    infoIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        paddingHorizontal: 10
    },
    gotItButton: {
        height: 45
    },
    bottomContainer: {
        width: '96%'
    },
    futurePayout: {
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
        paddingHorizontal: 10,
    },
    futurePayoutText: {
        fontSize: 16,
        color: palette.black,
        lineHeight: 25,
        marginTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 10
    },
});

export default SPA;