import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

export const SCBA = StyleSheet.create({
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
    input: {
        marginVertical: 10,
        backgroundColor: palette.lightGrey,
        borderWidth: 0,
        height: 50,
        borderRadius: 5,
    },
    button: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: 40,
        marginVertical: 5,
        alignItems: 'center'
    },
    errorText: {
        color: palette.red,
        marginBottom: 5,
        fontSize: 12,
        marginLeft: 2
    },
    text: {
        color: palette.darkGrey,
        marginLeft: 10
    },
    stateInput: {
        marginVertical: 10,
        backgroundColor: palette.lightGrey,
        borderWidth: 0,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    itemContainer: {
        borderColor: palette.darkGrey,
        width: width * 0.9,
        paddingLeft: 20,
    },
    item: {
        marginVertical: 5,
        paddingVertical: 10,
    },
});