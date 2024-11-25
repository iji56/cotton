import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window')

const SPA = StyleSheet.create({
    container: {
        paddingBottom: 50,
        paddingHorizontal: 10
    },
    text: {
        color: palette.black,
        lineHeight: 22,
        fontSize: 16,
        marginBottom: 20,
        width: '98%'
    },
    boldText: {
        fontWeight: 'bold',
        color: palette.black,
        lineHeight: 25,
        fontSize: 16,
        marginBottom: 20,
        width: '98%'
    },
    title: {
        fontSize: fontScale(18),
    },
    button: {
        position: 'absolute',
        bottom: 10,
        height: 40,
        width: width * 0.9,
        alignSelf: 'center'
    },
    header: {
        width: width * 0.9,
        borderBottomWidth: .5,
        paddingBottom: 15,
        // paddingHorizontal: 5,
    },
    bottomButtonContainer: {
        flex: 1,
        width: width * 0.9,
        marginTop: 10,

    },
    messageText: {
        marginVertical: 10,
        color: palette.black,
    },
});

export default SPA;