import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SOL = StyleSheet.create({
    searchBarContainer: {
        marginHorizontal: 10,
        marginBottom: 10
    },
    mainContainer: {
        backgroundColor: palette.lightGrey,
        paddingBottom: 120
    },
    requestContainer: {
        backgroundColor: palette.white
    },
    orderContainer: {
        backgroundColor: palette.white,
        marginTop: 10
    },
    listHeading: {
        paddingVertical: 10,
        paddingLeft: 10,
        paddingTop: 20
    },
    button: {
        height: 42,
        width: '50%',
        marginVertical: 20
    },
    boxImage: {
        marginBottom: 20,
        width: 100,
        height: 100,
    },
    text: {
        fontSize: fontScale(16),
        color: palette.black,
        lineHeight: 25,
        width: '80%',
        textAlign: 'center',
    },
});

export default SOL;