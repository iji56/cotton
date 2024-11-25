import { Text, TouchableOpacity, View } from 'react-native';
import SFeedItem from '@/features/feed/components/FeedItem/FeedItem.styles';
import H2 from '@/components/elements/H2';
import ImageWrapper from '@/components/elements/FeedImageWrapper';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@/components/elements/Avatar';
import { ListingItem } from '@/features/feed/types/supabaseListings';
import { useState } from 'react';
import { reduxDispatch, reduxSelect } from '@/types/reduxHooks';
import { usermetaError } from '@/store/actions/usermetaActions';
import React from 'react';
import { unfavouriteList } from '@/features/feed/api/unFavouriteItem';
import { imageBaseUrl } from '@/utils/createStorageURL';
import { useNavigation } from '@react-navigation/native';
import { FeedNavigation } from '@/features/feed/types/feedNav';

const FavouriteFeedItem = ({ itemData, unfavouriteItem }: { itemData: ListingItem, unfavouriteItem: (id: string) => void }) => {
  const navigation = useNavigation<FeedNavigation>();
  const dispatch = reduxDispatch();
  const userData = reduxSelect(state => state.usermeta.id);
  const [iconColor, setIconColor] = useState('red');
  const handleFavourite = async (userData: string | null) => {
    try {
      await unfavouriteList(userData!, itemData.listing_id)

      unfavouriteItem(itemData.listing_id) // call parent unfavorite function to remove item
      setIconColor('black');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(usermetaError({ message: error.message }));
      }
    }
  };
  // console.log(itemData)

  return (
    <TouchableOpacity
      style={SFeedItem.container}
      onPress={() =>
        navigation.navigate('BorrowNav', {
          screen: 'BorrowMain',
          params: { listingData: { ...itemData, id: itemData.listing_id } }
        })
      }
    >
      <TouchableOpacity
        style={SFeedItem.head}
        onPress={() =>
          navigation.navigate('FeedProfile', { userID: itemData.user_id })
        }
      ><Avatar
          size="s"
          avatar={
            itemData.user_profile_image ??
            'https://placecage.vercel.app/placecage/g/200/300'
          }
        />
        <View style={SFeedItem.headLines}>
          <Text style={SFeedItem.userName}>{itemData.user_name}</Text>
          <Text style={SFeedItem.userLocation}>{itemData.city}</Text>
        </View>
      </TouchableOpacity>
      <View>
        <ImageWrapper
          image={itemData?.listing_image_url ? `${imageBaseUrl}${itemData.listing_image_url}` : 'https://placecage.vercel.app/placecage/g/200/300'}
          iconBtn={faHeart}
          color={iconColor}
          onPress={() => handleFavourite(userData)}
        />
      </View>
      <View style={SFeedItem.caption}>
        <View style={SFeedItem.title}>
          <H2 text={itemData.listing_name} />
        </View>
        <View style={SFeedItem.details}>
          <View style={SFeedItem.category}>
            <Text style={SFeedItem.subTitleDetails}>{itemData.brand}</Text>
            <Text style={SFeedItem.subTitleDetails}>|</Text>
            <Text style={SFeedItem.subTitleDetails}>{itemData.size}</Text>
          </View>
          <Text style={SFeedItem.buyPrice}>
            Retail CA ${itemData.price_original}
          </Text>
          <Text style={SFeedItem.originalPrice}>
            Rent from ${itemData.price_borrow}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FavouriteFeedItem;
