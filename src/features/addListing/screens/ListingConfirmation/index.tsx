import { Image, ScrollView, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SLC from './ListingConfirmation.styles';
import H1 from '@/components/elements/H1';
import { keywords } from '../../../borrow/utils/staticTexts';
import Button from '@/components/elements/Button/Button';
import H2 from '@/components/elements/H2';
import Wrapper from '@/components/Wrapper';
import {
  CommonActions,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListingItem from '../../components/ListingItem';
import { createChatAndNavigate } from '@/features/profile/api/createChat';
import { reduxSelect } from '@/types/reduxHooks';

const ListingConfirmation = ({ route }: any) => {
  const { itemData } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const user = reduxSelect(state => state.usermeta);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleChat = async () => {
    setLoading(true);
    await createChatAndNavigate(
      user.id!,
      itemData?.userID,
      user.user_name!,
      navigation,
    );
    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <ScrollView
        contentContainerStyle={SLC.container}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../components/assets/check.png')}
          style={SLC.checkIcon}
        />
        <View style={SLC.requestSent}>
          <H1 text={keywords.listingAdded} />
          <View style={SLC.space} />
          <Text style={SLC.boldText}>{keywords.yourListingAddedMessage}</Text>
          <Text style={SLC.boldText}>{keywords.hereAreTheDetail}</Text>
        </View>
        <Wrapper>
          <View style={SLC.orderDetail}>
            <H1 text={keywords.listingDetail} />
          </View>
          <View style={SLC.listingContainer}>
            <ListingItem
              itemData={{
                ...itemData,
                images:
                  itemData?.images?.length > 0 ? itemData.images[0] : null,
              }}
            />
          </View>
          <View style={SLC.calculationContainer}>
            <View>
              <H2 text={keywords.retailPrice} />
              <Text style={SLC.value}>
                {'CA $'}
                {itemData?.originalPrice || 0}
              </Text>
            </View>
            <View>
              <H2 text={keywords.category} />
              <Text style={SLC.value}>{itemData?.category || 'Dress'}</Text>
            </View>
          </View>
          <View style={SLC.calculationContainer}>
            <View>
              <H2 text={keywords.listingPrice} />
              <Text style={SLC.value}>{`CA $${
                itemData?.borrowPrice || '90.00'
              }`}</Text>
            </View>
            <View style={{ width: 90 }}>
              <H2 text={keywords.sellPrice} />
              <Text style={SLC.value}>
                {'CA $'}
                {itemData?.salePrice || 0}
              </Text>
            </View>
          </View>

          <View style={SLC.calculationContainer}>
            <View>
              <H2 text={keywords.availabilityForLending} />
              <Text style={SLC.value}>
                {itemData?.availability || '4 '}
                {keywords.days}
              </Text>
            </View>
          </View>

          <View style={SLC.buttonContainer}>
            <Button
              text={keywords.chatWithLender}
              onPress={handleChat}
              variant="secondary"
              style={SLC.button}
              loading={loading}
            />
            <View style={{ height: 20 }} />
            <Button
              text={keywords.returnHome}
              onPress={() =>
                navigation.reset({
                  routes: [{ name: 'PrimaryNav' }],
                  index: 0,
                })
              }
              variant="main"
              style={SLC.button}
            />
          </View>
        </Wrapper>
      </ScrollView>
    </View>
  );
};

export default ListingConfirmation;
