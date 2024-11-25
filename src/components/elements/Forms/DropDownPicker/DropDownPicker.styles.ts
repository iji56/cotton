import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SDDP = StyleSheet.create({
    picker: {
        width: 150,
        zIndex: 999999,
        alignItems: 'flex-end'
    },
    item: {
        marginVertical: 10,
        paddingLeft: 10,
    },
    seperator: {
        width: '100%',
        borderWidth: 1,
        borderColor: palette.lightGrey
    },
    text: {
        fontSize: 14,
        color: palette.black
    }
});

export default SDDP;