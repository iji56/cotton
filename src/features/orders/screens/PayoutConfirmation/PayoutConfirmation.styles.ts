import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SPC = StyleSheet.create({
    checkIcon: {
        marginTop: 20,
        width: 50,
        height: 50,
        alignSelf: 'center'
    },
    congratulations: {
        textAlign: 'center',
        marginVertical: 20
    },
    summaryContainer: {
        paddingVertical: 10,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey
    },
    summary: {
        marginBottom: 10
    },
    messageText: {
        textAlign: 'center',
        color: palette.black,
        lineHeight: 25,
        width: '80%',
        alignSelf: 'center',
        paddingBottom: 20,
    },
    text: {
        marginTop: 10,
        color: palette.black
    },
    buttonContainer: {
        marginTop: 20,
        height: '18%',
    },
    button: {
        marginVertical: 5
    }
});

export default SPC;