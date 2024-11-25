import { TextStyle, ViewStyle } from "react-native";
import { GooglePlaceData, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete"

export type AddressSeaarchBarProp = {
    onPress: (data: GooglePlaceData) => void,
    addressRef: React.Ref<GooglePlacesAutocompleteRef>;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    noIcon?: boolean;
    containerStyle?: ViewStyle;
}