import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedHeader from '@/features/feed/components/FeedHeader';
import {
  FilterOptions,
  ListingItem,
} from '@/features/feed/types/supabaseListings';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { FeedMainContext } from '@/features/feed/context/FeedMainContext';
import { getListings } from '../../api/getListings';
import FeedList from '../../components/FeedList';
import FeedFilterModal from '../../components/FeedFilterModal';
import { getFilteredListings } from '../../api/getFilteredListing';
import { reduxSelect } from '@/types/reduxHooks';

const FeedMain = () => {
  const user = reduxSelect(state => state.usermeta);
  const [listingData, setListingData] = useState<ListingItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [showModalFilter, setShowFilterModal] = useState(false);
  const insets = useSafeAreaInsets();
  const [lastIndex, setLastIndex] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (page === 1 || selectedFilters.length > 0) {
          setListingData([]);
          setRefreshing(true);
        }
        setPage(1);
        console.log(
          'selectedFilters: ',
          selectedFilters.flat().length,
          selectedFilters.flat()[0],
          ' ' + selectedFilters,
        );
        if (
          selectedFilters.flat().length === 1 &&
          selectedFilters.flat()[0] === ''
        ) {
          setSelectedFilters([]);
        }
        const data =
          selectedFilters.flat().length === 0 ||
          (selectedFilters.flat().length === 1 &&
            selectedFilters.flat()[0] === '')
            ? await getListings(user.id!)
            : await getFilteredListings(['', ...selectedFilters], user.id!);
        setListingData(data?.clothes ? data?.clothes : data || []);
        setRefreshing(false);
      } catch (error: any) {
        setListingData([]);
        setError(error.message || 'An error occurred while fetching listings');
        setRefreshing(false);
      }
    };

    !lastIndex && isFocused && fetchData();
  }, [selectedFilters, page, isFocused && user?.id]);

  useEffect(() => {
    if (lastIndex && isFocused) {
      setLastIndex(0);
    }
  }, [isFocused]);

  const handleFilter = () => {
    setShowFilterModal(!showModalFilter);
  };

  const handleApply = async ({
    color,
    brand,
    distance,
    check,
    size,
    type,
    microCategories,
  }: FilterOptions) => {
    // if user does not apply filter with distance then save it as an empty string value
    if (distance === 0) {
      setSelectedFilters([type, brand, color, size, '']);
    } else {
      setSelectedFilters([
        type,
        brand,
        color,
        size,
        parseFloat(distance?.toPrecision(2)),
      ]);
    }

    const data = await getFilteredListings(['', ...selectedFilters], user.id!);
    setListingData(data?.clothes ? data?.clothes : data || []);
  };

  return (
    <FeedMainContext.Provider
      value={{
        listingData,
        selectedFilters,
        page,
        refreshing,
        error,
        lastIndex,
        setListingData,
        setSelectedFilters,
        setPage,
        setRefreshing,
        setError,
        setLastIndex,
      }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: '#fff',
        }}>
        <FeedHeader headerType="main" />
        <FeedList handleFilter={handleFilter} />
      </View>
      <FeedFilterModal
        visible={showModalFilter}
        toggleVisible={setShowFilterModal}
        handleApply={handleApply}
      />
    </FeedMainContext.Provider>
  );
};

export default FeedMain;
