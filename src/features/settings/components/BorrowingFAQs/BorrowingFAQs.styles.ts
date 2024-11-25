import { palette } from "@/components/styles/theme";
import { StyleSheet } from "react-native";

const SBF = StyleSheet.create({
    heading: {
        marginLeft: 10,
        marginBottom: 20
    },
    container: {
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'space-between',
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: palette.lightGrey
      },
      text: {
        fontSize: 16,
        color: palette.black,
        width: '90%'
      },
});

export default SBF;