import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const AMS = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 0.45,
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 20,
    },
    descriptionContainer: { flex: 1, marginHorizontal: 10, marginBottom: 20 },
    addressDetail: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, },
    addressText: { marginLeft: 10 },
    suitInput: { backgroundColor: palette.lightGrey, borderWidth: 0, marginVertical: 10, marginBottom: 20 },
    instructionInput: { backgroundColor: palette.lightGrey, borderWidth: 0, lineHeight: 18, height: 100, marginVertical: 10 },
    button: { position: 'absolute', height: 40, width: '90%', bottom: 20, alignSelf: 'center' },
    mainText: { fontSize: 12, fontWeight: 'bold', color: palette.black, marginVertical: 2 },
    secondaryText: { fontSize: 12, color: palette.black, marginVertical: 2 },
    errorText: {color: palette.red, marginTop: -15, marginBottom: 15},
});

export default AMS