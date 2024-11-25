import { Text, TouchableOpacity, View } from 'react-native';
import SFeedItem from '@/features/feed/components/FeedItem/FeedItem.styles';
import H2 from '@/components/elements/H2';
import ImageWrapper from '@/components/elements/FeedImageWrapper';
import { faEllipsisV, faHeart } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@/components/elements/Avatar';
import { ListingItem } from '@/features/feed/types/supabaseListings';
import { useNavigation } from '@react-navigation/native';
import { FeedNavigation } from '@/features/feed/types/feedNav';
import { dollarConversion } from '@/utils/dollarConversion';
import { reduxDispatch, reduxSelect } from '@/types/reduxHooks';
import { useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { usermetaError } from '@/store/actions/usermetaActions';
import { favouriteList } from '../../api/favouriteItem';
import { unfavouriteList } from '../../api/unFavouriteItem';
import { imageBaseUrl } from '@/utils/createStorageURL';
import { baseUrl } from '@/features/auth/api/authSignUp';
import { imagePlaceHolder } from '../../utils/keywords';
import { FeedMainContext } from '../../context/FeedMainContext';
import { getImageSrc } from '@/utils/renderItemsForTesting';
import Video from 'react-native-video';

export type handleEllipse = {
  handleEllipse: () => void;
}

export type FeedItemProps = {
  item: ListingItem & handleEllipse;
  index: number;
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: object) => void;
  };
};

const FeedItem = ({ item, index, separators }: FeedItemProps) => {
  const navigation = useNavigation<FeedNavigation>();
  const { setLastIndex } = useContext(FeedMainContext);
  const dispatch = reduxDispatch();
  const userData = reduxSelect(state => state.usermeta.id);
  const currentFavourite =
    reduxSelect(state => state.usermeta.favourites) || [];
  const [iconColor, setIconColor] = useState('black');

  useEffect(() => {
    const checkFavourite = async () => {
      try {
        let { data, error } = await supabase
          .from('listings_favourite')
          .select('listing_id, user_id')
          .eq('user_id', userData)
          .eq('listing_id', item.id);

        if (error) {
          throw error;
        }
        setIconColor(data && data.length > 0 ? 'red' : 'black');
      } catch (error) {
        console.error('Error checking favourite status:', error);
      }
    };

    checkFavourite();
  }, [currentFavourite, userData, item.id]);

  const handleFavourite = async (userData: string | null) => {
    try {
      let { data, error } = await supabase
        .from('listings_favourite')
        .select('listing_id, user_id')
        .eq('user_id', userData)
        .eq('listing_id', item.id);

      if (error) {
        throw error;
      }

      let updatedfavourites = [];
      if (data && data.length > 0) {
        await unfavouriteList(userData!, itemData.id);
        setIconColor('black');
      } else {
        await favouriteList(userData!, itemData.id);
        setIconColor('red');
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(usermetaError({ message: error.message }));
      }
    }
  };

  const originalPrice = dollarConversion({
    amount: item.price_original,
    direction: 'toDollars',
    formatted: true,
  });

  const borrowPrice = dollarConversion({
    amount: item.price_borrow,
    direction: 'toDollars',
    formatted: true,
  });

  // console.log(item)

  const itemData = {
    id: item.id ?? 0,
    userID: item.user_id ?? '',
    username: item.user_name ?? item.email ?? 'user',
    userCity: item.city ?? 'city',
    userAvatar: item.user_profile_image
      ? item.user_profile_image.startsWith('https')
        ? item.user_profile_image
        : `${baseUrl}${item.user_profile_image}`
      : imagePlaceHolder,
    name: item.listing_name,
    type: item.brand ?? 'type',
    image: item.listing_image_url
      ? getImageSrc(
        item.listing_name,
        item.listing_image_url.endsWith('.mp4')
          ? item.thumbnail_url
          : item.listing_image_url,
      )
      : imagePlaceHolder,
    size: item.size ?? 'size',
    priceOriginal: originalPrice ?? 0,
    priceBorrow: borrowPrice ?? 0,
    handleEllipse: item?.handleEllipse
  };


  return (
    <TouchableOpacity
      style={SFeedItem.container}
      onPress={() => {
        setLastIndex(1);
        navigation.navigate('BorrowNav', {
          screen: 'BorrowMain',
          params: { listingData: item },
        });
      }}>
      <TouchableOpacity
        style={SFeedItem.head}
        onPress={() =>
          navigation.navigate('FeedProfile', { userID: item.user_id })
        }>
        <Avatar size="s" avatar={itemData.userAvatar} />
        <View style={SFeedItem.headLines}>
          <Text style={SFeedItem.userName}>{itemData.username}</Text>
          <Text style={SFeedItem.userLocation}>{itemData.userCity}</Text>
        </View>
      </TouchableOpacity>
      <ImageWrapper
        image={itemData.image}
        iconBtn={faHeart}
        color={iconColor}
        onPress={() => handleFavourite(userData)}
        ellipseIcon={faEllipsisV}
        onEllipsePress={itemData?.handleEllipse}
      />
      <View style={SFeedItem.caption}>
        <View style={SFeedItem.title}>
          <H2 text={itemData.name} />
          {/* <H2 text={'★4.0'} /> */}
        </View>
        <View style={SFeedItem.details}>
          <View style={SFeedItem.category}>
            <Text style={SFeedItem.subTitleDetails}>{itemData.type}</Text>
            <Text style={SFeedItem.subTitleDetails}>|</Text>
            <Text style={SFeedItem.subTitleDetails}>{itemData.size}</Text>
          </View>
          <Text style={SFeedItem.buyPrice}>
            Retail {itemData.priceOriginal}
          </Text>
          <Text style={SFeedItem.originalPrice}>
            Rent from {itemData.priceBorrow}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeedItem;
