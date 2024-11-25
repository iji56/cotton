import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

export const SCPM = StyleSheet.create({
    input: {
        marginVertical: 10,
        backgroundColor: palette.lightGrey,
        borderWidth: 0,
        height: 50,
        borderRadius: 5,
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
    errorText: {
        color: palette.red,
        marginBottom: 5,
        fontSize: 12,
        marginLeft: 2
    },
    button: { height: 40, marginTop: 2, marginBottom: 20, alignItems: 'center' },
})