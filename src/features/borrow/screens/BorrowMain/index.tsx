import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Wrapper from '@/components/Wrapper';
import SBM from './BorrowMain.styles';
import BorrowHeader from '../../components/BorrowHeader';
import {
  ParamListBase,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import H2 from '@/components/elements/H2';
import { dollarConversion } from '@/utils/dollarConversion';
import { reduxSelect } from '@/types/reduxHooks';
import Carousel from 'react-native-reanimated-carousel';
import Button from '@/components/elements/Button/Button';
import { palette } from '@/components/styles/theme';
import { keywords, questions } from '../../utils/staticTexts';
import FAQsItem from '../../components/FAQs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightLong, faStar } from '@fortawesome/free-solid-svg-icons';
import { getListingDetail } from '../../api/getListingDetail';
import { calculateDiscount } from '../../utils/calculateDiscount';
import { getListingRating } from '../../api/getListingRating';
import Loader from '@/components/elements/Loader';
import moment from 'moment';
import {
  getListingAddress,
  getListingAddressByUserID,
} from '@/features/orders/api/getListingAddress';
import { imageBaseUrl } from '@/utils/createStorageURL';
import GetLocation from 'react-native-get-location';
import { getDistanceBetweenTwoPoints } from '@/features/addresses/api/getDistance';
import Geocoder from 'react-native-geocoding';
import { calculateTotalPrice } from '../../utils/calculateCost';
import { getImageSrc } from '@/utils/renderItemsForTesting';
import Video from 'react-native-video';

const BorrowMain = ({ route }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const currentUser = reduxSelect(state => state.usermeta.id);
  const itemPayload = route.params.listingData;
  const backNav = route.params.backNav;
  const backNavPayload = route.params.backNavPayload;

  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [listingData, setListingData] = useState<any>();
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [distance, setDistance] = useState('0');
  const isFocused = useIsFocused();

  let today = new Date();

  useEffect(() => {
    try {
      console.log('itemPayload.id', itemPayload.id);
      getData(itemPayload.id);
    } catch (error) {
      console.log(error);
    }
  }, [isFocused]);

  useEffect(() => {
    getUserLocation();
  }, [address]);

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        console.log('address', address);
        const parseLocation = await Geocoder.from(address.split('#')[0]);
        let listingLocation = parseLocation?.results[0]?.geometry?.location;
        getDistanceBetweenTwoPoints(location, {
          latitude: listingLocation?.lat || 0,
          longitude: listingLocation?.lng || 0,
        })
          .then(distance => {
            console.log('calculated distance : ', distance);
            setDistance(distance || '0');
          })
          .catch(error => {
            console.error('Error in getUserLocation: ', error);
          });
      })
      .catch(async error => {
        console.error('Error in getUserLocation ', error);
        if (error.message === 'Authorization denied') {
          // await directToSetting()
        }
      });
  };
  const isImage = (url: string) => {
    return (
      url.endsWith('.jpeg') || url.endsWith('.jpg') || url.endsWith('.png')
    ); // Add more extensions as needed
  };

  const getData = async (listingId: string) => {
    setIsloading(true);
    const response = await getListingDetail(currentUser!, listingId);

    response[0].listing_image_urls = response[0].listing_image_urls.sort(
      (a, b) => {
        if (isImage(a.url_path) && !isImage(b.url_path)) {
          return -1; // a comes before b
        } else if (!isImage(a.url_path) && isImage(b.url_path)) {
          return 1; // b comes before a
        }
        return 0; // no change in order
      },
    );
    console.log('response2', response);
    const listingRating = await getListingRating(listingId);
    const addressResponse = await getListingAddressByUserID(
      response[0]?.user_id,
    );
    setAddress(addressResponse[0]?.address);
    setPostalCode(addressResponse[0]?.postal_code);
    setListingData({ ...response[0], rating: listingRating }); // index 0 because we are getting only selected listing details
    setIsloading(false);
  };

  const originalPrice =
    listingData?.price_original &&
    dollarConversion({
      amount: listingData?.price_original,
      direction: 'toDollars',
      formatted: true,
    });

  const borrowPrice =
    listingData?.price_borrow &&
    dollarConversion({
      amount: listingData?.price_borrow,
      direction: 'toDollars',
      formatted: true,
    });

  const salePrice =
    listingData?.price_sale &&
    dollarConversion({
      amount: listingData?.price_sale,
      direction: 'toDollars',
      formatted: true,
    });

  const itemData = {
    id: listingData?.id ?? 0,
    userID: listingData?.user_id ?? null,
    username: listingData?.user_name ?? 'user',
    userCity: listingData?.city ?? 'city',
    userAvatar:
      listingData?.user_profile_image ||
      'https://hrnylgxecwjrlbnqbodg.supabase.co/storage/v1/object/public/user_profile/defaultpfp.jpeg?t=2024-11-03T21%3A19%3A23.972Z',
    name: listingData?.listing_name,
    borrowLength: listingData?.borrow_length,
    summary: listingData?.listing_summary,
    type: listingData?.type || listingData?.sub_category || 'type',
    microCategory: listingData?.micro_category,
    address: address,
    images: listingData?.listing_image_urls,
    size: listingData?.size || 'size',
    paused: listingData?.paused,
    periodToLend: listingData?.period_to_lend,
    unavailableDates: listingData?.unavailable_date,
    isSell: listingData?.is_sell || false,
    postalCode: postalCode,
    accountPaused:
      listingData?.pause_end_date && listingData?.pause_start_date
        ? moment(today).isBetween(
            new Date(listingData?.pause_start_date),
            new Date(listingData?.pause_end_date),
            'D',
            '[]',
          )
        : false,
    pausedStartDate: listingData?.pause_start_date,
    pausedEndDate: listingData?.pause_end_date,
    priceOriginal: originalPrice ?? 0,
    priceBorrow: borrowPrice ?? 0,
    salePrice: salePrice ?? 0,
    rating: listingData?.rating,
    discount: calculateDiscount(
      listingData?.price_original,
      listingData?.price_borrow,
    ),
    lendPeriods: listingData?.period_to_lend,
  };

  const renderBorrowPeriod = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    if (parseInt(item) === 0) return;
    const text =
      parseInt(item) > 30 ? `${parseInt(item) / 30} Months` : `${item} Days`;
    return (
      <TouchableOpacity
        style={[
          SBM.borrowPeriod,
          {
            backgroundColor:
              text === selectedPeriod ? palette.yellow : palette.lightGrey,
          },
        ]}
        onPress={() => {
          text === selectedPeriod
            ? setSelectedPeriod('')
            : setSelectedPeriod(text);
        }}
        key={index}>
        <Text style={SBM.days}>{text}</Text>
        <Text style={SBM.price}>
          {'CA $'}
          {calculateTotalPrice(
            parseInt(listingData?.price_borrow),
            parseInt(item),
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  // visual wrapper constraint
  const screenWidth = Dimensions.get('window').width;
  const carouselWidth = screenWidth;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}>
      <BorrowHeader
        headerType="main"
        backNav={backNav}
        backNavPayload={backNavPayload}
        itemData={itemData}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          paddingLeft: insets.left,
          paddingBottom: insets.bottom,
          paddingRight: insets.right,
        }}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <ScrollView
              style={SBM.scrollContainer}
              showsVerticalScrollIndicator={false}>
              <View>
                <Carousel
                  loop={itemData.images?.length > 1}
                  width={carouselWidth}
                  height={carouselWidth}
                  autoPlay={false}
                  data={
                    itemData.images?.length > 0
                      ? [...itemData.images]
                      : [
                          {
                            url_path:
                              'https://placecage.vercel.app/placecage/g/200/300',
                          },
                        ]
                  }
                  scrollAnimationDuration={750}
                  // renderItem={({item, index}) => renderImage(item) }
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {item?.url_path.endsWith('.mp4') ? (
                        <Video
                          onError={error => console.log('error, error', error)}
                          source={{
                            uri:
                              itemData.images?.length > 0
                                ? getImageSrc(itemData.name, item.url_path)
                                : item,
                          }}
                          style={SBM.image}
                          resizeMode="cover"
                          paused={false}
                          muted
                          controls
                          repeat
                        />
                      ) : (
                        <Image
                          source={{
                            uri:
                              itemData.images?.length > 0
                                ? getImageSrc(itemData.name, item.url_path)
                                : item,
                          }}
                          style={{
                            width: '100%',
                            aspectRatio: '83/96',
                            backgroundColor: palette.white,
                            position: 'relative',
                          }}
                        />
                      )}
                    </View>
                  )}
                />
              </View>
              <View style={SBM.caption}>
                <View style={SBM.title}>
                  <H2 text={itemData.name} />
                  {/* <View style={SBM.ratingContainer}>
                    <FontAwesomeIcon icon={faStar} size={14} />
                    <Text style={SBM.rating}>{itemData?.rating?.toFixed(1)}</Text>
                  </View> */}
                </View>
                <View style={SBM.details}>
                  <Text style={SBM.subTitleDetails}>
                    {distance}
                    {distance == '0' && ' km'} {keywords.distanceMessage}
                  </Text>
                  <View style={SBM.category}>
                    <Text style={SBM.subTitleDetails}>{itemData.type}</Text>
                    <Text style={SBM.subTitleDetails}>|</Text>
                    <Text style={SBM.subTitleDetails}>{itemData.size}</Text>
                  </View>
                  <View style={SBM.category}>
                    <Text style={SBM.buyPrice}>
                      {keywords.retail} {itemData.priceOriginal}
                    </Text>
                    <Text style={SBM.discount}>
                      {' '}
                      {itemData?.discount + '%'} {keywords.saving}
                    </Text>
                  </View>
                  <Text style={SBM.originalPrice}>
                    {keywords.rentFrom} {itemData.priceBorrow}
                  </Text>
                </View>
              </View>
              <View style={SBM.captionContainer}>
                <Text style={SBM.summary}>{itemData.summary}</Text>
              </View>
              <View style={SBM.questionsContainer}>
                <H2 text={keywords.commonlyAskedQuestions} />
                <View style={{ marginTop: 20 }}>
                  <FlatList
                    data={questions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <FAQsItem item={item} index={index} />
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    SBM.category,
                    { alignItems: 'center', marginTop: 10 },
                  ]}
                  onPress={() =>
                    navigation.navigate('Profile', {
                      screen: 'SettingsNav',
                      params: { screen: 'SettingsFAQs' },
                    })
                  }>
                  <H2
                    text={keywords.readAllFAQs}
                    style={{ color: palette.darkBlue }}
                  />
                  <FontAwesomeIcon icon={faRightLong} size={14} />
                </TouchableOpacity>
              </View>
              {listingData?.period_to_lend?.length > 0 && (
                <View style={SBM.captionContainer}>
                  <H2 text={keywords.borrowPeriod} />
                  <View style={SBM.borrowItemContainer}>
                    <FlatList
                      data={listingData?.period_to_lend}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderBorrowPeriod}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={SBM.actionContainer}>
              <Wrapper>
                {currentUser === itemData.userID ? (
                  <TouchableOpacity
                    style={SBM.actionButton}
                    onPress={() => {
                      navigation.navigate('BorrowNav', {
                        screen: 'EditListing',
                        params: {
                          listingData: { ...listingData, address: address },
                        },
                      });
                    }}>
                    <Text style={SBM.actionButtonText}>
                      {keywords.editLiting}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {itemData?.salePrice &&
                    itemData?.salePrice !== 0 &&
                    itemData?.isSell ? (
                      <View style={SBM.buttonContainer}>
                        <Button
                          text={`${keywords.buyFor}${itemData.salePrice}`}
                          onPress={() => {
                            listingData &&
                              navigation.navigate('BuyDates', {
                                itemData: {
                                  ...itemData,
                                  priceBorrow: itemData.salePrice,
                                },
                                selectedPeriod,
                              });
                          }}
                          variant="secondary"
                          style={SBM.button}
                        />
                        <View style={{ width: 10 }} />
                        <Button
                          text={keywords.borrow}
                          onPress={() => {
                            listingData &&
                              navigation.navigate('BorrowDates', {
                                itemData,
                                selectedPeriod,
                              });
                          }}
                          variant="main"
                          style={SBM.button}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          itemData.paused || itemData.accountPaused
                            ? SBM.actionButtonDisabled
                            : SBM.actionButton,
                        ]}
                        onPress={() => {
                          listingData &&
                            navigation.navigate('BorrowDates', {
                              itemData,
                              selectedPeriod,
                            });
                        }}
                        disabled={
                          itemData.paused || itemData.accountPaused
                            ? true
                            : false
                        }>
                        <Text style={SBM.actionButtonText}>
                          {keywords.borrow}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </Wrapper>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default BorrowMain;
