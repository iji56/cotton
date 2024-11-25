import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SFD = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '98%'
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: palette.black,
        lineHeight: 25,
        width: '98%'
    },
    answer: {
        marginTop: 10,
        fontSize: 16,
        color: palette.black,
        lineHeight: 25,
        width: '98%'
    },
    dot: {
        fontSize: 20,
        color: palette.black,
        marginHorizontal: 10,
        marginRight: 20,
        marginTop: 10
    },
});

export default SFD;