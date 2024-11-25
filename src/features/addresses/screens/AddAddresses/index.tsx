import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from '@/components/elements/Button/Button';
import {
  GooglePlaceData,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import { AddressesMainContext } from '../../context/AddressesMainContext';
import H2 from '@/components/elements/H2';
import IconButton from '@/components/elements/Button/IconButton';
import {
  faLocationCrosshairs,
  faLocationDot,
  faPencil,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  ParamListBase,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import SAA from './AddAddresses.styles';
import AddressesHeader from '../../components/AddressesHeader';
import AddressesSearchBar from '../../components/AddressSearchBar';
import { keywords } from '../../utils/keywords';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import GetLocation, { Location } from 'react-native-get-location';
import { getNearByAddresses } from '../../api/getNearByAddresses';
import { getSavedAddresses } from '../../api/getSavedAddressed';
import { reduxSelect } from '@/types/reduxHooks';
import { getPostalCodeFromCoordinates } from '../../utils';
import Toast from 'react-native-toast-message';

const AddAddresses = () => {
  const uid = reduxSelect(state => state.auth.uid);
  const [addresses, setAddresses] = useState([]);
  const [nearbyAddresses, setNearbyAddresses] = useState([]);
  const [address, setAddress] = useState<GooglePlaceData>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const addressRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isEdit, setIsEdit] = useState<{ address: string } | string>({
    address: '',
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      keyboardShowListener?.remove();
      keyboardHideListener?.remove();
    };
  });

  useEffect(() => {
    GetLocation.getCurrentPosition;
    const fetchSavedAdresses = async () => {
      if (userLocation) {
        // await getDistanceBetweenTwoPoints(userLocation, { latitude: 40.659569, longitude: -73.933783 });
        const response = await getNearByAddresses(userLocation);
        if (response?.results) {
          setNearbyAddresses(response.results);
        }
      }
      let addresses = await getSavedAddresses(uid!);
      if (addresses) {
        setAddresses(addresses);
      }
    };
    fetchSavedAdresses();
  }, [isFocused, userLocation]);

  useEffect(() => {
    // reset selected address and isEdit value
    setIsEdit({ address: '' });
    addressRef.current?.setAddressText('');
    setAddress(undefined);
  }, [isFocused]);

  const navigateToMapScreen = () => {
    if (address) {
      navigation.navigate('AddressesMap', { address: address, isEdit });
    } else {
      errorToast('Select any address first');
    }
  };

  const onPress = async (data: GooglePlaceData, details: any = null) => {
    let postalCode = '';
    if (details) {
      // Extract address components
      const addressComponents = details?.address_components;

      // Find the postal code component
      postalCode = addressComponents.find((component: any) =>
        component.types.includes('postal_code'),
      )?.long_name;

      if (!postalCode) {
        postalCode = await getPostalCodeFromCoordinates(
          details.geometry.location.lat,
          details.geometry.location.lng,
        );
      }

      console.log('Postal Code: ', postalCode);
    } else {
      console.error('No details available');
    }
    setAddress({
      mainText: data.structured_formatting.main_text,
      secondaryText: data.structured_formatting.secondary_text,
      description: data.description,
      postalCode: postalCode,
    });
  };

  const handleEdit = (address: any, description: string, nearby?: boolean) => {
    if (!nearby) {
      setIsEdit({
        address: description,
        address_id: address.address_id,
        apartment_suite: address?.apartment_suite,
        delivery_hand_off_instructions: address?.delivery_hand_off_instructions,
      });
    } else {
      setIsEdit({ address: '' });
    }
    addressRef.current?.focus();
    addressRef.current?.setAddressText(description);
  };

  const renderItem = (
    address: { address: string },
    index: number,
    nearby?: boolean,
  ) => {
    // console.log("address : ", address)
    const mainText = address.address?.split(',')[0]; // split address to main text and secondary
    let indesx = address.address.lastIndexOf(mainText) + (mainText.length - 1); //  index main text to extract secondary text
    const secondaryText = address.address.substring(indesx + 2); //  extracting secondary text by removing ',' and space

    return (
      <View key={index} style={SAA.listItemContainer}>
        <FontAwesomeIcon
          icon={nearby ? faLocationCrosshairs : faLocationDot}
          size={20}
          style={SAA.icon}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'black' }}>{mainText}</Text>
          <Text style={{ color: 'black' }}>{secondaryText}</Text>
        </View>
        <IconButton
          onPress={() => handleEdit(address, secondaryText, nearby)}
          icon={faPencil}
          style={SAA.editIcon}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white,
      }}>
      <ScrollView
        style={SAA.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <AddressesHeader headerTitle={keywords.addAddress} headerType="main" />
        <AddressesSearchBar onPress={onPress} addressRef={addressRef} />
        <View style={SAA.listContainer}>
          {nearbyAddresses?.length > 0 && (
            <>
              <H2 text="Nearby" style={SAA.nearbyText} />
              <FlatList
                data={nearbyAddresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  renderItem({ address: item.vicinity }, index, true)
                }
              />
            </>
          )}
          {addresses?.length > 0 && (
            <>
              <H2 text="Saved Addresses" style={SAA.addressText} />
              <FlatList
                data={addresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)}
              />
            </>
          )}
        </View>
      </ScrollView>
      {!keyboardVisible && (
        <View style={SAA.button}>
          <Button
            text="Continue"
            onPress={navigateToMapScreen}
            variant="main"
          />
        </View>
      )}
      <Toast config={toastConfig} />
    </View>
  );
};

export default AddAddresses;
