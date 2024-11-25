import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

export const SBA = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        marginVertical: 6,
        marginHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: palette.darkBlue
    },
    button: { width: 80, height: 40 },
    text: {
        flex: 1,
        fontSize: 16,
        color: palette.black,
        fontWeight: '500'
    },
    detailText: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18
    }
})