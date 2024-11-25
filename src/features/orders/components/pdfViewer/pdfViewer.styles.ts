import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

const SPDFV = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: width,
        height: height,
    },
    modalBody: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        zIndex: 999,
    },
    closeIcon: {
        marginRight: 10,
        position: 'relative',
        right: 0,
        top: 50,
        zIndex: 1
    }
});

export default SPDFV