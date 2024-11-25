import { View, Text, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import SettingsHeader from '../../components/SettingsHeader';
import Button from '@/components/elements/Button/Button';
import { SBA } from './BlockedAccounts.styles';
import { dummyData, keywords } from '../../utils/keywords';
import { fetchBlockedUsers } from '../../api/getBlockedUsers';
import { reduxSelect } from '@/types/reduxHooks';
import { baseUrl } from '@/features/auth/api/authSignUp';
import { unblockUser } from '@/features/feed/api/unblockUser';
import { errorToast, successToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { placeholderPicture } from '@/features/borrow/utils/staticTexts';

const BlockedAccounts = () => {
  const insets = useSafeAreaInsets();
  const { id } = reduxSelect(state => state.usermeta);
  const [blockedUsers, setBlockedUsers] = useState();

  useEffect(() => {
    getBlockedUser();
  }, []);

  const getBlockedUser = async () => {
    const users = await fetchBlockedUsers(id!);
    console.log('Blocked users : ', users);
    users && setBlockedUsers(users);
  };

  const handleUnblockUser = async (userId: string) => {
    let response = await unblockUser(id!, userId);
    if (response?.startsWith('Error')) {
      errorToast(response);
    } else {
      successToast(response);
    }
    getBlockedUser();
  };

  const renderUser = ({ item }: any) => (
    <View style={SBA.item}>
      <Image
        source={{
          uri: item?.profile_image_url
            ? `${baseUrl}${item.profile_image_url}`
            : placeholderPicture,
        }}
        style={SBA.image}
      />
      <Text style={SBA.text}>
        {item?.user_name}
        {'\n'}
        <Text style={SBA.detailText}>
          {item?.city}
          {item?.state}
          {'\n'}
          {item?.total_listings} item
        </Text>
      </Text>
      <View style={SBA.button}>
        <Button
          text={keywords.unblock}
          onPress={() => handleUnblockUser(item?.blocked_id)}
          variant="main"
          fontSize={14}
        />
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white,
      }}>
      <SettingsHeader
        headerTitle={keywords.blockedAccounts}
        headerType={'main'}
      />
      <FlatList
        data={blockedUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
      />
      <Toast config={toastConfig} />
    </View>
  );
};

export default BlockedAccounts;
