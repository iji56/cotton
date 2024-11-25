import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SDA = StyleSheet.create({
    text: {
        color: palette.black,
        lineHeight: 25,
        marginLeft: 5,
    },
    warningText: {
        marginBottom: 15,
    },
    list: {
        flexDirection: 'row',
        marginLeft: 20
    },
    buttonContainer: {
        height: 42,
        marginVertical: 20
    },
    pauseAccount: {
        marginVertical: 20
    },
    dot: {
        fontSize: 18
    },
    link: {
        color: palette.darkBlue,
        textDecorationLine: 'underline'
    },
    areYouSure: {
        marginVertical: 10,
        width: '80%',
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingHorizontal: 20,
        marginTop: 20
    },
    space: { width: 20 }
});

export default SDA;