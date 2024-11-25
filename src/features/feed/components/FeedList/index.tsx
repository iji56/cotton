import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FeedMainContext } from '../../context/FeedMainContext';
import FeedItem, { FeedItemProps } from '../FeedItem';
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import SFL from './FeedList.styles';
import Wrapper from '@/components/Wrapper';
import FeedChip from '../FeedChip';
import { occasionFilters } from '../../utils/filters';
import FLV from '../FeedLlistView/FeedListView.styles';
import { palette } from '@/components/styles/theme';
import { ListViewPropType } from '../../types/feedNav';
import Loader from '../Loader';
import {
  checkLocationPermission,
  directToSetting,
  requestPermission,
} from '@/utils/permissions';
import { useIsFocused } from '@react-navigation/native';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import BottomSheets from '@/components/elements/BottomSheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { keywords } from '../../utils/keywords';
import { reportLists } from '@/features/profile/utils/keywords';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import TextField from '@/components/elements/Forms/TextField';
import Button from '@/components/elements/Button/Button';
import { errorToast, successToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { reportListing } from '../../api/reportListing';
import { reduxSelect } from '@/types/reduxHooks';

const FeedList = ({ handleFilter }: ListViewPropType) => {
  const { id } = reduxSelect(state => state.usermeta)
  const flatListRef = useRef<FlatList | null>(null);
  const {
    listingData,
    setPage,
    refreshing,
    selectedFilters,
    setListingData,
    setSelectedFilters,
  } = useContext(FeedMainContext);
  const [showLocationPermission, setShowLocationPermission] = useState<
    boolean | null
  >(null);
  const [userLocation, setUserLocation] = useState('');
  const [selectedItem, setSelectedItem] = useState({})
  const filterSelectedCount = useMemo(() => {
    const filteredCount = selectedFilters
      .flat()
      .filter(filter => filter && !occasionFilters.includes(filter)).length;
    return filteredCount;
  }, [selectedFilters, occasionFilters]);
  const [snapPoint, setSnapPoint] = useState<number | string>(1);
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedReportText, setSelectedReportText] = useState('');
  const ref = useRef<any>();
  const isFocused = useIsFocused();
  const intervalIdRef = useRef<any>(null);

  useEffect(() => {
    checkLocationPermission().then(async response => {
      if (!response) {
        setShowLocationPermission(true);
      } else if (response) {
        if (Platform.OS === 'android') {
          const hasLocationEnabled = await isLocationEnabled();
          setShowLocationPermission(!hasLocationEnabled);
        }
      }
    });
  }, [isFocused]);

  useCallback(() => {
    requestPermission()
      .then(() => getUserLocation())
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      getUserLocation();
    }, 1000); // Runs every second

    return () => {
      // Cleanup interval on unmount
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [isFocused]);

  const stopInterval = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            setShowLocationPermission(false);
            stopInterval();
            const addressComponent = json.results[0].formatted_address;
            setUserLocation(addressComponent);
          })
          .catch(error => console.warn(error));
      })
      .catch(async error => {
        console.log(Platform.OS, error);
        if (error.message === 'Authorization denied') {
          // await directToSetting()
        }
      });
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [selectedFilters]);

  const onRefresh = () => {
    setPage(2); // This will trigger the useFocusEffect
  };

  // this will call when user change filter
  const toggleFilter = (filter: string) => {
    let newSelectedFilters: any = [...selectedFilters]; // maked copy of selected filters so that we can update it without changing orignal array
    if (filter === occasionFilters[0]) {
      // if user click people
      if (selectedFilters.includes(occasionFilters[0])) {
        // removing all other filters
        newSelectedFilters = [[], [], [], [], ''];
      } else {
        // removing all other filters and adding people filter
        newSelectedFilters = [[], [], [], [], '', filter];
      }
      setSelectedFilters(newSelectedFilters);
    } else if (occasionFilters.includes(filter)) {
      // if user click any occasion
      if (selectedFilters.length === 0) {
        // creating initial selected array if user first time selecting any filter
        newSelectedFilters = [[], [], [], [], ''];
      }
      // checking if user selected people filter?
      if (selectedFilters.includes(occasionFilters[0])) {
        // removing previous selected people filter and adding latest selected occassion filter
        let index = selectedFilters.indexOf(occasionFilters[0]);
        newSelectedFilters.splice(index, 1, filter);
      } else {
        // when user apply any filter from filer modal
        // checking if user has selected any occasion filter
        if (
          selectedFilters.some(selectedFilter =>
            occasionFilters.includes(selectedFilter),
          )
        ) {
          occasionFilters.map(occasion => {
            if (selectedFilters.includes(occasion)) {
              // get selected occassion filter index value,
              let index = selectedFilters.indexOf(occasion);
              if (occasion !== filter) {
                // remove previous selected occasion filter and add latest selected occassion filter
                newSelectedFilters.splice(index, 1, filter);
              } else {
                // if user click on select occasion filter then just remove it
                newSelectedFilters.splice(index, 1);
              }
            }
          });
        } else {
          // just push the new selected filter
          newSelectedFilters.push(filter);
        }
      }
      setSelectedFilters(newSelectedFilters);
    } else {
      for (let i = 0; i < 4; i++) {
        if (
          Array.isArray(newSelectedFilters[i]) &&
          newSelectedFilters[i].includes(filter)
        ) {
          // checking if color is selected or not, if selected remove it else add it
          let index = newSelectedFilters[i].indexOf(filter);
          newSelectedFilters[i].splice(index, 1);
          break;
        }
      }
      // for distance
      if (newSelectedFilters.includes(filter)) {
        let index = newSelectedFilters.indexOf(filter);
        // newSelectedFilters[index] = "";
        newSelectedFilters.splice(index, 1);
      }
      setSelectedFilters(newSelectedFilters);
    }
  };

  const handleResetFilter = () => {
    setPage(1);
    setSelectedFilters([]);
  };

  const handleEllipse = (item: any) => {
    console.log("Selected Item : ", item);
    setSelectedItem(item)
    setSnapPoint('85%')
    ref.current?.snapToIndex(1)
  }

  const handleReport = async () => {
    let resposnse = await reportListing(id!, selectedItem.id, selectedItem.user_id, selectedReport, selectedReportText)
    setSnapPoint(1)
    if (resposnse?.startsWith('Error')) {
      errorToast(resposnse)
    } else {
      setListingData(listings => listings.filter(item => item.id !== selectedItem.id))
      successToast(keywords.reportMessage)
    }
  }

  const handleSelectReport = (value: string) => {
    setSelectedReport(value)
  }

  const renderItem = ({ item, index, separators }: FeedItemProps) => {

    return <FeedItem item={{ ...item, handleEllipse: () => handleEllipse(item) }} index={index} separators={separators} />;
  };
  return (
    <Wrapper>
      {refreshing ? (
        <Loader />
      ) : (
        <>
          <View style={SFL.filterContainer}>
            <TouchableOpacity onPress={handleFilter} style={SFL.filterButton}>
              <Image
                source={require('../../../../components/assets/filter.png')}
                style={SFL.icon}
              />
              {filterSelectedCount > 0 ? (
                <Text style={SFL.selectedFilter}>{filterSelectedCount}</Text>
              ) : (
                <Text
                  style={[
                    SFL.selectedFilter,
                    { backgroundColor: palette.lightGrey },
                  ]}
                />
              )}
              <Text>Filter </Text>
            </TouchableOpacity>
            {[
              ...new Set(
                [
                  ...selectedFilters,
                  occasionFilters.filter(occasion => occasion !== 'people'),
                ].flat(),
              ),
            ].filter(filter => filter !== '')?.length > 0 && (
                <View style={SFL.divider} />
              )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* [...new Set([...selectedFilters, occasionFilters.filter(occasion => occasion !== 'people')].flat())] */}
              {[
                ...new Set(
                  [
                    ...selectedFilters,
                    occasionFilters.filter(occasion => occasion !== 'people'),
                  ].flat(),
                ),
              ]
                .filter(filter => filter !== '')
                .map((item, index) => (
                  <FeedChip
                    key={index}
                    label={item}
                    selected={selectedFilters.flat().includes(item)}
                    onPress={() => toggleFilter(item)}
                    showCrossIcon={!occasionFilters.includes(item)}
                  />
                ))}
            </ScrollView>
          </View>
          {showLocationPermission ? (
            <View style={SFL.permissionContainer}>
              <Text style={SFL.permissionText}>{keywords.allowLocation}</Text>
              <TouchableOpacity
                style={[SFL.filterButton, { height: 30 }]}
                onPress={async () => {
                  if (Platform.OS === 'android') {
                    const hasLocationEnabled = await isLocationEnabled();
                    if (!hasLocationEnabled) {
                      await promptForEnableLocationIfNeeded();
                      return;
                    } else {
                      directToSetting().then(res => {
                        getUserLocation();
                      });
                    }
                  } else {
                    directToSetting().then(res => {
                      getUserLocation();
                    });
                  }
                }}>
                <Text>Allow</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={SFL.locationContainer}>
              <FontAwesomeIcon icon={faLocationDot} color={palette.darkBlue} />
              <Text style={SFL.locationText} numberOfLines={1}>
                {userLocation}
              </Text>
            </View>
          )}
          {listingData.length === 0 ? (
            <Text style={SFL.warningText}>no listings</Text>
          ) : (
            <>
              {[...new Set([...selectedFilters].flat())].filter(
                filter => filter !== '',
              ).length > 0 && (
                  <View style={FLV.resultHeader}>
                    <Text>Showing {listingData.length} results</Text>
                    <TouchableOpacity
                      style={FLV.filterButton}
                      onPress={handleResetFilter}>
                      <Text>reset</Text>
                    </TouchableOpacity>
                  </View>
                )}
              <FlatList
                contentContainerStyle={SFL.container}
                keyboardDismissMode="on-drag"
                ref={flatListRef}
                data={listingData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.75}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                numColumns={2}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </>
      )}
      <BottomSheets snapPoint={snapPoint} setSnapPoint={setSnapPoint} bottomSheetRef={ref} handleSheetChanges={(index: number) => { }}>
        <FlatList
          data={reportLists}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={<Text style={SFL.heading}>{keywords.reasonToReportAccount}</Text>}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} style={[SFL.item, { borderTopWidth: index === 0 ? .3 : 0 }]} onPress={() => handleSelectReport(item.value)}>
              <Checkbox label='' isChecked={selectedReport === item.value} onClick={() => handleSelectReport(item.value)} borderRadius={20} />
              <Text style={SFL.itemText}>{item?.label}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              {selectedReport === "Other" && (
                <TextField value={selectedReportText} onChangeText={setSelectedReportText} placeholder={keywords.reasonPlaceholder} multiline style={SFL.input} />
              )}
              <View style={SFL.bottomButton}>
                <Button text={keywords.submit} onPress={handleReport} variant='main' />
              </View>
            </>
          }
        />
      </BottomSheets>
      <Toast config={toastConfig} />
    </Wrapper>
  );
};

export default FeedList;
