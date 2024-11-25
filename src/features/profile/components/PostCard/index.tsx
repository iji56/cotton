import { Text, TouchableOpacity, View } from 'react-native';
import H2 from '@/components/elements/H2';
import ImageWrapper from '@/components/elements/FeedImageWrapper';
import { faEllipsisV, faHeart } from '@fortawesome/free-solid-svg-icons';
import { ListingItem } from '@/features/feed/types/supabaseListings';
import { PCS } from './PostCard.styles';
import { useNavigation } from '@react-navigation/native';
import { FeedNavigation } from '@/features/feed/types/feedNav';
import { dollarConversion } from '@/utils/dollarConversion';
import { keywords } from '../../utils/keywords';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { reduxDispatch, reduxSelect } from '@/types/reduxHooks';
import { unfavouriteList } from '@/features/feed/api/unFavouriteItem';
import { favouriteList } from '@/features/feed/api/favouriteItem';
import { usermetaError } from '@/store/actions/usermetaActions';
import { findImageUrl, getImageSrc } from '@/utils/renderItemsForTesting';
import { handleEllipse } from '@/features/feed/components/FeedItem';


const PostCard = ({ listing }: { listing: ListingItem & handleEllipse }) => {
  const navigation = useNavigation<FeedNavigation>();
  const [iconColor, setIconColor] = useState('black');
  const dispatch = reduxDispatch();
  const userData = reduxSelect(state => state.usermeta.id);

  const currentFavourite =
    reduxSelect(state => state.usermeta.favourites) || [];
  useEffect(() => {
    const checkFavourite = async () => {
      try {
        let { data, error } = await supabase
          .from('listings_favourite')
          .select('listing_id, user_id')
          .eq('user_id', userData)
          .eq('listing_id', listing?.listing_id);

        if (error) {
          throw error;
        }
        setIconColor(data && data.length > 0 ? 'red' : 'black');
      } catch (error) {
        console.error('Error checking favourite status:', error);
      }
    };

    checkFavourite();
  }, [currentFavourite, userData, listing?.listing_id]);

  const handleFavourite = async () => {
    try {
      let { data, error } = await supabase
        .from('listings_favourite')
        .select('listing_id, user_id')
        .eq('user_id', userData)
        .eq('listing_id', listing?.listing_id);

      if (error) {
        throw error;
      }

      let updatedfavourites = [];
      if (data && data.length > 0) {
        await unfavouriteList(userData!, listing?.listing_id);
        setIconColor('black');
      } else {
        await favouriteList(userData!, listing?.listing_id);
        setIconColor('red');
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(usermetaError({ message: error.message }));
      }
    }
  };

  const originalPrice = dollarConversion({
    amount: listing.price_original,
    direction: 'toDollars',
    formatted: true,
  });

  const borrowPrice = dollarConversion({
    amount: listing.price_borrow,
    direction: 'toDollars',
    formatted: true,
  });

  const itemData = {
    name: listing.listing_name,
    type: listing.brand ?? 'type',
    image:
      listing.images?.length > 0
        ? getImageSrc(
          listing.listing_name,
          findImageUrl(listing.images)?.image_url ??
          listing.images[0].thumbnail_url,
        )
        : 'https://placecage.vercel.app/placecage/g/200/300',
    size: listing.size ?? 'size',
    priceOriginal: originalPrice ?? 0,
    priceBorrow: borrowPrice ?? 0,
    soled:
      listing.listing_purchased_status === keywords.inProgress ||
      listing.listing_purchased_status === keywords.completed,
    handleEllipse: listing?.handleEllipse
  };
  if (
    listing.listing_name == 'Jean & jacket' ||
    listing.listing_name == 'Lucia metallic mini'
  ) {
    console.log('itemData.image', itemData.image);
  }

  return (
    <TouchableOpacity
      style={PCS.container}
      onPress={() => {
        itemData.soled
          ? {}
          : navigation.navigate('BorrowNav', {
            screen: 'BorrowMain',
            params: {
              listingData: { ...listing, id: listing?.listing_id },
              backNav: 'FeedProfile',
              backNavPayload: { userID: listing.user_id },
            },
          });
      }}>
      <ImageWrapper
        image={itemData.image}
        iconBtn={itemData.soled ? keywords.sold : faHeart}
        ellipseIcon={faEllipsisV}
        onEllipsePress={itemData?.handleEllipse}
        onPress={() => {
          itemData.soled ? {} : handleFavourite();
        }}
        color={iconColor}
      />


      <View style={PCS.caption}>
        <View style={PCS.title}>
          <H2 text={itemData.name} />
          {/* <H2 text={'★4.0'} /> */}
        </View>
        <View style={PCS.details}>
          <View style={PCS.category}>
            <Text style={PCS.subTitleDetails}>{itemData.type}</Text>
            <Text style={PCS.subTitleDetails}>|</Text>
            <Text style={PCS.subTitleDetails}>{itemData.size}</Text>
          </View>
          <Text style={PCS.buyPrice}>Retail {itemData.priceOriginal}</Text>
          <Text style={PCS.originalPrice}>
            Rent from {itemData.priceBorrow}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
