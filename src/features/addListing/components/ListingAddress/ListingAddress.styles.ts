import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window')

const SLA = StyleSheet.create({
    container: {
        width: '94%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.95,
        alignSelf: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: palette.darkGrey,
        marginVertical: 2,
    },
    textContainer: {
        paddingVertical: 5,
    },
    text: {
        fontSize: fontScale(14),
        color: palette.black,
        width: width * 0.7,
        lineHeight: 23,
    },
    icon:{
        padding: 5,
    }
});

export default SLA;