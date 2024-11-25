import { theme } from "@/components/styles/theme";
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LTS from "./ListingTags.styles";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import ListingHeader from "../../components/ListingHeader";
import ListingTagsForm from "../../components/ListingTagsForm";
import { useEffect, useState } from "react";
import { ListingTagsContext } from "../../context/ListingTagsContext";
import Slider, { SliderProps } from "@react-native-community/slider";
import Wrapper from "@/components/Wrapper";
import { errorToast, successToast, toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import { reduxSelect } from "@/types/reduxHooks";
import { supabase } from "@/lib/supabase";
import { decode } from 'base64-arraybuffer';
import { createStorageURL } from '@/utils/createStorageURL';
import deleteImage from "../../api/deleteImage";
import deleteListing from "../../api/deleteListing";
import saveListing from "../../api/saveListing";
import saveImages from "../../api/saveImages";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { dollarConversion } from "@/utils/dollarConversion";

type ListingTagsType = {
  route: any;
  props: SliderProps;
}

const ListingTags = ({ route, props }: ListingTagsType) => {
  const user_id = reduxSelect((state) => state.auth.uid)
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [occasion, setoccasion] = useState('');
  const [fit, setFit] = useState(0);
  const [condition, setCondition] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formA = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const imagePaths: string[] = [];
  let listingRow: null | string = null;

  const submitListing = async () => {
    setLoading(true);

    if (!type || !category || !color || !occasion) {
      setLoading(false); // Set loading state to false
      errorToast('please finish selecting the categories below.');
      return;
    }

    const payload = {
      user_id,
      listing_name: formA.name,
      listing_summary: formA.description,
      size: formA.size,
      price_original: dollarConversion({ amount: formA.priceOriginal, direction: "toCents", formatted: false }) as number,
      price_borrow: dollarConversion({ amount: formA.priceBorrow, direction: "toCents", formatted: false }) as number,
      borrow_length: formA.borrowLength,
      type,
      category,
      color,
      occasion,
      fit,
      condition,
      gender: 'female',
    }

    try {
      for (const image of formA.images) {
        const file = image.fileName;
        const base64 = decode(image.base64)

        const { data: imageData, error: imageError } = await supabase
          .storage
          .from('listings')
          .upload(
            file,
            base64,
            {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: false
            }
          )

        if (imageError) throw new Error('there was an issue uploading your images.');
        if (imageData) {
          imagePaths.push(createStorageURL(imageData.path, 'listings'));
        }
      }
      const listingData = await saveListing(payload);
      const listingID = listingData?.id;
      const userID = listingData?.user_id;

      listingRow = listingID;
      await saveImages({ listingID, userID, imagePaths });
      successToast('your listing has been uploaded.');

      setTimeout(() => {
        navigation.navigate('Feed', { scren: 'FeedMain' });
      }, 3000);

    } catch (error) {
      if (imagePaths.length > 0) for (const imagePath of imagePaths) deleteImage(imagePath)
      if (listingRow) deleteListing(listingRow);
      errorToast((error as Error).message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (error) errorToast(error);
  }, [error])

  return (
    <ListingTagsContext.Provider
      value={{
        type,
        category,
        color,
        occasion,
        fit,
        condition,
        error,
        setType,
        setCategory,
        setColor,
        setoccasion,
        setFit,
        setCondition,
        setError
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: theme.colors.background,
        }}
      >
        <ListingHeader title='a few more details...' />
        <ListingTagsForm />
        <View style={LTS.slidersContainer}>
          <View style={LTS.sliderContainer}>
            <Wrapper>
              <Text style={LTS.sliderTitle}>How does it fit?</Text>
              <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                style={LTS.slider}
                {...props}
                value={fit}
                onValueChange={(fit) => setFit(fit)}
                thumbTintColor={pageViewPositionSlider.thumbColor}
                maximumTrackTintColor={pageViewPositionSlider.trackColor}
                minimumTrackTintColor={pageViewPositionSlider.trackColor}
              />
              <View style={LTS.sliderLabelContainer}>
                <Text style={LTS.sliderLabel}>very tight</Text>
                <Text style={LTS.sliderLabelMiddle}>perfect</Text>
                <Text style={LTS.sliderLabelRight}>very loose</Text>
              </View>
            </Wrapper>
          </View>

          <View style={LTS.sliderContainer}>
            <Wrapper>
              <Text style={LTS.sliderTitle}>How's the quality?</Text>
              <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                style={LTS.slider}
                {...props}
                value={condition}
                onValueChange={(condition) => setCondition(condition)}
                thumbTintColor={pageViewPositionSlider.thumbColor}
                maximumTrackTintColor={pageViewPositionSlider.trackColor}
                minimumTrackTintColor={pageViewPositionSlider.trackColor}
              />
              <View style={LTS.sliderLabelContainer}>
                <Text style={LTS.sliderLabel}>good</Text>
                <Text style={LTS.sliderLabelMiddle}>great</Text>
                <Text style={LTS.sliderLabelRight}>brand new</Text>
              </View>
            </Wrapper>
          </View>
        </View>

        <Wrapper>
          <View style={LTS.submissionContainer}>
            <Text style={LTS.submissionBody}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate dolore iusto omnis nihil sit minima explicabo maiores enim? Perspiciatis, rem.</Text>
            <View style={LTS.submissionButtonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingsNav', { screen: 'SettingsFAQs' })}
                style={LTS.buttonLink}
              >
                <Text style={LTS.buttonLinkText}>FAQs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => submitListing()}
                style={LTS.buttonInput}
              >
                <Text style={LTS.buttonInputContent}>create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Wrapper>
        <Toast config={toastConfig} />
      </View>
      {loading ? (
        <View style={LTS.load}><Text style={LTS.loadText}>Loading...</Text></View>
      ) : null}
    </ListingTagsContext.Provider>
  )
}

const pageViewPositionSlider = {
  trackColor: 'grey',
  thumbColor: theme.colors.secondary,
};

export default ListingTags;