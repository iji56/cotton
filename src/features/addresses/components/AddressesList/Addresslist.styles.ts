import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const ALS = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    listContainer: {
        marginTop: 20,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
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
        marginTop: 40,
        marginBottom: 10
    },
    bottomButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey,
    },
    buttonText: {
        color: palette.black,
        marginLeft: 15
    },
    mainText: { fontSize: 12, fontWeight: 'bold', color: palette.black, marginVertical: 2 },
    secondaryText: { fontSize: 12, color: palette.black, marginVertical: 2 },
    default: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        alignItems: 'center',
        backgroundColor: palette.lightGrey,
        width: 70,
        borderRadius: 5,
        margin: 5,
    },
    defaultText: {
        fontSize: 12
    }

});

export default ALS