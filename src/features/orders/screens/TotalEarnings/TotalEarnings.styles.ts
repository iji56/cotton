import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const STE = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginBottom: '15%',
    },
    filterContainer: {
        // marginBottom: 10,
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 2,
        borderColor: palette.lightGrey,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    text: {
        color: palette.black,
        fontSize: fontScale(16)
    }
});

export default STE;