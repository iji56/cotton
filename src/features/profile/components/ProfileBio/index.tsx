import { useContext, useState, useEffect, useRef } from 'react';
import Wrapper from '@/components/Wrapper';
import Avatar from '@/components/elements/Avatar';
import { reduxSelect } from '@/types/reduxHooks';
import {
  ActivityIndicator,
  Platform,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import H2 from '@/components/elements/H2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import {
  CommonActions,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileContext } from '../../context/ProfileContext';
import { SPB } from './ProfileBio.styles';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/utils/permissions';
import { palette } from '@/components/styles/theme';
import { createChat, createChatAndNavigate } from '../../api/createChat';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import { baseUrl } from '@/features/auth/api/authSignUp';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { successToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';

export type UsermetaType = {
  user_id: string;
  user_name: string;
  first_name: string;
  user_picture: string;
  city: string;
  bio: string;
  itemCount: number;
  followerCount: number;
};

export type ProfileBioProps = {
  isPublicProfile?: boolean;
  usermeta: UsermetaType;
  handleBlock?: () => void;
};

const ProfileBio = ({ isPublicProfile = false, usermeta, handleBlock }: ProfileBioProps) => {
  const [locationWarningVisible, setLocationWarningVisible] = useState(false);
  const { userListings, userFollows, setModalVisible } =
    useContext(ProfileContext);
  const {
    user_id,
    user_name,
    first_name,
    user_picture,
    city,
    bio,
    itemCount,
    followerCount,
    blocked
  } = usermeta;
  const currentUser = reduxSelect(state => state.usermeta.id);
  const userID = user_id;
  const userName = user_name;
  const userFirstName = first_name;
  const userAvatar = user_picture
    ? user_picture?.startsWith('http')
      ? user_picture
      : `${baseUrl}${user_picture}`
    : 'https://hrnylgxecwjrlbnqbodg.supabase.co/storage/v1/object/public/user_profile/defaultpfp.jpeg?t=2024-11-03T21%3A19%3A23.972Z'; //TODO: fix this with user_pciture
  const userCity = city;
  const userBio = bio;
  const userItemCount = itemCount ?? 0;
  const userFollowerCount = followerCount ?? 0;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const intervalIdRef = useRef<any>(null);

  useEffect(() => {
    getUserLocation();
    checkPermission();
  }, []);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      getUserLocation();
      checkPermission();
    }, 1000); // Runs every second

    return () => {
      // Cleanup interval on unmount
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  const checkPermission = async () => {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      if (Platform.OS === 'android') {
        const hasLocationEnabled = await isLocationEnabled();
        setLocationWarningVisible(hasLocationEnabled);
      } else {
        setLocationWarningVisible(true);
      }
    } else {
      setLocationWarningVisible(false);
      stopInterval();
    }
  };

  const stopInterval = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            setLocationWarningVisible(false);
            stopInterval();
            var addressComponents = json.results[0].address_components;

            let cityName = '';
            addressComponents.forEach(component => {
              if (component.types.includes('locality')) {
                cityName = component.long_name;
              }
            });

            setUserLocation(cityName);
          })
          .catch(error => console.warn(error));
      })
      .catch(async error => {
        console.log(error);
      });
  };

  const isProfileOwner = !isPublicProfile;

  const handleOnMessageClick = async () => {
    if (!isPublicProfile) {
      setModalVisible(true);
    } else if (blocked) {
      handleBlock!()
    } else {
      try {
        setIsLoading(true);
        const otherUser = userID;
        await createChatAndNavigate(
          currentUser!,
          otherUser,
          userName,
          navigation,
        );
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        console.error('Error creating or fetching chat room:', error.message);
      }
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out ${userName}'s profile on rax!`,
        url: userAvatar
      });
    } catch (error: any) {
      console.error('Error sharing profile:', error.message);
    }
  };

  return (
    <>
      {!usermeta && <Text>Loading...</Text>}
      <View style={SPB.mainContainer}>
        <Wrapper>
          {isProfileOwner ? (
            <View style={SPB.horizontalContainer}>
              <Avatar avatar={userAvatar} size="m" />

              <View style={SPB.profileContainer}>
                <H2 text={userFirstName} />
                <Text style={SPB.subtitle}>@{userName}</Text>
              </View>
            </View>
          ) : (
            <View style={SPB.verticalContainer}>
              <Avatar avatar={userAvatar} size="m" />

              <View style={{ ...SPB.profileContainer }}>
                <H2 text={userFirstName} />
                <Text style={SPB.subtitle}>{userName}</Text>
              </View>
            </View>
          )}

          {isProfileOwner ? (
            <View>
              <Text style={SPB.profileText}>{userBio}</Text>
              <View style={SPB.highlightsContainer}>
                <View style={SPB.iconContainer}>
                  {(userLocation || userCity) && (
                    <>
                      <FontAwesomeIcon
                        style={SPB.icon}
                        icon={faLocationPin}
                        size={10}
                      />
                      <Text style={SPB.highlight}>
                        {userLocation || userCity}
                      </Text>
                    </>
                  )}
                </View>
                <Text style={SPB.highlight}>
                  {userItemCount
                    ? userItemCount === 1
                      ? `${userItemCount} item`
                      : `${userItemCount} items`
                    : '0 items'}
                </Text>
                {/* <Text style={SPB.highlight}>
                  {userFollowerCount
                    ? userFollowerCount === 1 ? `${userFollowerCount} follower` : `${userFollowerCount} followers`
                    : '0 followers'
                  }
                </Text> */}
              </View>
            </View>
          ) : (
            <View style={SPB.profileInfoContainer}>
              <View
                style={{
                  ...SPB.profilePanelContainer,
                  ...SPB.leftProfilePanelContainer,
                }}>
                <H2 text="Location" />
                <H2 text={`${userCity}`} />
              </View>
              <View style={SPB.profilePanelContainer}>
                <H2 text="No of listing" />
                <H2 text={`${userItemCount}`} />
              </View>
            </View>
          )}

          {isProfileOwner && locationWarningVisible && (
            <View style={SPB.locationWarningContainer}>
              <Text style={SPB.locationWarningText}>
                Allow location permissions for people to find your listings or
                go to Edit profile -{'>'} Location to input your location
                manually{' '}
              </Text>
              <TouchableOpacity
                style={SPB.locationWarningButton}
                onPress={async () => {
                  await requestLocationPermission();
                }}>
                <Text style={SPB.locationWarningButtonText}>allow</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isProfileOwner && (
            <View style={SPB.profileDescription}>
              <Text style={{ color: 'black' }}>{bio}</Text>
            </View>
          )}
          <View style={SPB.actionsContainer}>
            <TouchableOpacity
              style={SPB.actionButton}
              onPress={handleOnMessageClick}>
              {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <ActivityIndicator size={'small'} color={palette.white} />
                </View>
              ) : (
                <Text style={SPB.actionButtonText}>
                  {isPublicProfile ? blocked ? 'Unblock' : 'Message' : 'Edit profile'}
                </Text>
              )}
            </TouchableOpacity>
            {/* {isProfileOwner ?
              <TouchableOpacity
                style={SPB.actionButton}
                onPress={() => navigation.navigate('BorrowNav', {
                  screen: 'EditListing',
                  params: { listingData: offlineListing }
                })}
              >
                <Text style={SPB.actionButtonText}>Edit Listing</Text>
              </TouchableOpacity>
              : */}
            <TouchableOpacity style={SPB.actionButton} onPress={onShare}>
              <Text style={SPB.actionButtonText}>Share profile</Text>
            </TouchableOpacity>
            {/* } */}
          </View>
        </Wrapper>
        <Toast config={toastConfig} />
      </View>
    </>
  );
};

export default ProfileBio;
