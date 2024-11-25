import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Alert, BackHandler, FlatList, Image as ImageView, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import LMS from './ListingMain.styles';
import { reduxSelect } from '@/types/reduxHooks';
import { ListingMainContext } from '../../context/ListingMainContext';
import Video, { VideoRef } from 'react-native-video';
import Wrapper from '@/components/Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native';
import ListingHeader from '../../components/ListingHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { faChevronRight } from '@fortawesome/sharp-light-svg-icons';
import { conditions, fits, keywords, lengths, subCategories } from '../../utils/keywords';
import H2 from '@/components/elements/H2';
import RangeSlider from '@/components/elements/Forms/RangeSlider';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import Button from '@/components/elements/Button/Button';
import { faCalendarCheck, faChevronDown, faX } from '@fortawesome/sharp-regular-svg-icons';
import useImagePicker from '@/components/elements/ImagePicker';
import { Image } from 'react-native-image-crop-picker';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { insertNewListing } from '../../api/insertListing';
import BottomSheets from '@/components/elements/BottomSheet';
import ListingAddress from '../../components/ListingAddress';
import ListingDays from '../../components/ListingDays';
import ListingCalender from '../../components/ListingCalender';
import ListingOccasion from '../../components/ListingOccasion';
import ListingColors from '../../components/ListingColors';
import ListingSizes from '../../components/ListingSizes';
import ListingSubCategories from '../../components/ListingSubCategories';
import ListingCategories from '../../components/ListingCategories';
import { SUPABASE_ANON_KEY, STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'
import { checkRequirements } from '../../api/checkRequirements';
import ListingMicroCategories from '../../components/ListingMicroCetagory';
import { listingTypes } from '@/features/feed/utils/filters';

type PayloadType = {
  brand: string;
  name: string;
  description: string;
  retailPrice: string;
  listingPrice: string;
  sellPrice: string;
}

type ListingMainProps = {
  edit: boolean;
  listingData: {
    id: string;
    userID: string;
    username: string;
    userCity: string;
    userAvatar: string;
    name: string;
    summary: string;
    type: string;
    image: string;
    size: string;
    borrowLength: number;
    priceOriginal: number;
    priceBorrow: number;
  }
}

const ListingMain = () => {
  const imagePicker = useImagePicker();
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [fit, setFit] = useState<'Perfect' | 'Tight' | 'Loose'>(fits[1]);
  const [selectedLength, setSelectedLength] = useState<'Short' | 'Perfect' | 'Long'>(lengths[1]);
  const [condition, setCondition] = useState<'Bad' | 'Good' | 'Great'>(conditions[2]);
  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState<string[]>([]);
  const [type, setType] = useState('');
  const [occasion, setOccasion] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [microCategory, setMicroCategory] = useState('')
  const [address, setAddress] = useState({
    address: '',
    addressId: '',
  });
  const [periodToLend, setPeriodToLend] = useState([{
    text: '',
    days: 0,
    value: 0
  }]);
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sellingItem, setSellingItem] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState({
    category: "",
    subCategory: "",
    microCategory: "",
    occasion: "",
    size: "",
    color: "",
    address: "",
    periodToLend: "",
  })
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const user = reduxSelect(state => state.usermeta);
  const stripeID = reduxSelect(state => state.usermeta.stripe_account_id);
  const [snapPoint, setSnapPoint] = useState<number | string>(1)
  const [bottomModal, setBottomModal] = useState('');
  const [bankAccount, setBankAccount] = useState<{ bank_name: string, last4: string } | null>(null);
  const ref = useRef<any>(null);
  const videoRef = useRef<VideoRef>(null);
  const isFocused = useIsFocused();

  const [media, setMedia] = useState<Image[]>([]);
  const images = useMemo(() => media.filter(mediaFile => mediaFile?.mime?.split('/')[0] === 'image'), [media]).length;
  const videos = useMemo(() => media.filter(mediaFile => mediaFile?.mime?.split('/')[0] === 'video'), [media]).length;

  useEffect(() => {
    const getAllBankAccounts = async () => {
      await getBankAccounts();
    }
    stripeID && getAllBankAccounts();

    return () => {
      if (navigation.getState().routeNames.includes('ListingMain') && !navigation.canGoBack()) {
        resetStates()
      }
    }
  }, [isFocused]);

  const getBankAccounts = async () => {
    try {
      const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-default-external-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          connectedAccountId: stripeID
        }),
      });

      const data = await response.json();
      console.log(data, 'all available payment methods')
      if (data?.error) {
        // errorToast(data.error);
        return;
      }
      if (data) {
        setBankAccount(data?.defaultExternalAccount);
      }
      return data
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (videos > 0 && imagePicker.selectedImagePath.some(image => image?.mime?.split('/')[0] === 'video')) {
      imagePicker.selectedImagePath.length > 0 && errorToast(keywords.videoToastMessage)
    } else if (images > 4 && imagePicker.selectedImagePath.some(image => image?.mime?.split('/')[0] === 'image')) {
      imagePicker.selectedImagePath.length > 0 && errorToast(keywords.imageToastMessage)
    } else {
      const tempMedia = [...media, ...imagePicker.selectedImagePath,]
      setMedia(tempMedia.slice(-6));
    }

  }, [imagePicker.selectedImagePath]);

  useEffect(() => {
    const backAction = () => {
      if (snapPoint === 1 || snapPoint === 2) {
        if (navigation.getState().routes[0].name === "ListingMain") {
          Alert.alert("Discard", "Are you sure, you want to discard listing?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Decline",
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          navigation.goBack();
        }
      } else {
        setSnapPoint(1);
      }

      return true;
    };

    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }

    const unsubscribeBlur = navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      unsubscribeBlur();
    };
  }, [isFocused, navigation, snapPoint]);

  useEffect(() => {
    if (category !== "") {
      updateErrors("category", "");
    }
    if (subCategory !== "") {
      updateErrors("subCategory", "");
    }
    if (microCategory !== "") {
      updateErrors("microCategory", "");
    }
    if (occasion.length > 0) {
      updateErrors("occasion", "");
    }
    if (size !== "") {
      updateErrors("size", "");
    }
    if (color.length > 0) {
      updateErrors("color", "");
    }
    if (address.address !== "") {
      updateErrors("address", "");
    }
    if (periodToLend.length > 1) {
      updateErrors("periodToLend", "");
    }
    if (!sellingItem && errors.sellPrice?.message) {
      setError("sellPrice", { message: "" })
    }

  }, [category, subCategory, microCategory, occasion, size, color, address, periodToLend, sellingItem])

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
      brand: '',
      name: '',
      description: '',
      retailPrice: '',
      listingPrice: '',
      sellPrice: '',
    },
  });

  const showImagePickerAlert = () => {
    if (images === 5 && videos === 1) {
      errorToast(keywords.maximumReachToastMessage)
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
    setCondition(conditions[2]);
    setFit(fits[1]);
    setSelectedLength(lengths[1]);
    setAddress({ address: '', addressId: '' });
    setSelectedDates([]);
    setPeriodToLend([{ text: '', days: 0, value: 0 }]);
    setSize('');
    setType('');
    imagePicker.selectedImagePath.length = 0;
    media.length = 0;
    imagePicker.setSelectedImagePath([]);
    setMedia([])
  }

  const nextSteps = async (formData: PayloadType) => {
    console.log(JSON.stringify(formData))
    if (media.length === 0) {
      errorToast(keywords.selectImageMessage)
    } else if (category === "") {
      updateErrors('category', "Category is required")
      errorToast(keywords.addListingErrorMessage)
    } else if (subCategory === "") {
      updateErrors('subCategory', "Sub category is required")
      errorToast(keywords.addListingErrorMessage)
    } else if (occasion?.length === 0) {
      updateErrors('occasion', "Occasion is required")
      errorToast(keywords.addListingErrorMessage)
    } else if (microCategory === "") {
      updateErrors('microCategory', "microCategory is required")
      errorToast(keywords.addListingErrorMessage)
    } else if (color.length === 0) {
      updateErrors('color', "Color is required")
      errorToast(keywords.addListingErrorMessage)
    } else if (address.address === "") {
      updateErrors('address', "Address is required")
      errorToast(keywords.addListingErrorMessage)
    } else if (periodToLend.length === 0) {
      updateErrors('periodToLend', "Lend period is required")
      errorToast(keywords.addListingErrorMessage)
    } else {
      setIsLoading(true)
      let payload = {
        itemData: {
          userId: user.id!,
          name: normalizeWhitespaces(formData.name),
          brand: normalizeWhitespaces(formData.brand),
          description: normalizeWhitespaces(formData.description),
          originalPrice: Number(formData.retailPrice),
          borrowPrice: Number(formData.listingPrice),
          salePrice: Number(formData?.sellPrice || 0),
          size: subCategory === subCategories[0].text ? "" : size,
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
          lendPeriod: periodToLend.map(day => day.days.toString()),
          availability: selectedDates?.map((item: any) => Object.keys(item)[0]) || [''],
          images: media,
          sell: sellingItem
        }
      }
      try {
        const response = await insertNewListing(payload.itemData)
        if (response) {
          setIsLoading(false)
          resetStates()
          navigation.navigate('Profile')
          // navigation.navigate('FeedProfile', { userID: user.id! })
        }
        setIsLoading(false)
      } catch (error: any) {
        console.log("Error : ", error, error?.message)
        errorToast(error?.message || "Cannot create listing! Try again")
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    setSubCategory("")
  }, [category])

  useEffect(() => {
    setMicroCategory("")
  }, [subCategory])

  useEffect(() => {
    setSnapPoint(1)
  }, [category, subCategory, microCategory, size]);

  const handleConnect = async () => {
    if (loading) return;
    setLoading(true)
    try {
      if (stripeID) {
        const requirements = await checkRequirements(stripeID);

        if (requirements?.errors?.some((error: { requirement: string }) => error.requirement === "individual.verification.document")) {
          navigation.navigate("UploadIdentityDocument")
          setLoading(false)
        }
        else if (requirements?.eventually_due && requirements?.eventually_due.includes("individual.verification.proof_of_liveness")) {
          navigation.navigate("UploadAdditionalDocument")
          setLoading(false)
        } else if (requirements) {
          navigation.navigate("BankAccounts")
          setLoading(false)
        } else {
          setLoading(false)
        }
      } else {
        navigation.navigate("CreateConnect")
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const updateErrors = (key: string, value: string) => {
    setErrors((prev) => ({ ...prev, [key]: value }));
  }

  const renderItem = ({ item, index }: { item: Image, index: number }) => {
    console.log(item)
    return (
      <View key={index} style={{ flexDirection: 'row', marginHorizontal: 5, }}>
        {item.mime.split('/')[0] === 'video' ?
          <Video
            source={{ uri: item.path }}
            ref={videoRef}
            style={LMS.media}
          // controls={true}
          /> :
          <ImageView source={{ uri: item.path }} style={LMS.media} />

        }<TouchableOpacity
          onPress={() => {
            imagePicker.setSelectedImagePath([])
            setMedia((media) => media.filter(media => media.path !== item.path))
          }}
          style={LMS.icon}>
          <FontAwesomeIcon icon={faX} />
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <ListingMainContext.Provider
      value={{
        error,
        modalVisible,
        selectedImages,
        setErrors,
        setModalVisible,
        setSelectedImages,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: palette.white,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingLeft: insets.left,
            paddingBottom: insets.bottom,
            paddingRight: insets.right,
          }}
        >
          <ListingHeader headerType='main' title={keywords.addListing} />
          <ScrollView style={LMS.mainContainer} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[LMS.mediaContainer, { width: media.length > 0 ? '45%' : '94.5%' }]}
                onPress={showImagePickerAlert}>
                <FontAwesomeIcon icon={faPlus} size={30} />
                <Text style={LMS.addPhoto}>{keywords.addPhotoVideo}</Text>
              </TouchableOpacity>
              <FlatList
                data={media}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Text style={LMS.mediaCount}>{keywords.photos} {images}/5, {keywords.videos} {videos}/1, {keywords.selectCoverPhoto}</Text>

            <View style={LMS.detailsContainer}>
              <View style={[LMS.inputContainer, errors.brand ? LMS.inputContainerError : null]}>
                <Wrapper>
                  <Controller
                    control={control}
                    rules={{
                      required: "Brand name is required",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={keywords.brandName}
                        placeholderTextColor={palette.darkGrey}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ?? ''}
                        style={LMS.textInput}
                      />
                    )}
                    name="brand"
                  />
                </Wrapper>
              </View>

              {errors.brand?.message && <Text style={LMS.error}>{errors.brand?.message}</Text>}

              <View style={[LMS.inputContainer, errors.name ? LMS.inputContainerError : null]}>
                <Wrapper>
                  <Controller
                    control={control}
                    rules={{
                      required: "Name is required",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={keywords.nameOfItem}
                        placeholderTextColor={palette.darkGrey}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ?? ''}
                        style={LMS.textInput}

                      />
                    )}
                    name="name"
                  />
                </Wrapper>
              </View>

              {errors.name?.message && <Text style={LMS.error}>{errors.name?.message}</Text>}

              <View style={[LMS.inputContainer, errors.description ? LMS.inputContainerError : null]}>
                <Wrapper>
                  <Controller
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={keywords.descriptionPlaceholder}
                        placeholderTextColor={palette.darkGrey}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value === null ? '' : value.toString()}
                        style={LMS.textInput}
                        multiline
                      />
                    )}
                    name="description"
                  />
                </Wrapper>
              </View>

              {errors.description?.message && <Text style={LMS.error}>{errors.description?.message}</Text>}

              <TouchableOpacity style={[LMS.categoryContainer, error.category ? LMS.inputContainerError : undefined]} onPress={() => {
                setBottomModal('category');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%')
              }}>
                <Text style={LMS.text}>{category || keywords.category}</Text>
                <FontAwesomeIcon size={16} icon={faChevronRight} />
              </TouchableOpacity>

              {error.category && <Text style={LMS.error}>{error.category}</Text>}

              <TouchableOpacity style={[LMS.categoryContainer, error.subCategory ? LMS.inputContainerError : undefined]} onPress={() => {
                setBottomModal('subCategory');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%')
              }}>
                <Text style={LMS.text}>{subCategory || keywords.subCategory}</Text>
                <FontAwesomeIcon size={16} icon={faChevronRight} />
              </TouchableOpacity>

              {error.subCategory && <Text style={LMS.error}>{error.subCategory}</Text>}

              {subCategory !== '' && <>
                <TouchableOpacity style={[LMS.categoryContainer, error.microCategory ? LMS.inputContainerError : undefined]} onPress={() => {
                  setBottomModal('microCategory');
                  ref.current?.snapToIndex(1);
                  setSnapPoint('50%')
                }}>
                  <Text style={LMS.text}>{microCategory || keywords.microCategory}</Text>
                  <FontAwesomeIcon size={16} icon={faChevronRight} />
                </TouchableOpacity>

                {error.microCategory && <Text style={LMS.error}>{error.microCategory}</Text>}
              </>
              }

              <TouchableOpacity style={[LMS.categoryContainer, error.occasion ? LMS.inputContainerError : undefined]} onPress={() => {
                setBottomModal('occasion');
                ref.current?.snapToIndex(1);
                setSnapPoint('60%')
              }}>
                <Text style={[LMS.text, { width: '90%' }]} numberOfLines={1}>{occasion.join(", ") || keywords.occasion}</Text>
                <FontAwesomeIcon size={16} icon={faChevronRight} />
              </TouchableOpacity>

              {error.occasion && <Text style={LMS.error}>{error.occasion}</Text>}

              {subCategory && (subCategory !== listingTypes[0] && subCategory !== listingTypes[9] && subCategory !== listingTypes[11]) && <>
                <TouchableOpacity style={[LMS.categoryContainer, error.size ? LMS.inputContainerError : undefined]} onPress={() => {
                  setBottomModal('size');
                  ref.current?.snapToIndex(1);
                  setSnapPoint('50%')
                }}>
                  <Text style={LMS.text}>{size || keywords.size}</Text>
                  <FontAwesomeIcon size={16} icon={faChevronRight} />
                </TouchableOpacity>
                {error.size && <Text style={LMS.error}>{error.size}</Text>}
              </>
              }

              <TouchableOpacity style={[LMS.categoryContainer, error.color ? LMS.inputContainerError : undefined]} onPress={() => {
                setBottomModal('color');
                ref.current?.snapToIndex(1);
                setSnapPoint('50%')
              }}>
                <Text style={LMS.text} numberOfLines={1}>{color.join(", ") || keywords.color}</Text>
                <FontAwesomeIcon size={16} icon={faChevronRight} />
              </TouchableOpacity>

              {error.color && <Text style={LMS.error}>{error.color}</Text>}

              <View style={LMS.sliderContainer}>
                <H2 text={keywords.fit} style={LMS.sliderHeading} />
                <RangeSlider
                  value={fits.indexOf(fit) + 1}
                  setValue={(index: number) => setFit(fits[index - 1])}
                  minimumValue={1}
                  maximumValue={3}
                  label=' '
                  step={1}
                  style={LMS.slider} />
                <View style={LMS.textContainer}>
                  <Text style={LMS.label}>{keywords.tight}</Text>
                  <Text style={LMS.label}>{keywords.perfect}</Text>
                  <Text style={LMS.label}>{keywords.loose}</Text>
                </View>
              </View>

              <View style={LMS.sliderContainer}>
                <H2 text={keywords.length} style={LMS.sliderHeading} />
                <RangeSlider
                  value={lengths.indexOf(selectedLength) + 1}
                  setValue={(index: number) => setSelectedLength(lengths[index - 1])}
                  minimumValue={1}
                  maximumValue={3}
                  label=' '
                  step={1}
                  style={LMS.slider} />
                <View style={LMS.textContainer}>
                  <Text style={LMS.label}>{keywords.short}</Text>
                  <Text style={LMS.label}>{keywords.perfect}</Text>
                  <Text style={LMS.label}>{keywords.long}</Text>
                </View>
              </View>

              <View style={LMS.sliderContainer}>
                <H2 text={keywords.condition} style={LMS.sliderHeading} />
                <RangeSlider
                  value={conditions.indexOf(condition) + 1}
                  setValue={(index: number) => setCondition(conditions[index - 1])}
                  minimumValue={1}
                  maximumValue={3}
                  label=' '
                  step={1}
                  style={LMS.slider} />
                <View style={LMS.textContainer}>
                  <Text style={LMS.label}>{keywords.bad}</Text>
                  <Text style={LMS.label}>{keywords.good}</Text>
                  <Text style={LMS.label}>{keywords.great}</Text>
                </View>
              </View>

              <View style={LMS.bottomContainer}>
                <H2 text={keywords.location} />
              </View>
              <TouchableOpacity style={[LMS.categoryContainer, error.address ? LMS.inputContainerError : undefined]} onPress={() => {
                setBottomModal('address')
                ref.current?.snapToIndex(1)
                setSnapPoint('60%');
              }}>
                <Text style={[LMS.text, { width: '90%' }]} numberOfLines={1}>{address?.address?.split("#")[0] || keywords.address}</Text>
                <FontAwesomeIcon size={16} icon={faChevronRight} />
              </TouchableOpacity>

              {error.address && <Text style={LMS.error}>{error.address}</Text>}

              <View style={LMS.bottomContainer}>
                <H2 text={keywords.pricing} />
              </View>


              <View style={[LMS.inputContainer, errors.retailPrice ? LMS.inputContainerError : null]}>
                <Wrapper>
                  <Controller
                    control={control}
                    rules={{ required: "Retail price is required" }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={keywords.retailPricePlaceholder}
                        placeholderTextColor={palette.darkGrey}
                        onBlur={() => {
                          onBlur()
                          setValue('listingPrice', (parseFloat(watch('retailPrice')) * 0.2).toFixed(0))
                        }}
                        onChangeText={onChange}
                        value={value === null ? '' : value.toString()}
                        style={LMS.textInput}
                        keyboardType='numeric'
                      />
                    )}
                    name='retailPrice'
                  />
                </Wrapper>
              </View>

              {errors.retailPrice?.message && <Text style={LMS.error}>{errors.retailPrice?.message}</Text>}

              <View style={[LMS.inputContainer, errors.listingPrice ? LMS.inputContainerError : null]}>
                <Wrapper>
                  <Controller
                    control={control}
                    rules={{ required: "Listing price is required" }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={keywords.listingPricePlaceholder}
                        placeholderTextColor={palette.darkGrey}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value === null ? '' : value.toString()}
                        style={[LMS.textInput, { height: 50 }]}
                        keyboardType='numeric'
                      />
                    )}
                    name='listingPrice'
                  />
                </Wrapper>
              </View>

              {errors.listingPrice?.message && <Text style={LMS.error}>{errors.listingPrice?.message}</Text>}

              <Text style={LMS.recommendedText}>{keywords.recommendListingPriceMessage}</Text>
              <View style={LMS.checkBox}>
                <Checkbox
                  label={keywords.sellYourListing}
                  isChecked={sellingItem}
                  onClick={() => setSellingItem(!sellingItem)}
                  textStyle={LMS.checkBoxText}
                />
              </View>
              {sellingItem &&
                <View style={[LMS.inputContainer, (errors.sellPrice && sellingItem) ? LMS.inputContainerError : null]}>
                  <Wrapper>
                    <Controller
                      control={control}
                      rules={{ required: sellingItem ? "Sell price is required " : false }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder={keywords.sellPrice}
                          placeholderTextColor={palette.darkGrey}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value === null ? '' : value.toString()}
                          style={LMS.textInput}
                          keyboardType='numeric'
                          multiline
                        />
                      )}
                      name='sellPrice'
                    />
                  </Wrapper>
                </View>
              }

              {errors.sellPrice?.message && sellingItem && <Text style={LMS.error}>{errors.sellPrice?.message}</Text>}

              {sellingItem && <Text style={LMS.recommendedText}>{keywords.sellRecommendedLisitngPriceMessage}</Text>}

              <View style={LMS.bottomContainer}>
                <H2 text={keywords.getPaidOut} />
                {bankAccount === null ?
                  <Button text={keywords.connectBankAccount} onPress={handleConnect} variant='secondary' style={LMS.connnectBankButton} loading={loading} color={palette.darkBlue} />
                  :
                  <TouchableOpacity style={LMS.bank} onPress={handleConnect}>

                    <View style={LMS.bankContainer}>
                      <Text style={LMS.bankName}>
                        {`${bankAccount.bank_name} ${bankAccount.last4}`}
                      </Text>
                      {loading ? <ActivityIndicator size={'small'} color={palette.black} /> :
                        <TouchableOpacity onPress={() => { }}>
                          <FontAwesomeIcon icon={'chevron-right'} />
                        </TouchableOpacity>
                      }
                    </View>

                  </TouchableOpacity>
                }
                <Text style={LMS.textBold}>{keywords.note}
                  <Text style={[LMS.recommendedText, { fontWeight: '400' }]}>{keywords.bankAccountMessage}</Text>
                </Text>
              </View>


              <View style={LMS.bottomContainer}>
                <H2 text={keywords.availibility} />
              </View>
              <TouchableOpacity style={[LMS.categoryContainer, error.periodToLend ? LMS.inputContainerError : undefined]} onPress={() => {
                setBottomModal('days')
                ref.current?.snapToIndex(1)
                setSnapPoint('50%');
              }}>
                <Text style={[LMS.text, { width: '90%' }]} numberOfLines={1}>
                  {periodToLend.map(item => item.text).join(", ") || keywords.selectLendPeriod}
                </Text>
                <FontAwesomeIcon size={16} icon={faChevronDown} />
              </TouchableOpacity>

              {error.periodToLend && <Text style={LMS.error}>{error.periodToLend}</Text>}

              <TouchableOpacity style={LMS.categoryContainer} onPress={() => {
                setBottomModal('calender')
                ref.current?.snapToIndex(1)
                setSnapPoint('70%');
              }}>
                <Text style={[LMS.text, { width: '90%' }]} numberOfLines={1}>
                  {selectedDates.length > 0 ? selectedDates.map((item: any) => Object.keys(item)).join(", ") : keywords.unavaialableDate}
                </Text>
                <FontAwesomeIcon size={16} icon={faCalendarCheck} />
              </TouchableOpacity>
            </View>
            <View style={{ height: 80 }} />
            <View style={LMS.submissionContainer}>
              <Button text={keywords.saveItem} onPress={() => {
                console.log(errors)
                if (isLoading) {
                  return;
                }
                else {
                  handleSubmit(nextSteps)();
                }
              }}
                variant='main'
                loading={isLoading} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <BottomSheets bottomSheetRef={ref} snapPoint={snapPoint} setSnapPoint={setSnapPoint} handleSheetChanges={() => { }}>
          {bottomModal === 'address' ?
            <ListingAddress address={address} setAddress={setAddress} /> :
            bottomModal === 'days' ?
              <ListingDays periodToLend={periodToLend} setPeriodToLend={setPeriodToLend} /> :
              bottomModal === 'calender' ?
                <ListingCalender selectedDates={selectedDates} setSelectedDates={setSelectedDates} /> :
                bottomModal === 'occasion' ?
                  <ListingOccasion occasion={occasion} setOccasion={setOccasion} /> :
                  bottomModal === 'color' ?
                    <ListingColors color={color} setColor={setColor} /> :
                    bottomModal === 'size' ?
                      <ListingSizes size={size} setSize={setSize} subCategory={subCategory} /> :
                      bottomModal === 'category' ?
                        <ListingCategories category={category} setCategory={setCategory} /> :
                        bottomModal === 'subCategory' ?
                          <ListingSubCategories category={category} subCategory={subCategory} setSubCategory={setSubCategory} /> :
                          bottomModal === 'microCategory' ?
                            <ListingMicroCategories subCategory={subCategory} microCategory={microCategory} setMicroCategory={setMicroCategory} /> :
                            bottomModal === 'payment' &&
                            null
          }
        </BottomSheets>
        <Toast config={toastConfig} />
      </View>
    </ListingMainContext.Provider>
  );
};

export default ListingMain;