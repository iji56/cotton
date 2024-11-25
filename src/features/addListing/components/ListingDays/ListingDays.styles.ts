import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SLD = StyleSheet.create({
    container: {
        margin: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
        alignItems: 'center',
        borderColor: palette.darkGrey,
        marginVertical: 2,
        paddingVertical: 1
    },
    textContainer: {
        paddingVertical: 10,
    },
    text: {
        fontSize: fontScale(14),
        color: palette.black,
        fontWeight: 'bold',
    },
    icon: {
        padding: 5,
    }
});

export default SLD;