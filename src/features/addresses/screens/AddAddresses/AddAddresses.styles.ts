import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SAA = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: '20%'
    },
    header: {
        paddingHorizontal: 10,
    },
    message: {
        marginTop: 10,
        color: palette.black,
    },
    button: {
        position: 'absolute',
        height: 40, width: '90%',
        bottom: 20,
        alignSelf: 'center'
    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        marginHorizontal: 10,
    },
    icon: {
        marginRight: 10,
        alignSelf: 'center'
    },
    editIcon: {
        marginLeft: 20
    },
    nearbyText: {
        marginBottom: 10
    },
    addressText: {
        marginTop: 10,
        marginBottom: 10
    },
    enableButton: {
        width: '20%',
        padding: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.lightGrey,
    },
    enableText: {
        color: palette.black,
        fontSize: 14,
    },
    locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 20,
    },
    flexRow: {
        flexDirection: 'row'
    },
    textContainer: {
        flex: .7,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
    },
});

export default SAA;