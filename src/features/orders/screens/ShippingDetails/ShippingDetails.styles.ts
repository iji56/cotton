import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window')

const SSD = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    itemContainer: {
        marginVertical: 10,
        borderWidth: .2,
        borderRadius: 5,
        padding: 5
    },
    text: {
        color: palette.black,
        marginVertical: 5,
    },
    reason: {
        color: palette.black,
        borderRadius: 10,
        minHeight: 60,
        borderWidth: 2,
        borderColor: palette.lightGrey,
        padding: 5,
        marginVertical: 10,
    },
    row: { flexDirection: 'row', gap: 20, marginVertical: 8, },
    textFixedWidth: { minWidth: width * 0.45, maxWidth: width * 0.45 },
});

export default SSD;