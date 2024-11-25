import { Image, Text, View } from 'react-native';
import SFeedHeader from './FeedHeader.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '@/components/elements/Button/IconButton';
import Wrapper from '@/components/Wrapper';
import { useContext } from 'react';
import { MixpanelContext } from '@/lib/mixpanel';
import SearchField from '@/components/elements/Forms/SearchField';
import { FeedMainContext } from '../../context/FeedMainContext';
import H2 from '@/components/elements/H2';
import H1 from '@/components/elements/H1';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

type FeedHeaderProps = {
  headerType?: 'main' | 'favorite' | 'search' | 'profile';
  title?: string | null;
  children?: React.ReactNode;
  handleEllipe?: () => void;
};

const FeedHeader = ({
  headerType,
  title,
  children,
  handleEllipe,
  ...props
}: FeedHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const mixpanel = useContext(MixpanelContext);
  const { search, setSearch } = useContext(FeedMainContext);

  const handleFavourite = (routeName: string) => {
    navigation.navigate('Favorite'), mixpanel?.track(`${routeName}`);
  };

  // fucntion will triger when user submit, this will hide keyboard
  const handleSubmit = () => {
    setSearch(search.trim());
  }

  // this function will change context search state, call supa base api to get filtered listing
  const handleChange = (value: string) => {
    setSearch(value);
  }

  const renderHeader = () => {
    if (headerType === 'main') {
      return (
        <View style={SFeedHeader.container}>
          <Wrapper>
            <View style={SFeedHeader.flexParent}>
              <View />
              <View />
              <Image source={require('../../../../components/assets/logo.png')} style={SFeedHeader.logo} />
              <View style={SFeedHeader.iconContainer}>
                <IconButton
                  onPress={() => navigation.navigate('Search')}
                  icon={'magnifying-glass'}
                  style={{ padding: 5 }}
                />
                <IconButton
                  onPress={() => handleFavourite('Favourite')}
                  icon={faHeart}
                  style={{ padding: 5 }}
                />
              </View>
            </View>
          </Wrapper>
        </View>
      );
    } else if (headerType === 'favorite') {
      return (
        <View style={SFeedHeader.container}>
          <Wrapper>
            <View style={SFeedHeader.favourite}>
              <IconButton
                icon={faArrowLeft}
                onPress={() => navigation.goBack()}
              />
              <View style={SFeedHeader.stackHeader}>
                <H1 text='Favourites' />
              </View>
            </View>
          </Wrapper>
        </View>
      );
    } else if (headerType === 'search') {
      return (
        <Wrapper >
          <View style={SFeedHeader.favorite}>
            <IconButton
              icon={faArrowLeft}
              onPress={() => navigation.goBack()}
              size={20}
              style={{ paddingRight: 10 }}
            />
            {/*  search input field */}
            <SearchField placeholder='Search' variant='white' value={search}
              onChangeText={handleChange} onSubmitEditing={handleSubmit} />
          </View>
        </Wrapper>
      )
    } if (headerType === "profile") {
      return (
        <View style={SFeedHeader.profileContainer}>
          <Wrapper>
            <View style={SFeedHeader.favorite}>
              <IconButton
                icon={faArrowLeft}
                onPress={() => navigation.goBack()}
              />
              <IconButton
                icon={faEllipsisV}
                onPress={() => handleEllipe ? handleEllipe() : null}
                size={20}
              />
            </View>
          </Wrapper>
        </View>
      )
    } else {
      return (
        <View style={SFeedHeader.profileContainer}>
          <Wrapper>
            <View style={SFeedHeader.favorite}>
              <IconButton
                icon={faArrowLeft}
                onPress={() => navigation.goBack()}
              />
              <Text style={SFeedHeader.stackHeader}>{title}</Text>
            </View>
          </Wrapper>
        </View>
      );
    }
  };

  return (
    <View {...props}>
      {renderHeader()}
      {children}
    </View>
  );
};

export default FeedHeader;
