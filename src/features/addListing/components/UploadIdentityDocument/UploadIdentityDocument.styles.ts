import { palette } from "@/components/styles/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

export const SUID = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    title: { marginLeft: 20 },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.9,
        height: width * 0.4,
        borderRadius: 10,
        borderWidth: 1,
        alignSelf: 'center',
        marginVertical: 20,
    },
    mediaContainer: {
        height: height * 0.13,
        backgroundColor: palette.lightGrey,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginLeft: 10,
        marginVertical: 10,
        width: '70%',
        alignSelf: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        alignSelf: 'center',
        borderColor: 'black',
        // aspectRatio: '16/9'
    },
    buttonSubContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginTop: 5,
        color: palette.black,
        marginHorizontal: 10,
        lineHeight: 22
    },
    bottomButton: {
        position: 'absolute',
        bottom: 5,
        width: width,
        height: 40,
        marginVertical: 5,
        alignItems: 'center'
    },
})