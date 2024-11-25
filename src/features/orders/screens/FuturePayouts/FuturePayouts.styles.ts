import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SFP = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginBottom: '30%',
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        borderTopWidth: 2,
        borderColor: palette.lightGrey,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    amount: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: palette.black,
        fontSize: fontScale(16),
    }
});

export default SFP;