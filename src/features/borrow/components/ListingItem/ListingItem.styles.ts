import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SLI = StyleSheet.create({
    listingContainer: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        resizeMode: 'stretch',
        marginRight: 10
    },
    icon: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        padding: 5,
    },
    title: {
        display: 'flex',
    },
    caption: {
        flex: 1,
        justifyContent: 'center'
    },
    details: {
    },
    duration: {
        fontWeight: '400',
        color: palette.black
    },
    type: {
        fontWeight: '500',
        color: '#757575',
    },
    size: {
        fontWeight: '500',
    },
});

export default SLI