import { FlatList, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import SFavorite from './Favorite.styles';
import FeedHeader from '@/features/feed/components/FeedHeader';
import Wrapper from '@/components/Wrapper';
import { reduxSelect } from '@/types/reduxHooks';
import React, { useEffect, useState } from 'react';
import { ListingItem } from '../../types/supabaseListings';
import { getUserFavouriteListings } from '../../api/favouriteFeed';
import FavouriteFeedItem from '../../components/FeedItem/Favourite';
import { FeedItemProps } from '../../components/FeedItem';
import Loader from '../../components/Loader';

const Favorite = () => {
  const insets = useSafeAreaInsets();
  const uid = reduxSelect(state => state.usermeta.id);
  const [loading, setLoading] = useState(true);
  let [listingData, setListingData] = useState<ListingItem[]>([]);

  const fetchData = async () => {
    const data = await getUserFavouriteListings(uid!);
    if (data) {
      setListingData(data);
    } else {
      setListingData([]);
    }
    setLoading(false);
  };

  // function to remove item from listing data when user unfavourite 
  const unfavouriteItem = (id: string) => {
    const favouriteList = listingData.filter(item => item.listing_id !== id);
    setListingData(favouriteList);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item, index, separators }: FeedItemProps) => {
    return <FavouriteFeedItem itemData={item} key={item.listing_id} unfavouriteItem={unfavouriteItem} />
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white,
      }}>
      <FeedHeader headerType="favorite" />
      <Wrapper>{
        loading ? <Loader /> :
          <View style={SFavorite.container}>
            <FlatList
              keyboardDismissMode='on-drag'
              data={listingData}
              renderItem={renderItem}
              ListEmptyComponent={() => <Text style={SFavorite.warningText}>no listings</Text>}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={() => {
              }}
              onEndReachedThreshold={0.75}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          </View>
      }
      </Wrapper>
    </ScrollView>
  );
};

export default Favorite;
