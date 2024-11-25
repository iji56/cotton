import { GOOGLE_MAP_API_KEY } from '@env'
import { View } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { palette } from '@/components/styles/theme';
import { ASBS } from './AddressSeaarchBar.styles';
import { AddressSeaarchBarProp } from '../../types/Addresses';
import IconButton from '@/components/elements/Button/IconButton';

const AddressesSearchBar = ({ onPress, addressRef, style, inputStyle, noIcon, containerStyle }: AddressSeaarchBarProp) => {
    return (
        <View style={[ASBS.mainContainer, containerStyle,]}>
            <GooglePlacesAutocomplete
                ref={addressRef}
                placeholder={"Enter a new address"}
                disableScroll={false}
                isRowScrollable={false}
                textInputProps={{ placeholderTextColor: palette.darkGrey }}
                minLength={2}
                GooglePlacesDetailsQuery={{'type': '(regions)'}}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps='always'
                onPress={onPress}
                fetchDetails={true}
                debounce={300}
                nearbyPlacesAPI="GooglePlacesSearch"
                listViewDisplayed={false}
                renderLeftButton={() => (
                    noIcon ? <></> :
                        <IconButton
                            onPress={() => { }}
                            icon={'magnifying-glass'}
                            style={{ marginLeft: 20 }}
                        />
                )}
                styles={{
                    container: { flex: 0 },
                    textInputContainer: [ASBS.inputWrapper, style],
                    textInput: [ASBS.input, inputStyle],
                    description: { color: palette.black, zIndex: 99999 },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                }}
                query={{
                    key: GOOGLE_MAP_API_KEY,
                    language: 'en',
                }}
            />
        </View>
    )
}

export default AddressesSearchBar