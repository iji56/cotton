import { FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedHeader from '../../components/FeedHeader';
import { getUserListings } from '@/features/profile/api/getUserListings';
import { getUserFollows } from '@/features/profile/api/getUserFollows';
import { useEffect, useRef, useState } from 'react';
import { UserListingRow } from '@/features/profile/types/userListings';
import { UserFollowRow } from '@/features/profile/types/userFollows';
import ProfileBio from '@/features/profile/components/ProfileBio';
import PostList from '@/features/profile/components/PostList';
import { reduxSelect } from '@/types/reduxHooks';
import Loader from '@/features/feed/components/Loader';
import { useIsFocused } from '@react-navigation/native';
import { getUsermeta } from '@/features/auth/api/getUsermeta';
import IconButton from '@/components/elements/Button/IconButton';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import BottomSheets from '@/components/elements/BottomSheet';
import { reportLists } from '@/features/profile/utils/keywords';
import { SFP } from './FeedProfile.styles';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import Button from '@/components/elements/Button/Button';
import TextField from '@/components/elements/Forms/TextField';
import { palette } from '@/components/styles/theme';
import { keywords } from '../../utils/keywords';
import { placeholderPicture } from '@/features/borrow/utils/staticTexts';
import { errorToast, successToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { reportListing } from '../../api/reportListing';
import { reportUser } from '../../api/reportUser';
import { unblockUser } from '../../api/unblockUser';
import { blockUser } from '../../api/blockUser';

const FeedProfile = ({ route }: { route: { params: { userID: string } } }) => {
  const { userID } = route.params;
  const [userListings, setUserListings] = useState<UserListingRow[] | []>([]);
  const [userFollows, setUserFollows] = useState<UserFollowRow[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const isFocused = useIsFocused();
  const [profileData, setProfileData] = useState({
    user_id: userID,
    user_name: '',
    first_name: '',
    user_picture: '',
    city: '',
    bio: '',
    itemCount: userListings.length,
    followerCount: userFollows.length,
  });
  const insets = useSafeAreaInsets();
  const currentUser = reduxSelect(state => state.usermeta.id);
  const [blocked, setBlocked] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedReportText, setSelectedReportText] = useState('');
  const [snapPoint, setSnapPoint] = useState<number | string>(1);
  const [selectedItem, setSelectedItem] = useState<UserListingRow | null>(null)
  const ref = useRef<any>();

  const getProfile = async () => {
    setRefreshing(true);
    try {
      let listings = await getUserListings(userID);
      let follows = await getUserFollows(userID);
      const userDetail = await getUsermeta(userID);
      if (listings) setUserListings(listings);
      if (follows) setUserFollows(follows);
      if (userDetail) {
        setProfileData(prevProfileData => ({
          ...prevProfileData,
          user_name: userDetail.user_name || '',
          first_name: userDetail.first_name || '',
          user_picture: userDetail?.profile_image_url || '',
          city: userDetail.city || 'ON',
          bio: userDetail.bio || '',
          itemCount: userListings.length,
          followerCount: userFollows.length,
          blocked: blocked
        }));
      }
    } catch (error) {
      console.log('Error getting user details : ', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [isFocused, blocked]);

  useEffect(() => {
    setProfileData(prevProfileData => ({
      ...prevProfileData,
      itemCount: userListings.length,
      followerCount: userFollows.length,
    }));
  }, [userListings, userFollows]);

  const onRefresh = () => {
    getProfile();
  };

  const handleEllipse = (item: any) => {
    console.log("Selected listing : ", item, item?.listing_id, item?.user_id)
    setSelectedItem(item)
    handleBottomSheet('70%');
  }

  const handleReport = async () => {
    handleBottomSheet('80%')
    let resposnse = selectedItem ?
      await reportListing(currentUser!, selectedItem?.listing_id!, selectedItem?.user_id!, selectedReport, selectedReportText) :
      await reportUser();
    if (resposnse?.startsWith('Error')) {
      errorToast(resposnse)
    } else {
      setUserListings(userListings => userListings.filter(item => item.listing_id !== selectedItem?.listing_id))
      successToast(keywords.reportMessage)
    }
  }

  const handleBottomSheet = (number?: string) => {
    setSelectedItem(null)
    setSnapPoint(number || '25%')
    ref.current?.snapToIndex(1)
  }

  const handleReportUser = () => {
    handleBottomSheet("70%")
  }

  const handleRestriction = () => {
    if (restricted) {
      successToast(keywords.restrictMessage);
    } else {
      successToast(keywords.unrestrictMessage)
    }
    handleBottomSheet("1%")
    setRestricted(!restricted)
  }
  const handleBlockUser = () => {
    handleBottomSheet("65%")
  }

  const handleSelectReport = (value: string) => {
    setSelectedReport(value)
  }

  const handleBlock = async () => {

    if (blocked) {
      const response = await unblockUser();
      if (response?.startsWith("Error")) {
        errorToast(response)
      } else {
        successToast(`${profileData.user_name}${keywords.blockMessage}`)
      }
    } else {
      const response = await blockUser(profileData.user_id, currentUser!);
      if (response?.startsWith("Error")) {
        errorToast(response)
      } else {
        successToast(`${profileData.user_name}${keywords.unblockMessage}`)
      }
    }
    setBlocked(!blocked)
    handleBottomSheet('1%')
  }

  const handleBlockAndReport = () => {
    // call block and report api
    setBlocked(true)
    handleBottomSheet('1%')
    successToast(`${profileData.user_name}${keywords.blockMessage}`)

    setTimeout(() => {
      successToast(keywords.reportMessage);
    }, 3000)
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: '#fff',
      }}>
      {refreshing ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Loader />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          <FeedHeader headerType='profile' handleEllipe={handleBottomSheet} />
          <ProfileBio
            usermeta={profileData}
            isPublicProfile={currentUser === userID ? false : true}
            handleBlock={handleBlock}
          />
          <PostList userListings={userListings} handleEllipse={handleEllipse} />
        </ScrollView>
      )}
      <BottomSheets snapPoint={snapPoint} setSnapPoint={setSnapPoint} bottomSheetRef={ref} handleSheetChanges={(index: number) => { }}>
        {snapPoint === '25%' ? (
          <View >
            <TouchableOpacity style={SFP.button} onPress={handleRestriction}>
              <Text style={SFP.buttonText}>{restricted ? keywords.unrestrict : keywords.restrict}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={SFP.button} onPress={handleBlockUser}>
              <Text style={SFP.buttonText}>{blocked ? keywords.unblock : keywords.block}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[SFP.button, { borderBottomWidth: 0 }]} onPress={handleReportUser}>
              <Text style={SFP.buttonText}>{keywords.report}</Text>
            </TouchableOpacity>
          </View>
        ) :
          snapPoint === '70%' ?
            <FlatList
              data={reportLists}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={<Text style={SFP.heading}>{keywords.reasonToReportAccount}</Text>}
              renderItem={({ item, index }) => (
                <TouchableOpacity key={index} style={[SFP.item, { borderTopWidth: index === 0 ? .3 : 0 }]} onPress={() => handleSelectReport(item.value)}>
                  <Checkbox label='' isChecked={selectedReport === item.value} onClick={() => handleSelectReport(item.value)} borderRadius={20} />
                  <Text style={SFP.itemText}>{item?.label}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <>
                  {selectedReport === "Other" && (
                    <TextField value={selectedReportText} onChangeText={setSelectedReportText} placeholder={keywords.reasonPlaceholder} multiline style={SFP.input} />
                  )}
                  <View style={SFP.bottomButton}>
                    <Button text={keywords.submit} onPress={handleReport} variant='main' />
                  </View>
                </>
              }
            />
            : snapPoint === '65%' ? (
              <View style={SFP.blockContainer}>
                <Image source={{ uri: profileData?.user_picture || placeholderPicture }} style={SFP.image} />
                <Text style={[SFP.heading, { textAlign: 'center' }]}>{keywords.block} {profileData?.user_name}?</Text>
                <Text style={SFP.label}>{keywords.theyWouldNotAbleToSendMessage}</Text>
                <Text style={SFP.label}>{keywords.theirListingWontShow}</Text>
                <Text style={SFP.label}>{keywords.youCanUnblock}</Text>
                <Text style={[SFP.label, { fontWeight: '600' }]}>{keywords.settingsBlockedAccounts}</Text>
                <View style={SFP.bottomButton}>
                  <Button text={blocked ? keywords.unblock : keywords.block} onPress={handleBlock} variant='main' />
                </View>
                <View style={[SFP.bottomButton, { marginTop: -5 }]}>
                  <Button text={keywords.blockAndReport} onPress={handleBlockAndReport} variant='secondary' style={{ borderWidth: 0 }} buttonTextColor={palette.red} />
                </View>
              </View>
            ) : (
              <View style={SFP.blockContainer}>
                <Text style={SFP.heading}>{keywords.thanksWeReceivedYourReport}</Text>
                <View style={SFP.blockBody}>
                  <Text style={SFP.heading}>{keywords.youCanBlock} {profileData?.user_name}</Text>
                  <Image source={{ uri: profileData?.user_picture || placeholderPicture }} style={SFP.image} />
                  <Text style={[SFP.heading, { textAlign: 'center' }]}>{keywords.block} {profileData?.user_name}?</Text>
                  <Text style={SFP.label}>{keywords.theyWouldNotAbleToSendMessage}</Text>
                  <Text style={SFP.label}>{keywords.theirListingWontShow}</Text>
                  <Text style={SFP.label}>{keywords.youCanUnblock}</Text>
                  <Text style={[SFP.label, { fontWeight: '600' }]}>{keywords.settingsBlockedAccounts}</Text>
                  <View style={SFP.bottomButton}>
                    <Button text={blocked ? keywords.unblock : keywords.block} onPress={handleBlock} variant='main' />
                  </View>
                </View>
              </View>
            )
        }
      </BottomSheets>
      <Toast config={toastConfig} />
    </View>
  );
};

export default FeedProfile;
