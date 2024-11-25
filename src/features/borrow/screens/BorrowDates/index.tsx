import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SBD } from './BorrowDates.styles';
import { fillDates } from '../../utils/fillDates';
import { formatDateSB } from '@/utils/formatDateSB';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { checkDateCollisions } from '../../utils/checkDateCollisions';
import { convertDateStringToNumber } from '../../utils/convertDateStringToNumber';
import {
  ParamListBase,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { reduxSelect } from '@/types/reduxHooks';
import Toast from 'react-native-toast-message';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import Wrapper from '@/components/Wrapper';
import H2 from '@/components/elements/H2';
import BorrowHeader from '../../components/BorrowHeader';
import H1 from '@/components/elements/H1';
import { borrowPeriods, keywords } from '../../utils/staticTexts';
import RadioButtonGroup from '@/components/elements/Forms/RadioButton';
import { getNextFourDates } from '../../utils/nextFourDays';
import DropDownPicker from '@/components/elements/Forms/DropDownPicker';
import Button from '@/components/elements/Button/Button';
import { checkLocationPermission, directToSetting } from '@/utils/permissions';
import { LatLng } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import { getDistanceBetweenTwoPoints } from '@/features/addresses/api/getDistance';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Geocoder from 'react-native-geocoding';
import moment from 'moment';
import BottomSheets from '@/components/elements/BottomSheet';
import ListingAddress from '@/features/addListing/components/ListingAddress';
import Loader from '@/components/elements/Loader';
import { getDatesBetween } from '../../utils/formatDate';
import { checkListingBorrowDates } from '../../api/getBorrowDates';

const BorrowDates = ({ route }: any) => {
  const { itemData, selectedPeriod } = route.params;
  const [disabledDates, setDisabledDates] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [error, setError] = useState('');
  const [showLocationPermission, setShowLocationPermission] = useState<
    boolean | null
  >(true);
  const [pickup, setPickup] = useState(
    reduxSelect(state => state.settings.pref_pickup) ?? false,
  );
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [distance, setDistance] = useState('0');
  const [address, setAddress] = useState<any>('');
  const [borrowMethod, setBorrowMethod] = useState(keywords.localPickup);
  const [selectedDays, setSelectedDays] = useState(
    selectedPeriod ? selectedPeriod : borrowPeriods[0].days,
  );
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const intervalIdRef = useRef<any>(null);
  const [dropDownSnapPoint, setDropDownSnapPoint] = useState(1);
  const [snapPoint, setSnapPoint] = useState<string | number>(1);
  const bottomSheetRef = useRef<any>();
  const ref = useRef<any>(null);

  let today = new Date();

  today.setDate(today.getDate());
  let minDateAvailable = today.toISOString().split('T')[0];
  const referenceDate = parseInt(
    today.toISOString().split('T')[0].replace(/-/g, ''),
    10,
  );

  useEffect(() => {
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      keyboardHide.remove();
      keyboardShow.remove();
    };
  }, []);

  useEffect(() => {
    getDisabledDates();
    checkLocationStatus();
  }, [isFocused, selectedDays]);

  useEffect(() => {
    if (error) showToast();
  }, [error]);

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
    if (intervalIdRef?.current) clearInterval(intervalIdRef.current);
  };

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        setUserLocation(location);
        setShowLocationPermission(false);
        stopInterval();
        const parseLocation = await Geocoder.from(
          itemData?.address?.split('#')[0],
        );
        let listingLocation = parseLocation?.results[0]?.geometry?.location;

        getDistanceBetweenTwoPoints(location, {
          latitude: listingLocation?.lat || 0,
          longitude: listingLocation?.lng || 0,
        })
          .then(distance => {
            setLoading(false);
            setDistance(distance || '0');
          })
          .catch(error => {
            setLoading(false);
            console.log('Error : ', error);
          });
      })
      .catch(async error => {
        setLoading(false);
        if (error.message === 'Authorization denied') {
          // await directToSetting()
        }
      });
  };

  const checkLocationStatus = () => {
    return checkLocationPermission().then(async response => {
      if (!response) {
        setShowLocationPermission(true);
      } else if (response) {
        if (Platform.OS === 'android') {
          const hasLocationEnabled = await isLocationEnabled();
          setShowLocationPermission(!hasLocationEnabled);
        } else {
          // setShowLocationPermission(false)
        }
      }
      return true;
    });
  };

  const getDisabledDates = async () => {
    try {
      setSelectedDates({});
      let disableDates = {};
      let listingborrowedDates: string[] = [];
      const borrowDates = await checkListingBorrowDates(itemData.id);
      if (borrowDates.length > 0) {
        borrowDates.map(date => {
          let dates = getDatesBetween(
            date.borrow_start,
            moment(date.borrow_end)
              .add(date.cp_id === 1 ? 7 : 2, 'days')
              .toString(),
          );
          listingborrowedDates.push(...dates);
        });
      }

      let userAccountPausedDates = getDatesBetween(
        itemData?.pausedStartDate,
        itemData?.pausedEndDate,
      );
      if (
        itemData?.unavailableDates ||
        userAccountPausedDates ||
        listingborrowedDates
      ) {
        [
          ...itemData?.unavailableDates,
          ...userAccountPausedDates,
          ...listingborrowedDates,
        ]?.forEach((item: string) => {
          const borrowStart = formatDateSB(new Date(item).toISOString());
          const borrowEnd = formatDateSB(moment(new Date(item)).toISOString());

          // Compare with today's date to decide if they should be added
          if (borrowStart >= referenceDate || borrowEnd >= referenceDate) {
            // Fill dates and directly add to disableDates object
            const currentDisabledDates = fillDates(
              [borrowStart, borrowEnd],
              pickup,
              true,
              referenceDate,
            );
            disableDates = { ...disableDates, ...currentDisabledDates };
          }
        });
      }
      setDisabledDates(disableDates);
      setMarkedDates({ ...disableDates });
    } catch (error) {
      // console.log(error)
      return error;
    }
  };

  const selectDate = (date: string) => {
    const days = selectedDays.split(' ')[0];
    const dayOrMonth = selectedDays.split(' ')[1];
    let nextFourDayDate = getNextFourDates(
      date,
      parseInt(dayOrMonth === 'Days' ? days : days * 30),
    );
    const startDate = convertDateStringToNumber(date);
    const endDate = convertDateStringToNumber(
      nextFourDayDate[nextFourDayDate.length - 1],
    );
    let collisions = checkDateCollisions(startDate, endDate, disabledDates);
    if (!collisions) {
      let range = fillDates([startDate, endDate], pickup, false, referenceDate);
      setSelectedDates(range);
      setMarkedDates({
        ...disabledDates,
        ...range,
      });
    } else {
      return;
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'error',
      text2: error,
      topOffset: 100,
      visibilityTime: 3000,
    });
    setError('');
  };

  const handleNext = () => {
    if (borrowMethod === '') {
      setError(keywords.borrowMethodError);
    } else if (!address) {
      errorToast(keywords.selectAnAddress);
    } else if (Object.keys(selectedDates).length > 1) {
      navigation.navigate('ReviewAndPay', {
        itemData,
        selectedDates,
        borrowMethod,
        type: keywords.borrow,
        address: address,
      });
    } else {
      setError(keywords.selectDateError);
    }
  };
  console.log('address', address);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white,
      }}>
      <BorrowHeader itemData={itemData} headerTitle={keywords.selectDate} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <ScrollView
            style={SBD.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            nestedScrollEnabled={true}>
            <View style={SBD.distanceMessageContainer}>
              {showLocationPermission ? (
                <View style={SBD.permissionContainer}>
                  <Text style={SBD.permissionText}>
                    {keywords.allowLocationMessage}
                  </Text>

                  <TouchableOpacity
                    style={SBD.filterButton}
                    onPress={() =>
                      directToSetting().then(() => {
                        checkLocationStatus().then(() => {
                          getUserLocation();
                        });
                      })
                    }>
                    <Text style={{ color: palette.black, fontWeight: 'bold' }}>
                      {keywords.allow}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <H1
                    text={`${keywords.youAre}${distance || 0}${
                      keywords.kmsAway
                    }`}
                  />
                  <Text style={SBD.distanceMessage}>
                    {`${keywords.distanceMessage1}`}
                    <Text style={{ fontWeight: 'bold' }}>
                      {parseInt(distance.split(' ')[0].split(',').join('')) > 50
                        ? `${keywords.shipping.toLowerCase()}`
                        : keywords.localPickup.toLowerCase()}
                    </Text>
                    {`${keywords.distanceMessage2}`}
                    {selectedDays.split(' ')[0] === '4' &&
                      `${keywords.distanceMessage3}`}
                  </Text>
                </>
              )}
            </View>

            <TouchableOpacity
              style={SBD.categoryContainer}
              onPress={() => {
                ref.current?.snapToIndex(1);
                setSnapPoint('60%');
              }}>
              <Text style={[SBD.text, { width: '90%' }]} numberOfLines={1}>
                {address?.address?.split('#')[0] || keywords.shippingAddress}
              </Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            <View style={{ marginTop: 10, zIndex: -1 }}>
              <H2 text={keywords.borrowMethod} />
              <RadioButtonGroup
                onChange={option => setBorrowMethod(option as string)}
                options={[keywords.localPickup, keywords.shipping]}
                selectedValue={borrowMethod}
                disable={[
                  {
                    value: showLocationPermission ? keywords.localPickup : '',
                    message: keywords.locationMessage,
                  },
                  {
                    value:
                      selectedDays.split(' ')[0] === '4'
                        ? keywords.shipping
                        : '',
                    message: keywords.borrowMessage,
                  },
                ]}
              />
            </View>

            <View style={SBD.pickerContainer}>
              <H2 text={keywords.borrowPeriod} />
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => setDropDownSnapPoint(borrowPeriods.length * 39)}>
                <Text style={SBD.days}>
                  {selectedDays ? selectedDays : keywords.selectDate}{' '}
                </Text>
                <FontAwesomeIcon icon={faCaretDown} />
              </TouchableOpacity>
            </View>
            <Text style={SBD.note}>
              {keywords.note}:{' '}
              <Text style={SBD.noteMessage}>
                {borrowMethod === keywords.shipping
                  ? keywords.yourItemWillShipOut
                  : keywords.youWillMeetUp}
                {keywords.onDay1OfBorrowPeriod}
              </Text>
            </Text>
            <Calendar
              minDate={minDateAvailable}
              onDayPress={(day: any) => {
                let selectedDay = Object?.values(day)[
                  Object?.values(day).length - 1
                ] as string;
                if (
                  moment(selectedDay).isBetween(
                    itemData?.pausedStartDate,
                    itemData?.pausedEndDate,
                    'd',
                    '[]',
                  )
                ) {
                  errorToast(keywords.accountIsBlockedError);
                } else if (Object?.keys(disabledDates)?.includes(selectedDay)) {
                  errorToast(keywords.unavailableDateError);
                } else {
                  selectDate(day.dateString);
                }
              }}
              markedDates={markedDates}
              markingType="period"
            />
          </ScrollView>

          <Wrapper>
            <View style={SBD.buttonMainContainer}>
              {!keyboardVisible && (
                <View style={SBD.buttonContainer}>
                  <Button
                    text="Back"
                    onPress={() => navigation.goBack()}
                    variant="secondary"
                    style={SBD.button}
                  />
                  <View style={{ width: 10 }} />
                  <Button
                    text={keywords.Next}
                    onPress={handleNext}
                    variant="main"
                    style={SBD.button}
                  />
                </View>
              )}
            </View>
          </Wrapper>
        </>
      )}
      <DropDownPicker
        snapPoint={dropDownSnapPoint}
        setSnapPoint={setDropDownSnapPoint}
        bottomSheetRef={bottomSheetRef}
        options={itemData.lendPeriods.map(day => {
          const text =
            parseInt(day) > 30 ? `${parseInt(day) / 30} Months` : `${day} Days`;
          return text;
        })}
        // options={borrowPeriods.map(item => item.days)}
        selectedOption={selectedDays}
        onChange={option => {
          setMarkedDates({});
          setDropDownSnapPoint(1);
          if (
            option.split(' ')[0] === '4' &&
            borrowMethod === keywords.shipping
          ) {
            // unselect borrow method if selected, when user selects 4 days
            setBorrowMethod('');
          }
          setSelectedDates({});
          setSelectedDays(option);
        }}
      />

      <BottomSheets
        bottomSheetRef={ref}
        snapPoint={snapPoint}
        setSnapPoint={setSnapPoint}
        handleSheetChanges={() => {}}>
        <ListingAddress address={address} setAddress={setAddress} />
      </BottomSheets>

      <Toast config={toastConfig} />
    </View>
  );
};

export default BorrowDates;
