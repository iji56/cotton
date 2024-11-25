import { Dimensions, StyleSheet } from "react-native";
const { height } = Dimensions.get('window')
const FFM = StyleSheet.create({
    container: {
        // flex: 1,
        minHeight: height,
        maxHeight: height * 3,
        flexGrow: 1,
        backgroundColor: 'light',
        paddingBottom: '30%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
        marginVertical: '5%'
    },
    line: {
        borderWidth: 0.5
    },
    accordianHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginHorizontal: '2%',
        marginVertical: '3%',
        flexWrap: 'wrap',
    },
    button: {
        position: 'absolute',
        bottom: '5%',
        width: '90%',
        height: 38,
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 15
    }
});

export default FFM;