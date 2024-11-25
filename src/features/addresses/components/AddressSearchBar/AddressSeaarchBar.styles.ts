import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get('window');

export const ASBS = StyleSheet.create({
    mainContainer: {
        minHeight: 50,
        maxHeight: 500,
        marginHorizontal: 20,
        marginTop: 20
    },
    inputWrapper: {
        paddingRight: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.lightGrey,
        zIndex: 99,
    },
    input: {
        flex: 1,
        height: height * 0.05,
        margin: 6,
        color: palette.black,
        backgroundColor: palette.lightGrey,
        zIndex: 99
    },
})