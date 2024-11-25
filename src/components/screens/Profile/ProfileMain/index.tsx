import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../../styles/theme';
import Layout from '../../../sections/Layout';
import ProfileHeader from '../../../sections/ProfileHeader';
import SProfileMain from './ProfileMain.styles';
import Avatar from '../../../elements/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faShirt } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../elements/Button/Button';
import Tab from '../../../elements/Tab';
import FeedList from '../../../sections/FeedList/Profile/index';
import { useState } from 'react';
import EditBio from '../EditBio';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  EditListing: undefined;
};

const ProfileMain = () => {
  const navigation = useNavigation() as NativeStackNavigationProp<
    RootStackParamList,
    'EditListing'
  >;

  const profileRoutes = [
    { key: 'listing', title: 'Listing' },
    { key: 'reviews', title: 'Reviews' },
  ];

  const ListingRoute = () => (
    <View style={{ flex: 1 }}>
      <FeedList />
    </View>
  );

  const ReviewsRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }}>
      {/* TODO: import Reviews contents*/}
    </View>
  );

  const scenes = {
    listing: ListingRoute,
    reviews: ReviewsRoute,
  };

  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);

  const handleShowModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: theme.colors.background,
      }}
    >
      <Layout>
        <ProfileHeader headerType="main" />
        <View style={SProfileMain.head}>
          <View>
            <Avatar
              size="medium"
              avatar={
                'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1060&t=st=1694126971~exp=1694127571~hmac=d66573e2f179313af532d677f14ca5e82a9c452e2f270ea4c25906d615372848'
              }
            />
          </View>
          <View style={SProfileMain.headContainer}>
            <View style={SProfileMain.headBox}>
              <Text>100</Text>
              <Text>Followers</Text>
            </View>
            <View style={SProfileMain.headBox}>
              <Text>100</Text>
              <Text>Followers</Text>
            </View>
          </View>
        </View>
        <View style={SProfileMain.profile}>
          <Text style={SProfileMain.name}>Rohit Singh</Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur. Purus risus vitae ipsum
            sodales nascetur ullamcorper proin. Eget fermentum duis vel placerat
            vestibulum donec vitae.
          </Text>
          <View style={SProfileMain.profileItem}>
            <FontAwesomeIcon icon={faLocationDot} size={24} />
            <Text>Windsor, ON</Text>
          </View>
          <View style={SProfileMain.profileItem}>
            <FontAwesomeIcon icon={faShirt} size={24} />
            <Text>50 Items</Text>
          </View>
        </View>
        <View style={SProfileMain.edit}>
          <Button
            text={'Edit Bio'}
            variant={'main'}
            onPress={handleShowModal}
          />
          <Button
            text={'Edit Listings'}
            variant={'main'}
            onPress={() => navigation.navigate('EditListing')}
          />
        </View>
        {/* TODO: Solve the route renderings problem */}
        <Tab routes={profileRoutes} scenes={scenes} />
        <ListingRoute />
        {modalVisible && (
          <EditBio
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        )}
      </Layout>
    </ScrollView>
  );
};

export default ProfileMain;
