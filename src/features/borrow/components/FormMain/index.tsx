import React, { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  FlatList,
  Image as ImageView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { BSFM } from './FormMain.styles';
import { reduxSelect } from '@/types/reduxHooks';
import Video, { VideoRef } from 'react-native-video';
import Wrapper from '@/components/Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { faChevronRight } from '@fortawesome/sharp-light-svg-icons';
import H2 from '@/components/elements/H2';
import RangeSlider from '@/components/elements/Forms/RangeSlider';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import Button from '@/components/elements/Button/Button';
import {
  faCalendarCheck,
  faChevronDown,
  faX,
} from '@fortawesome/sharp-regular-svg-icons';
import useImagePicker from '@/components/elements/ImagePicker';
import { Image, ImageOrVideo } from 'react-native-image-crop-picker';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BottomSheets from '@/components/elements/BottomSheet';
import {
  conditions,
  fits,
  keywords,
  lengths,
} from '@/features/addListing/utils/keywords';
import { updateListing } from '@/features/addListing/api/updateListing';
import { ListingMainContext } from '@/features/addListing/context/ListingMainContext';
import ListingAddress from '@/features/addListing/components/ListingAddress';
import ListingDays from '@/features/addListing/components/ListingDays';
import ListingCalender from '@/features/addListing/components/ListingCalender';
import ListingOccasion from '@/features/addListing/components/ListingOccasion';
import ListingColors from '@/features/addListing/components/ListingColors';
import ListingSizes from '@/features/addListing/components/ListingSizes';
import ListingCategories from '@/features/addListing/components/ListingCategories';
import ListingSubCategories from '@/features/addListing/components/ListingSubCategories';
import { imageBaseUrl, listingVideoBaseUrl } from '@/utils/createStorageURL';
import { deleteListingImage } from '@/features/addListing/api/deleteListingImage';
import ListingMicroCategories from '@/features/addListing/components/ListingMicroCetagory';
import { listingTypes } from '@/features/feed/utils/filters';
import { getImageSrc } from '@/utils/renderItemsForTesting';

type PayloadType = {
  brand: string;
  name: string;
  description: string;
  retailPrice: string;
  listingPrice: string;
  sellPrice: string;
};

const FormMain = ({ data }: { data: any }) => {
  console.log('data', data);
  const imagePicker = useImagePicker();
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [fit, setFit] = useState<'Perfect' | 'Tight' | 'Loose'>(
    fits[data?.fit ?? 1],
  );
  const [selectedLength, setSelectedLength] = useState<
    'Short' | 'Perfect' | 'Long'
  >(lengths[1]);
  const [condition, setCondition] = useState<'Bad' | 'Good' | 'Great'>(
    conditions[data?.condition ?? 2],
  );
  const [size, setSize] = useState(data?.size);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState<string[]>(data?.color);
  const [type, setType] = useState(data?.type);
  const [occasion, setOccasion] = useState<string[]>(data?.occasion || []);
  const [category, setCategory] = useState(data?.category);
  const [subCategory, setSubCategory] = useState(data?.sub_category);
  const [microCategory, setMicroCategory] = useState(data?.micro_category);
  const [address, setAddress] = useState({
    address: data?.address?.split('#')[0],
    addressId: data?.address_id,
  });
  const [periodToLend, setPeriodToLend] = useState(
    data?.period_to_lend
      ?.filter((item: any) => item !== '0')
      ?.map(
        (date: string) =>
          ({
            text:
              date === '4'
                ? '4 Days'
                : date === '10'
                ? '10 Days'
                : date === '20'
                ? '20 Days'
                : date === '30'
                ? '1 Month'
                : date === '90'
                ? '3 Month'
                : date === '180' && '6 Month',
            days: parseInt(date),
            value:
              date === '4'
                ? 0
                : date === '10'
                ? 1
                : date === '20'
                ? 2
                : date === '30'
                ? 3
                : date === '90'
                ? 4
                : date === '180' && 5,
          } || []),
      ),
  );
  const [selectedDates, setSelectedDates] = useState(
    data?.unavailable_date?.map((date: string) => ({ [date]: '' })) || [],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [sellingItem, setSellingItem] = useState(data?.is_sell || true);
  const [error, setErrors] = useState({
    category: '',
    subCategory: '',
    microCategory: '',
    occasion: '',
    size: '',
    color: '',
    address: '',
    periodToLend: '',
  });
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const user = reduxSelect(state => state.usermeta);
  const [snapPoint, setSnapPoint] = useState<number | string>(1);
  const [media, setMedia] = useState<
    (ImageOrVideo & { oldImage: string; id: string })[]
  >([
    ...(data?.listing_image_urls?.length > 0
      ? data.listing_image_urls.map(
          (image: { url_path: string; id: string }) => ({
            oldImage: image.url_path,
            id: image?.id,
          }),
        )
      : []),
    ...(data?.listing_video_url?.length > 0
      ? data.listing_video_url.map(
          (video: { video_link: string; id: number }) => ({
            oldImage: video.video_link,
            id: video?.id,
          }),
        )
      : []),
  ]);

  const [bottomModal, setBottomModal] = useState('');
  const ref = useRef<any>(null);
  const videoRef = useRef<VideoRef>(null);

  const images = useMemo(
    () => media.filter(mediaFile => mediaFile?.mime?.split('/')[0] === 'image'),
    [media],
  ).length;
  const videos = useMemo(
    () => media.filter(mediaFile => mediaFile?.mime?.split('/')[0] === 'video'),
    [media],
  ).length;

  useEffect(() => {
    setValue('description', data?.listing_summary);
  }, [data]);

  useEffect(() => {
    if (
      videos > 0 &&
      imagePicker.selectedImagePath.some(
        image => image?.mime?.split('/')[0] === 'video',
      )
    ) {
      imagePicker.selectedImagePath.length > 0 &&
        errorToast(keywords.videoToastMessage);
    } else if (
      images > 4 &&
      imagePicker.selectedImagePath.some(
        image => image?.mime?.split('/')[0] === 'image',
      )
    ) {
      imagePicker.selectedImagePath.length > 0 &&
        errorToast(keywords.imageToastMessage);
    } else {
      const tempMedia = [...media, ...imagePicker.selectedImagePath];
      setMedia(tempMedia.slice(-6));
    }
  }, [imagePicker.selectedImagePath]);

  useEffect(() => {
    if (category !== '') {
      updateErrors('category', '');
    }
    if (subCategory !== '') {
      updateErrors('subCategory', '');
    }
    if (microCategory !== '') {
      updateErrors('microCategory', '');
    }
    if (occasion.length > 0) {
      updateErrors('occasion', '');
    }
    if (size !== '') {
      updateErrors('size', '');
    }
    if (color.length > 0) {
      updateErrors('color', '');
    }
    if (address.address !== '') {
      updateErrors('address', '');
    }
    if (periodToLend.length > 0) {
      updateErrors('periodToLend', '');
    }
    if (!sellingItem && errors.sellPrice?.message) {
      setError('sellPrice', { message: '' });
    }
  }, [
    category,
    subCategory,
    microCategory,
    occasion,
    size,
    color,
    address,
    periodToLend,
    sellingItem,
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      brand: data?.brand,
      name: data?.listing_name,
      description: data?.listing_summary,
      retailPrice: data?.price_original,
      listingPrice: data?.price_borrow,
      sellPrice: data?.price_sale,
    },
  });

  const showImagePickerAlert = () => {
    if (images === 5 && videos === 1) {
      errorToast(keywords.maximumReachToastMessage);
    } else {
      Alert.alert(
        'Select Image',
        'Choose an option to select an image',
        [
          {
            text: 'Camera',
            onPress: () => {
              imagePicker.openCamera('any');
            },
          },
          {
            text: 'Gallery',
            onPress: () => {
              imagePicker.openGallary('any');
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    }
  };

  const resetStates = () => {
    setValue('brand', '');
    setValue('name', '');
    setValue('description', '');
    setValue('retailPrice', '');
    setValue('listingPrice', '');
    setValue('sellPrice', '');
    clearErrors();
    setCategory('');
    setSubCategory('');
    setMicroCategory('');
    setOccasion([]);
    setColor([]);
    setCondition(conditions[0]);
    setFit(fits[0]);
    setSelectedLength(lengths[0]);
    setAddress({ address: '', addressId: '' });
    setSelectedDates([]);
    setPeriodToLend([{ text: '', days: 0, value: 0 }]);
    setSize('');
    setType('');
    imagePicker.setSelectedImagePath([]);
    setMedia([]);
  };

  const nextSteps = async (formData: PayloadType) => {
    console.log(JSON.stringify(formData));
    if (media.length === 0) {
      errorToast(keywords.selectImageMessage);
    } else if (category === '') {
      updateErrors('category', 'Category is required');
      errorToast(keywords.addListingErrorMessage);
    } else if (subCategory === '') {
      updateErrors('subCategory', 'Sub category is required');
      errorToast(keywords.addListingErrorMessage);
    } else if (occasion?.length === 0) {
      updateErrors('occasion', 'Occasion is required');
      errorToast(keywords.addListingErrorMessage);
    } else if (microCategory === '') {
      updateErrors('microCategory', 'microCategory is required');
      errorToast(keywords.addListingErrorMessage);
    } else if (color.length === 0) {
      updateErrors('color', 'Color is required');
      errorToast(keywords.addListingErrorMessage);
    } else if (address.address === '') {
      updateErrors('address', 'Address is required');
      errorToast(keywords.addListingErrorMessage);
    } else if (periodToLend.length === 0) {
      updateErrors('periodToLend', 'Lend period is required');
      errorToast(keywords.addListingErrorMessage);
    } else {
      setIsLoading(true);
      let payload = {
        itemData: {
          pId: data.id,
          userId: user.id!,
          name: normalizeWhitespaces(formData.name),
          brand: normalizeWhitespaces(formData.brand),
          description: normalizeWhitespaces(formData.description),
          originalPrice: Number(formData.retailPrice),
          borrowPrice: Number(formData.listingPrice),
          salePrice: Number(formData.sellPrice),
          size: size,
          color: color,
          type: type,
          category: category,
          subCategory: subCategory,
          microCategory: microCategory,
          occasion: occasion,
          gender: 'female',
          fit: fits.indexOf(fit),
          condition: conditions.indexOf(condition),
          length: lengths.indexOf(selectedLength),
          addressId: address.addressId,
          lendPeriod: periodToLend.map((day: { days: number }) =>
            day.days.toString(),
          ),
          availability: selectedDates.map((item: any) => Object.keys(item)[0]),
          images: imagePicker.selectedImagePath?.length > 0 ? media : null,
          sell: sellingItem,
        },
      };
      try {
        const response = await updateListing(payload.itemData);

        console.log('payload  : ', payload);
        console.log('update lising respose  : ', response);
        setIsLoading(false);
        navigation.goBack();
        resetStates();
      } catch (error: any) {
        console.log('Error : ', error, error?.message);
        errorToast(error?.message || 'Cannot update listing! Try again');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setSnapPoint(1);
  }, [category, subCategory, microCategory, size, color]);

  const updateErrors = (key: string, value: string) => {
    setErrors(prev => ({ ...prev, [key]: value }));
  };

  console.log('media', media);

  const renderItem = ({
    item,
    index,
  }: {
    item: ImageOrVideo & { oldImage: string; id: string };
    index: number;
  }) => {
    return (
      <View key={index} style={{ flexDirection: 'row', marginHorizontal: 5 }}>
        {item?.mime?.split('/')[0] === 'video' ||
        item?.oldImage?.endsWith('.mp4') ? (
          <Video
            source={{
              uri: item?.oldImage
                ? getImageSrc(data.listing_name, item.oldImage)
                : item.path,
            }}
            ref={videoRef}
            style={BSFM.media}
            repeat={true}
          />
        ) : (
          <ImageView
            source={{
              uri: item?.oldImage
                ? getImageSrc(data.listing_name, item.oldImage)
                : item.path,
            }}
            style={BSFM.media}
          />
        )}
        <TouchableOpacity
          onPress={async () => {
            if (item?.oldImage) {
              imagePicker.setSelectedImagePath([]);
              setMedia(media =>
                media.filter(media => media.oldImage !== item.oldImage),
              );
              await deleteListingImage(item.id);
            } else {
              imagePicker.setSelectedImagePath([]);
              setMedia(media =>
                media.filter(media => media.path !== item.path),
              );
            }
          }}
          style={BSFM.icon}>
          <FontAwesomeIcon icon={faX} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ListingMainContext.Provider
      value={{
        error,
        modalVisible,
        selectedImages,
        setErrors,
        setModalVisible,
        setSelectedImages,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          paddingLeft: insets.left,
          paddingBottom: insets.bottom,
          paddingRight: insets.right,
        }}>
        <ScrollView
          style={BSFM.mainContainer}
          showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={[
                BSFM.mediaContainer,
                { width: media.length > 0 ? '45%' : '94.5%' },
              ]}
              onPress={showImagePickerAlert}>
              <FontAwesomeIcon icon={faPlus} size={30} />
              <Text style={BSFM.addPhoto}>{keywords.addPhotoVideo}</Text>
            </TouchableOpacity>
            <FlatList
              data={media}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <Text style={BSFM.mediaCount}>
            {keywords.photos} {images}/5, {keywords.videos} {videos}/1,{' '}
            {keywords.selectCoverPhoto}
          </Text>

          {/* <ListingImages /> */}
          <View style={BSFM.detailsContainer}>
            <View
              style={[
                BSFM.inputContainer,
                errors.brand ? BSFM.inputContainerError : null,
              ]}>
              <Wrapper>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={keywords.brandName}
                      placeholderTextColor={palette.darkGrey}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={BSFM.textInput}
                    />
                  )}
                  name="brand"
                />
              </Wrapper>
            </View>

            {errors.brand?.message && (
              <Text style={BSFM.error}>{errors.brand.message.toString()}</Text>
            )}

            <View
              style={[
                BSFM.inputContainer,
                errors.name ? BSFM.inputContainerError : null,
              ]}>
              <Wrapper>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={keywords.nameOfItem}
                      placeholderTextColor={palette.darkGrey}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? ''}
                      style={BSFM.textInput}
                    />
                  )}
                  name="name"
                />
              </Wrapper>
            </View>

            {errors.name?.message && (
              <Text style={BSFM.error}>{errors.name?.message.toString()}</Text>
            )}

            <View
              style={[
                BSFM.inputContainer,
                errors.description ? BSFM.inputContainerError : null,
              ]}>
              <Wrapper>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={keywords.descriptionPlaceholder}
                      placeholderTextColor={palette.darkGrey}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value === null ? '' : value?.toString()}
                      style={BSFM.textInput}
                      multiline
                    />
                  )}
                  name="description"
                />
              </Wrapper>
            </View>

            {errors.description?.message && (
              <Text style={BSFM.error}>
                {errors.description?.message.toString()}
              </Text>
            )}

            <TouchableOpacity
              style={[
                BSFM.categoryContainer,
                error.category !== '' && BSFM.inputContainerError,
              ]}
              onPress={() => {
                setBottomModal('category');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%');
              }}>
              <Text style={BSFM.text}>{category || keywords.category}</Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            {error.category && <Text style={BSFM.error}>{error.category}</Text>}

            <TouchableOpacity
              style={[
                BSFM.categoryContainer,
                error.subCategory !== '' && BSFM.inputContainerError,
              ]}
              onPress={() => {
                setBottomModal('subCategory');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%');
              }}>
              <Text style={BSFM.text}>
                {subCategory || keywords.subCategory}
              </Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            {error.subCategory && (
              <Text style={BSFM.error}>{error.subCategory}</Text>
            )}

            {subCategory !== '' && (
              <>
                <TouchableOpacity
                  style={[
                    BSFM.categoryContainer,
                    error.microCategory ? BSFM.inputContainerError : undefined,
                  ]}
                  onPress={() => {
                    setBottomModal('microCategory');
                    ref.current?.snapToIndex(1);
                    setSnapPoint('50%');
                  }}>
                  <Text style={BSFM.text}>
                    {microCategory || keywords.microCategory}
                  </Text>
                  <FontAwesomeIcon size={16} icon={faChevronRight} />
                </TouchableOpacity>

                {error.microCategory && (
                  <Text style={BSFM.error}>{error.microCategory}</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={[
                BSFM.categoryContainer,
                error.occasion !== '' && BSFM.inputContainerError,
              ]}
              onPress={() => {
                setBottomModal('occasion');
                ref.current?.snapToIndex(1);
                setSnapPoint('60%');
              }}>
              <Text style={[BSFM.text, { width: '90%' }]} numberOfLines={1}>
                {occasion.join(', ') || keywords.occasion}
              </Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            {error.occasion && <Text style={BSFM.error}>{error.occasion}</Text>}

            {subCategory && subCategory !== listingTypes[0] && (
              <>
                <TouchableOpacity
                  style={[
                    BSFM.categoryContainer,
                    error.size ? BSFM.inputContainerError : undefined,
                  ]}
                  onPress={() => {
                    setBottomModal('size');
                    ref.current?.snapToIndex(1);
                    setSnapPoint('50%');
                  }}>
                  <Text style={BSFM.text}>{size || keywords.size}</Text>
                  <FontAwesomeIcon size={16} icon={faChevronRight} />
                </TouchableOpacity>
                {error.size && <Text style={BSFM.error}>{error.size}</Text>}
              </>
            )}

            <TouchableOpacity
              style={[
                BSFM.categoryContainer,
                error.color !== '' && BSFM.inputContainerError,
              ]}
              onPress={() => {
                setBottomModal('color');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%');
              }}>
              <Text style={BSFM.text} numberOfLines={1}>
                {color?.join(', ') || keywords.color}
              </Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            {error.color && <Text style={BSFM.error}>{error.color}</Text>}

            <View style={BSFM.sliderContainer}>
              <H2 text={keywords.fit} style={BSFM.sliderHeading} />
              <RangeSlider
                value={fits.indexOf(fit) + 1}
                setValue={(index: number) => setFit(fits[index - 1])}
                minimumValue={1}
                maximumValue={3}
                label=" "
                step={1}
                style={BSFM.slider}
              />
              <View style={BSFM.textContainer}>
                <Text style={BSFM.label}>{keywords.tight}</Text>
                <Text style={BSFM.label}>{keywords.perfect}</Text>
                <Text style={BSFM.label}>{keywords.loose}</Text>
              </View>
            </View>

            <View style={BSFM.sliderContainer}>
              <H2 text={keywords.length} style={BSFM.sliderHeading} />
              <RangeSlider
                value={lengths.indexOf(selectedLength) + 1}
                setValue={(index: number) =>
                  setSelectedLength(lengths[index - 1])
                }
                minimumValue={1}
                maximumValue={3}
                label=" "
                step={1}
                style={BSFM.slider}
              />
              <View style={BSFM.textContainer}>
                <Text style={BSFM.label}>{keywords.short}</Text>
                <Text style={BSFM.label}>{keywords.perfect}</Text>
                <Text style={BSFM.label}>{keywords.long}</Text>
              </View>
            </View>

            <View style={BSFM.sliderContainer}>
              <H2 text={keywords.condition} style={BSFM.sliderHeading} />
              <RangeSlider
                value={conditions.indexOf(condition) + 1}
                setValue={(index: number) =>
                  setCondition(conditions[index - 1])
                }
                minimumValue={1}
                maximumValue={3}
                label=" "
                step={1}
                style={BSFM.slider}
              />
              <View style={BSFM.textContainer}>
                <Text style={BSFM.label}>{keywords.bad}</Text>
                <Text style={BSFM.label}>{keywords.good}</Text>
                <Text style={BSFM.label}>{keywords.great}</Text>
              </View>
            </View>

            <View style={BSFM.bottomContainer}>
              <H2 text={keywords.location} />
            </View>
            <TouchableOpacity
              style={[
                BSFM.categoryContainer,
                error.address !== '' && BSFM.inputContainerError,
              ]}
              onPress={() => {
                setBottomModal('address');
                ref.current?.snapToIndex(1);
                setSnapPoint('70%');
              }}>
              <Text style={[BSFM.text, { width: '90%' }]} numberOfLines={1}>
                {address?.address || keywords.address}
              </Text>
              <FontAwesomeIcon size={16} icon={faChevronRight} />
            </TouchableOpacity>

            {error.address && <Text style={BSFM.error}>{error.address}</Text>}

            <View style={BSFM.bottomContainer}>
              <H2 text={keywords.pricing} />
            </View>

            <View
              style={[
                BSFM.inputContainer,
                errors.retailPrice ? BSFM.inputContainerError : null,
              ]}>
              <Wrapper>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={keywords.retailPricePlaceholder}
                      placeholderTextColor={palette.darkGrey}
                      onBlur={() => {
                        onBlur();
                        setValue(
                          'listingPrice',
                          (watch('retailPrice') * 0.2).toFixed(0),
                        );
                      }}
                      onChangeText={onChange}
                      value={value === null ? '' : value?.toString()}
                      style={BSFM.textInput}
                      keyboardType="numeric"
                    />
                  )}
                  name="retailPrice"
                />
              </Wrapper>
            </View>

            {errors.retailPrice?.message && (
              <Text style={BSFM.error}>
                {errors.retailPrice?.message.toString()}
              </Text>
            )}

            <View
              style={[
                BSFM.inputContainer,
                errors.listingPrice ? BSFM.inputContainerError : null,
              ]}>
              <Wrapper>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={keywords.listingPricePlaceholder}
                      placeholderTextColor={palette.darkGrey}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value === null ? '' : value?.toString()}
                      style={BSFM.textInput}
                      keyboardType="numeric"
                      multiline
                    />
                  )}
                  name="listingPrice"
                />
              </Wrapper>
            </View>

            {errors.listingPrice?.message && (
              <Text style={BSFM.error}>
                {errors.listingPrice?.message.toString()}
              </Text>
            )}

            <Text style={BSFM.recommendedText}>
              {keywords.recommendListingPriceMessage.toString()}
            </Text>
            <View style={BSFM.checkBox}>
              <Checkbox
                label={keywords.sellYourListing}
                isChecked={sellingItem}
                onClick={() => setSellingItem(!sellingItem)}
                textStyle={BSFM.checkBoxText}
              />
            </View>
            {sellingItem && (
              <View
                style={[
                  BSFM.inputContainer,
                  errors.sellPrice ? BSFM.inputContainerError : null,
                ]}>
                <Wrapper>
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={keywords.sellPrice}
                        placeholderTextColor={palette.darkGrey}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value === null ? '' : value?.toString()}
                        style={BSFM.textInput}
                        keyboardType="numeric"
                        multiline
                      />
                    )}
                    name="sellPrice"
                  />
                </Wrapper>
              </View>
            )}

            {errors.sellPrice?.message && sellingItem && (
              <Text style={BSFM.error}>
                {errors.sellPrice?.message.toString()}
              </Text>
            )}

            <Text style={BSFM.recommendedText}>
              {keywords.sellRecommendedLisitngPriceMessage.toString()}
            </Text>
            <View style={BSFM.bottomContainer}>
              <H2 text={keywords.availibility} />
            </View>
            <TouchableOpacity
              style={[
                BSFM.categoryContainer,
                error.periodToLend !== '' && BSFM.inputContainerError,
              ]}
              onPress={() => {
                setBottomModal('days');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%');
              }}>
              <Text style={[BSFM.text, { width: '90%' }]} numberOfLines={1}>
                {periodToLend?.map((item: any) => item.text).join(', ') ||
                  keywords.selectLendPeriod}
              </Text>
              <FontAwesomeIcon size={16} icon={faChevronDown} />
            </TouchableOpacity>

            {error.periodToLend && sellingItem && (
              <Text style={BSFM.error}>{error.periodToLend}</Text>
            )}

            <TouchableOpacity
              style={BSFM.categoryContainer}
              onPress={() => {
                setBottomModal('calender');
                ref.current?.snapToIndex(1);
                setSnapPoint('70%');
              }}>
              <Text style={[BSFM.text, { width: '90%' }]} numberOfLines={1}>
                {selectedDates.length > 0
                  ? selectedDates
                      ?.map((item: any) => Object.keys(item))
                      .join(', ')
                  : keywords.unavaialableDate}
              </Text>
              <FontAwesomeIcon size={16} icon={faCalendarCheck} />
            </TouchableOpacity>
          </View>

          <View style={BSFM.submissionContainer}>
            <Button
              text={keywords.updateItem}
              onPress={() => {
                if (isLoading) {
                  return;
                } else {
                  handleSubmit(nextSteps)();
                }
              }}
              variant="main"
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomSheets
        bottomSheetRef={ref}
        snapPoint={snapPoint}
        setSnapPoint={setSnapPoint}
        handleSheetChanges={() => {}}>
        {bottomModal === 'address' ? (
          <ListingAddress address={address} setAddress={setAddress} />
        ) : bottomModal === 'days' ? (
          <ListingDays
            periodToLend={periodToLend}
            setPeriodToLend={setPeriodToLend}
          />
        ) : bottomModal === 'calender' ? (
          <ListingCalender
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
          />
        ) : bottomModal === 'occasion' ? (
          <ListingOccasion occasion={occasion} setOccasion={setOccasion} />
        ) : bottomModal === 'color' ? (
          <ListingColors color={color} setColor={setColor} />
        ) : bottomModal === 'size' ? (
          <ListingSizes
            size={size}
            setSize={setSize}
            subCategory={subCategory}
          />
        ) : bottomModal === 'category' ? (
          <ListingCategories category={category} setCategory={setCategory} />
        ) : bottomModal === 'subCategory' ? (
          <ListingSubCategories
            category={category}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
          />
        ) : bottomModal === 'microCategory' ? (
          <ListingMicroCategories
            subCategory={subCategory}
            microCategory={microCategory}
            setMicroCategory={setMicroCategory}
          />
        ) : (
          bottomModal === 'payment' && null
        )}
      </BottomSheets>
      <Toast config={toastConfig} />
    </ListingMainContext.Provider>
  );
};

export default FormMain;
