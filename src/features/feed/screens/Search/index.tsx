import { palette, theme } from '@/components/styles/theme';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedHeader from '../../components/FeedHeader';
import Wrapper from '@/components/Wrapper';
import { FeedMainContext } from '../../context/FeedMainContext';
import { useEffect, useState } from 'react';
import { FilterOptions, ListingItem } from '../../types/supabaseListings';
import { getFilteredListings } from '../../api/getFilteredListing';
import FeedFilterModal from '../../components/FeedFilterModal';
import FeedListView from '../../components/FeedLlistView';
import { reduxSelect } from '@/types/reduxHooks';

const Search: React.FC = () => {
  const user = reduxSelect(state => state.usermeta);
  const [listingData, setListingData] = useState<ListingItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [showModalFilter, setShowFilterModal] = useState(false)
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let timeoutId;
    const fetchData = async () => {
      try {
        setRefreshing(true);
        const data = await getFilteredListings([search, ...selectedFilters,], user.id!);

        setListingData(data || []);

        setRefreshing(false);
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching listings');
        setRefreshing(false);
      }
    };

    // used debouncing technique so that api hit once, when user finishes typing
    timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [search, selectedFilters, page]);

  const handleFilter = () => {
    setShowFilterModal(!showModalFilter)
  }

  const handleApply = async ({ color, brand, distance, check, size, type, microCategories }: FilterOptions) => {
    // if user does not apply filter with distance then save it as an empty string value 
    if (distance === 0) {
      setSelectedFilters([type, brand, color, size, ""])
    } else {
      setSelectedFilters([type, brand, color, size, parseFloat(distance?.toPrecision(2))])
    }

    const data = await getFilteredListings([search, ...selectedFilters], user.id!);
    setListingData(data || []);
  }

  return (
    <FeedMainContext.Provider value={{
      listingData,
      selectedFilters,
      page,
      refreshing,
      error,
      search,
      setListingData,
      setSelectedFilters,
      setPage,
      setRefreshing,
      setError,
      setSearch,
    }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: palette.white
        }}>
        <FeedHeader headerType="search" />
        <Wrapper>
          <FeedListView handleFilter={handleFilter} />
        </Wrapper>
      </View>
      <FeedFilterModal
        visible={showModalFilter}
        toggleVisible={setShowFilterModal}
        handleApply={handleApply}
      />
    </FeedMainContext.Provider>
  );
};

export default Search;
