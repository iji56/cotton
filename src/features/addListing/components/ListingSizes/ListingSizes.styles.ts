import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SLS = StyleSheet.create({
    container: {
        margin: 10,
    },
    title: {
        marginBottom: 10
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
        width: '100%'
    },
    text: {
        fontSize: fontScale(14),
        color: palette.black,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 10
    },
});

export default SLS;