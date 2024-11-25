import { Text, View, FlatList } from 'react-native';
import React, { useContext } from 'react';
import Wrapper from '@/components/Wrapper';
import { ProfileContext } from '../../context/ProfileContext';
import PostCard from '../PostCard';
import { PLS } from './PostList.styles';
import { UserListingRow } from '@/features/profile/types/userListings.ts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';


type Props = {
  userListings: UserListingRow[];
  handleEllipse?: (item: any) => void
};

const PostList = ({ userListings, handleEllipse }: Props) => {
  const { setRefreshing } = useContext(ProfileContext);
  // Function to handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true to indicate loading
  };
  console.log(handleEllipse, " k")

  return (
    <Wrapper>
      <View style={PLS.container}>
        {userListings?.length > 0 ? (
          <FlatList
            data={userListings}
            renderItem={({ item }) => (
              <View style={PLS.columnItem}>
                <PostCard listing={{ ...item, handleEllipse: () => handleEllipse ? handleEllipse(item) : undefined }} />
              </View>
            )}
            initialNumToRender={20}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1}
            numColumns={2}
          />
        ) : (
          <View style={PLS.emptyContainer}>
            <View style={PLS.iconContainer}>
              <FontAwesomeIcon
                style={{
                  color: '#B2C1D1',
                }}
                icon={faShirt}
                size={70}
              />
            </View>
            <Text style={PLS.warningText}>No listings yet</Text>
          </View>
        )}

      </View>
    </Wrapper>
  );
};

export default PostList;
