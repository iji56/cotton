import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window')

const SRAP = StyleSheet.create({
    container: {
        flex: 1,
    },
    addressMainContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: palette.white
    },
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: palette.lightGrey,
        paddingVertical: 20,
        paddingHorizontal: 20, marginVertical: 10,
        borderRadius: 5
    },
    address: {
        fontSize: 16,
        color: palette.black
    },
    infoContainer: {
        backgroundColor: '#3FA055',
        marginVertical: 10,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.33,
        overflow: 'scroll'
    },
    itemImage: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    itemText: {
        color: palette.white,
        width: '80%',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 4,
    },
    orderContainer: {
        backgroundColor: palette.white,
        padding: 10
    },
    promoCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 20,
        backgroundColor: palette.lightGrey,
        marginVertical: 20,
        borderRadius: 10
    },
    promoCode: {
        flex: 1,
        borderWidth: 0,
        height: 45
    },
    checkboxContainer: {
        backgroundColor: palette.lightGrey,
        padding: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    checkBoxText: {
        fontWeight: '400',
        marginRight: 20,
        marginLeft: 20,
        marginTop: -5
    },
    apply: {
        paddingHorizontal: 25,
    },
    icon: {
        marginLeft: 10,
        alignSelf: 'center'
    },
    savingMessage: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFF3B0',
        borderRadius: 5,
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 16,
        color: palette.black
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    text: {
        color: palette.black,
        fontSize: 16
    },
    lenderContainer: {
        backgroundColor: palette.white,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingTop: 5
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10
    },
    userContainer: {
        flexDirection: 'row',
        marginTop: 15
    },
    note: {
        fontWeight: 'bold',
        color: palette.black,
        marginVertical: 15,
    },
    noteText: {
        fontWeight: '400'
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: palette.lightGrey,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5
    },
    buttonMainContainer: {
        backgroundColor: palette.white,
        borderTopWidth: 2,
        borderColor: palette.lightGrey
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    button: {
        height: 35,
        justifyContent: 'center'
    },
    modalContainer: {
        width: '95%',
        height: '58%',
        backgroundColor: palette.white,
        borderRadius: 20
    },
    insurance: {
        padding: 15,
        paddingTop: 25,
        borderBottomWidth: .3
    },
    insuranceMessage: {
        padding: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: palette.black,
        lineHeight: 25
    },
    insuranceButton: {
        height: 50,
        margin: 20,
        marginBottom: 5
    },
    connnectButton: {
        alignSelf: 'center',
        height: 40,
        marginVertical: 10,
        width: '80%'
    },
});

export default SRAP;