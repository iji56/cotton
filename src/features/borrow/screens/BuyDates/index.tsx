import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SBD } from "./BuyDates.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "@/components/styles/theme";
import { ParamListBase, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { reduxSelect } from "@/types/reduxHooks";
import Toast from 'react-native-toast-message';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import Wrapper from "@/components/Wrapper";
import H2 from "@/components/elements/H2";
import BorrowHeader from "../../components/BorrowHeader";
import H1 from "@/components/elements/H1";
import { borrowPeriods, keywords } from "../../utils/staticTexts";
import RadioButtonGroup from "@/components/elements/Forms/RadioButton";
import Button from "@/components/elements/Button/Button";
import { checkLocationPermission, directToSetting } from "@/utils/permissions";
import { LatLng } from "react-native-maps";
import GetLocation from "react-native-get-location";
import { getDistanceBetweenTwoPoints } from "@/features/addresses/api/getDistance";
import { isLocationEnabled } from "react-native-android-location-enabler";
import Geocoder from "react-native-geocoding";
import moment from "moment";
import { checkListingBorrowStatus } from "../../api/checkListingBorrowStatus";
import Loader from "@/components/elements/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BottomSheets from "@/components/elements/BottomSheet";
import ListingAddress from "@/features/addListing/components/ListingAddress";

const BuyDates = ({ route }: any) => {

  const { itemData, selectedPeriod } = route.params;
  const { id } = reduxSelect(state => state.usermeta);
  const [error, setError] = useState('');
  const [showLocationPermission, setShowLocationPermission] = useState<boolean | null>(true);
  const [userLocation, setUserLocation] = useState<LatLng>()
  const [distance, setDistance] = useState('0')
  const [address, setAddress] = useState<any>('');
  const [borrowMethod, setBorrowMethod] = useState(keywords.shipping)
  const [isItemAvailable, setIsItemAvailable] = useState(true)
  const [borrowedDate, setBorrowedDate] = useState(new Date().toISOString());
  const [borrowedWithShipping, setBorrowedWithShipping] = useState<boolean | null>(null)
  const [extendedBorrowedDate, setExtendedBorrowedDate] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(selectedPeriod ? selectedPeriod : borrowPeriods[0].days)
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused()
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [snapPoint, setSnapPoint] = useState<number | string>(1)
  const intervalIdRef = useRef<any>(null);
  const ref = useRef<any>(null);


  useEffect(() => {
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardHide.remove();
      keyboardShow.remove()
    }
  }, []);


  useEffect(() => {
    const fetchListingStatus = async () => {

      const isItemAvailable = await checkListingBorrowStatus(itemData.id);
      console.log("isItemAvailable : ", isItemAvailable)
      if (isItemAvailable.length > 0) {
        isItemAvailable[0]?.enum && setIsItemAvailable(isItemAvailable[0].enum === 0)
        isItemAvailable[0]?.borrow_end && setBorrowedDate(isItemAvailable[0].borrow_end)
        setBorrowedWithShipping(isItemAvailable[0]?.cp_id === 1)
      }
    }
    fetchListingStatus();
  }, [itemData.id])

  useEffect(() => {
    if (new Date(borrowedDate!) >= new Date()) {
      setExtendedBorrowedDate(moment(new Date(borrowedDate!)).add(isItemAvailable ? 0 : borrowedWithShipping ? 8 : 3, 'days').format("MMMM Do, YYYY"))
    } else {
      setExtendedBorrowedDate(moment().format("MMMM Do, YYYY"))
    }
  }, [borrowedDate, borrowedWithShipping]);

  useEffect(() => {

    checkLocationStatus()
  }, [isFocused]);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      getUserLocation();
    }, 1000); // Runs every second

    return () => {
      // Cleanup interval on unmount
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  const stopInterval = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        setUserLocation(location)
        setShowLocationPermission(false)
        stopInterval();
        const parseLocation = await Geocoder.from(itemData?.address?.split("#")[0]);
        console.log("parsed location : ", parseLocation)
        let listingLocation = parseLocation?.results[0]?.geometry?.location;
        getDistanceBetweenTwoPoints(location, { latitude: listingLocation?.lat || 0, longitude: listingLocation?.lng || 0 }).
          then(distance => {
            setLoading(false)
            setDistance(distance || '0')
          }).
          catch(error => {
            setLoading(false)
            // console.log("Error : ", error)
          })
      })
      .catch(async error => {
        setLoading(false)
        if (error.message === 'Authorization denied') {
          // await directToSetting()
        }
      })
  }

  const checkLocationStatus = () => {
    return checkLocationPermission().then(async response => {
      if (!response) {
        setShowLocationPermission(true);
      } else if (response) {
        if (Platform.OS === 'android') {
          const hasLocationEnabled = await isLocationEnabled();
          setShowLocationPermission(!hasLocationEnabled)
        } else {
          // setShowLocationPermission(false)
        }
      }
      return true
    })
  }

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'error',
      text2: error,
      topOffset: 100,
      visibilityTime: 3000,
    });
    setError("")
  }

  useEffect(() => {
    if (error) showToast();
  }, [error])

  const handleNext = () => {
    if (borrowMethod === '') {
      setError(keywords.borrowMethodError);
    } else if (!address) {
      errorToast(keywords.selectAnAddress)
    } else {
      let selectedDates = {
        // [moment(new Date(borrowedDate!)).format('YYYY-MM-DD')]: null,
        [moment(extendedBorrowedDate!, 'MMMM Do, YYYY').format('YYYY-MM-DD')]: null
      }

      navigation.navigate('ReviewAndPay', { itemData, selectedDates: selectedDates, borrowMethod, type: keywords.buy, address: address })
    }
  }

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: palette.white,
    }}>
      <BorrowHeader itemData={itemData} headerTitle={keywords.selectBuyMethod} />
      {loading ? <Loader /> :
        <>
          <ScrollView style={SBD.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={true}
            nestedScrollEnabled={true}>
            <View style={SBD.distanceMessageContainer}>

              {showLocationPermission ?
                <View style={SBD.permissionContainer}>
                  <Text style={SBD.permissionText}>{keywords.allowLocationMessage}</Text>
                  <TouchableOpacity style={SBD.filterButton} onPress={() => directToSetting().then(() => {
                    checkLocationStatus().then(() => {
                      getUserLocation()
                    })
                  })}>
                    <Text style={{ color: palette.black, fontWeight: 'bold' }}>{keywords.allow}</Text>
                  </TouchableOpacity>
                </View>
                :
                <>
                  <H1 text={`${keywords.youAre}${distance || 0}${keywords.kmsAway}`} />
                  <Text style={SBD.distanceMessage}>
                    {`${keywords.distanceMessage1}`}
                    <Text style={{ fontWeight: 'bold' }}>
                      {parseInt(distance.split(" ")[0].split(',').join("")) > 50 ? `${keywords.shipping.toLowerCase()}` : keywords.localPickup.toLowerCase()}
                    </Text>
                    {`${keywords.distanceMessage2}`}
                    {/* {selectedDays.split(" ")[0] === '4' && `${keywords.distanceMessage3}`} */}
                  </Text>
                </>
              }
            </View>

            <TouchableOpacity style={SBD.categoryContainer} onPress={() => {
              ref.current?.snapToIndex(1)
              setSnapPoint('60%');
            }}>
              <Text style={[SBD.text, { width: '90%' }]} numberOfLines={1}>{address?.address?.split("#")[0] || keywords.shippingAddress}</Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            <View style={{ marginTop: 10, zIndex: -1 }}>
              <H2 text={keywords.buyMethod} />
              <RadioButtonGroup
                onChange={(option) => setBorrowMethod(option as string)}
                options={[keywords.localPickup, keywords.shipping]}
                selectedValue={borrowMethod}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={SBD.bold}>{keywords.note}:
                <Text style={SBD.noteMessage}> {keywords.buyNoteMessage.replace('x', extendedBorrowedDate!)}</Text>
              </Text>
              <H2 text={borrowMethod === keywords.shipping ? keywords.shippingDate : keywords.pickupDate} />
              <Text style={[SBD.noteMessage, { marginVertical: 5 }]}>
                {extendedBorrowedDate!}
              </Text>
            </View>
          </ScrollView>


          <Wrapper>
            <View style={SBD.buttonMainContainer}>
              {!keyboardVisible &&
                <View style={SBD.buttonContainer}>
                  <Button text="Back" onPress={() => navigation.goBack()} variant='secondary' style={SBD.button} />
                  <View style={{ width: 10 }} />
                  <Button text={keywords.Next} onPress={handleNext} variant='main' style={SBD.button} />
                </View>
              }
            </View>
          </Wrapper>
        </>}

      <BottomSheets bottomSheetRef={ref} snapPoint={snapPoint} setSnapPoint={setSnapPoint} handleSheetChanges={() => { }}>
        <ListingAddress address={address} setAddress={setAddress} />
      </BottomSheets>

      <Toast config={toastConfig} />
    </View>
  )
}

export default BuyDates;