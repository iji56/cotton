import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme } from '@/components/styles/theme';
import { useEffect, useRef, useState } from 'react';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileBio, { UsermetaType } from '../../components/ProfileBio';
import { getUserFollows } from '../../api/getUserFollows';
import { reduxSelect } from '@/types/reduxHooks';
import { getUserListings } from '../../api/getUserListings';
import { ProfileContext } from '../../context/ProfileContext';
import EditBioModal from '../../components/EditBioModal';
import { UserListingRow } from '../../types/userListings';
import { UserFollowRow } from '../../types/userFollows';
import PostList from '../../components/PostList';
import Loader from '@/features/feed/components/Loader';
import { useIsFocused } from '@react-navigation/native';

import { imagePlaceHolder } from '@/features/feed/utils/keywords';

type ProfileMainProps = {
  isPublicProfile: boolean;
  userID?: string;
};

const ProfileMain = ({ isPublicProfile = false, userID }: ProfileMainProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userListings, setUserListings] = useState<UserListingRow[] | []>([]);
  const [userFollows, setUserFollows] = useState<UserFollowRow[]>([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const user = reduxSelect(state => state.usermeta);
  const usermeta: UsermetaType = {
    user_id: userID && isPublicProfile ? userID : user.id!,
    user_name: user.user_name!,
    first_name: user.first_name!,
    user_picture: user.user_picture || imagePlaceHolder,
    city: user.city!,
    bio: user.bio!,
    itemCount: userListings.length ?? 0,
    followerCount: userFollows.length ?? 0
  };

  const getProfile = async () => {
    setRefreshing(true)
    try {
      let listings = await getUserListings(usermeta.user_id);
      // console.log("user listings : ", listings)
      let follows = await getUserFollows(usermeta.user_id);

      if (listings) setUserListings(listings);
      if (follows) setUserFollows(follows);

    } catch (error) {
      setError((error as Error).message);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [isFocused, modalVisible])
  console.log(" 1profile userListings", JSON.stringify(userListings))
  return (
    <ProfileContext.Provider
      value={{
        modalVisible,
        userListings,
        userFollows,
        page,
        refreshing,
        setModalVisible,
        setUserListings,
        setUserFollows,
        setPage,
        setRefreshing,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: palette.white
        }}>
        {refreshing ?
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Loader />
          </View>
          :
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getProfile} />
            }
            showsVerticalScrollIndicator={false}
          >
            <ProfileHeader />
            <ProfileBio usermeta={usermeta} isPublicProfile={false} />
            <PostList userListings={userListings} />
          </ScrollView>
        }
        {modalVisible && <EditBioModal />}

      </View>
    </ProfileContext.Provider>
  );
};

export default ProfileMain;
