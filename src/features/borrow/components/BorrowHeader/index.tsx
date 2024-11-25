import Wrapper from '@/components/Wrapper';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import SBH from './BorrowHeader.styles';
import Avatar from '@/components/elements/Avatar';
import { ListingItem } from '@/features/feed/types/supabaseListings';
import H1 from '@/components/elements/H1';
import { palette } from '@/components/styles/theme';
import { keywords } from '../../utils/staticTexts';

type BorrowHeaderProps = {
  headerTitle?: string;
  headerType?: 'main' | 'edit' | 'review';
  itemData?: ListingItem;
  backNav?: string;
  backNavPayload?: {};
};

const BorrowHeader = ({
  headerTitle,
  headerType,
  itemData,
  backNav,
  backNavPayload,
}: BorrowHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={SBH.mainContainer}>
      {headerType === 'main' ? (
        <Wrapper>
          <View style={SBH.borrowContainer}>
            <TouchableOpacity
              style={SBH.backButton}
              onPress={() =>
                navigation.navigate(
                  backNav ? backNav : 'FeedMain',
                  backNavPayload,
                )
              }>
              <FontAwesomeIcon icon={faArrowLeft} color={'#000'} size={20} />
            </TouchableOpacity>
            <View style={SBH.iconsContainer}>
              <Text>{itemData.username}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FeedProfile', {
                    userID: itemData.userID,
                  });
                }}>
                {itemData && <Avatar size="s" avatar={itemData.userAvatar} />}
              </TouchableOpacity>
            </View>
          </View>
        </Wrapper>
      ) : headerType === 'edit' ? (
        <Wrapper>
          <View style={SBH.borrowContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={SBH.backButton}
                onPress={() =>
                  navigation.navigate('BorrowNav', {
                    screen: 'BorrowMain',
                    params: { listingData: backNavPayload },
                  })
                }>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  color={palette.black}
                  size={25}
                />
              </TouchableOpacity>
              <H1 text={headerTitle!} />
            </View>
          </View>
        </Wrapper>
      ) : headerType === 'review' ? (
        <Wrapper>
          <View style={SBH.borrowContainer}>
            <View style={SBH.titleContainer}>
              <TouchableOpacity
                style={SBH.backButton}
                onPress={() =>
                  navigation.navigate(backNav ? backNav : 'FeedMain')
                }>
                <FontAwesomeIcon icon={faX} color={palette.black} size={20} />
              </TouchableOpacity>
              <H1 text={headerTitle!} />
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={SBH.cancelText}>{keywords.cancel}</Text>
            </TouchableOpacity>
          </View>
        </Wrapper>
      ) : (
        <Wrapper>
          <View style={[SBH.borrowContainer, { justifyContent: 'flex-start' }]}>
            <TouchableOpacity
              style={SBH.backButton}
              onPress={() =>
                navigation.navigate(backNav ? backNav : 'FeedMain')
              }>
              <FontAwesomeIcon icon={faX} color={palette.black} size={20} />
            </TouchableOpacity>
            <H1 text={headerTitle!} />
          </View>
        </Wrapper>
      )}
    </View>
  );
};

export default BorrowHeader;
