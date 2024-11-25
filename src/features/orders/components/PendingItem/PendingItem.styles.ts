import { palette } from "@/components/styles/theme";
import { fontScale } from "@/utils/fontScale";
import { StyleSheet } from "react-native";

const SPI = StyleSheet.create({
    listingContainer: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
    image: {
        width: 60,
        height: 60,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listingInfo: {
        width: '56%',
    },
    details: {
    },
    duration: {
        color: palette.black,
        fontSize: fontScale(12)
    },
    type: {
        fontWeight: '400',
        color: '#757575',
        fontSize: fontScale(12)
    },
    size: {
        fontWeight: '500',
    },
    amount: {
        fontSize: fontScale(14),
        marginLeft: 10,
        width: 80,
    }
});

export default SPI