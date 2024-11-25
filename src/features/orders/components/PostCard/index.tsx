import { Text, TouchableOpacity, View } from 'react-native';
// import H2 from '@/components/elements/H2';
import H2 from '@/components/elements/H2';
import ImageWrapper from '@/components/elements/FeedImageWrapper';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@/components/elements/Avatar';
import { ListingItem } from '@/features/feed/types/supabaseListings';
import { PCS } from './PostCard.styles';
import { useNavigation } from '@react-navigation/native';
import { FeedNavigation } from '@/features/feed/types/feedNav';
import { dollarConversion } from '@/utils/dollarConversion';
import { palette } from '@/components/styles/theme';
import { imageBaseUrl } from '@/utils/createStorageURL';

/**
 * TODO: Add favourite functionality
 * TODO: Extend button functionality to FeedItem title
 * TODO: Add navigation functionality on user_name
 * TODO: fix ts types
 *
 * Notes
 * -> for favourites, save to redux store
 */
const PostCard = ({ listing }: { listing: ListingItem }) => {
  const navigation = useNavigation<FeedNavigation>();
  const originalPrice = dollarConversion({
    amount: listing.price_original,
    direction: 'toDollars',
    formatted: true,
  })

  const borrowPrice = dollarConversion({
    amount: listing.price_borrow,
    direction: 'toDollars',
    formatted: true,
  })
// console.log(listing)
  const itemData = {
    name: listing.listing_name,
    type: listing.brand ?? 'type',
    image: listing?.image_url?  `${imageBaseUrl}${listing?.image_url}` : 'https://placecage.vercel.app/placecage/g/200/300',
    size: listing.size ?? 'size',
    priceOriginal: originalPrice ?? 0,
    priceBorrow: borrowPrice ?? 0,
  }

  const handleFavourite = () => {
    // handle 
  }

  return (
    <TouchableOpacity
      style={PCS.container}
      onPress={() =>
        navigation.navigate('BorrowNav', {
          screen: 'BorrowMain',
          params: { listingData: listing }
        })
      }
    >
      <ImageWrapper
        image={itemData.image}
        iconBtn={faHeart}
        color={palette.black}
        onPress={() => handleFavourite()}
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
          <Text style={PCS.originalPrice}>
            Rent from {itemData.priceBorrow}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
