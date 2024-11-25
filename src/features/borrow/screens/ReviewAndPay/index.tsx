import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BorrowHeader from '../../components/BorrowHeader';
import {
  imagesData,
  keywords,
  placeholderPicture,
} from '../../utils/staticTexts';
import { ScrollView } from 'react-native-gesture-handler';
import SRAP from './ReviewAndPay.styles';
import H2 from '@/components/elements/H2';
import { palette } from '@/components/styles/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import Button from '@/components/elements/Button/Button';
import TextField from '@/components/elements/Forms/TextField';
import Wrapper from '@/components/Wrapper';
import {
  ParamListBase,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListingItem from '../../components/ListingItem';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import H1 from '@/components/elements/H1';
import BottomSheets from '@/components/elements/BottomSheet';
import { getInsuranceFee, getTotalAmount } from '../../utils/getInsuranceFee';
import { requestBuy } from '../../api/requestBuy';
import { reduxDispatch, reduxSelect } from '@/types/reduxHooks';
import { getDeliveryCharge } from '../../api/getDeliveryCharge';
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { usermetaUpdate } from '@/store/actions/usermetaActions';
import { requestBorrow } from '../../api/requestBorrow';
import { dollarConversion } from '@/utils/dollarConversion';
import { getListingAddress } from '@/features/orders/api/getListingAddress';
import Loader from '@/components/elements/Loader';
import ListingAddress from '@/features/addListing/components/ListingAddress';
import { calculateTotalPrice } from '../../utils/calculateCost';
import { createChatAndNavigate } from '@/features/profile/api/createChat';
import {
  sendOnRequestBorrowEmails,
  sendOnRequestBuyEmails,
} from '../../api/sendListingEmails';

const ReviewAndpay = ({ route }: any) => {
  const dispatch = reduxDispatch();
  const { itemData, selectedDates, borrowMethod, type, address } = route.params;

  const user = reduxSelect(state => state.usermeta);
  const customerId = reduxSelect(state => state.usermeta.stripe_customer_id);
  const [isChecked, setIsChecked] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [message, setMessage] = useState('');
  const [userAddress, setUserAddress] = useState<any>('');
  const [snapPoint, setSnapPoint] = useState<string | number>(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bottomSheetType, setBottomSheetType] = useState<
    'insurance' | 'address'
  >('insurance');
  const [paymentMethod, setPaymentMethod] = useState<{
    id: '';
    card: { brand: ''; last4: '' };
  } | null>(null);
  const bottomSheetRef = useRef<any>();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const selectedDays = Object.keys(selectedDates).length;
  const saleOrBorrowPrice = Number(
    itemData.priceBorrow.substring(1).replace(/,/g, ''),
  );
  const originalPrice = Number(
    itemData.priceOriginal.substring(1).replace(/,/g, ''),
  );
  let totalPrice =
    selectedDays > 3
      ? parseFloat(
          calculateTotalPrice(saleOrBorrowPrice, selectedDays) as string,
        )
      : saleOrBorrowPrice;
  let borrowPrice = totalPrice + totalPrice * 0.13;
  const insuranceFee =
    type === keywords.buy ? 0 : getInsuranceFee(originalPrice);

  const totalAmount = useMemo(() => {
    if (!itemData) return 0; // Return 0 or a default value if itemData is missing

    return getTotalAmount(
      borrowPrice || 0,
      deliveryCharge,
      isChecked ? insuranceFee + (borrowPrice < 500 ? 5 : 0) : insuranceFee,
    );
  }, [itemData, deliveryCharge, isChecked]);

  useEffect(() => {
    customerId && getDefaultPaymentMethod();

    const getUserAddress = async () => {
      const addresses = await getListingAddress(address.addressId);
      if (addresses?.length > 0)
        setUserAddress({ ...addresses[0], addressId: addresses[0]?.id });
    };

    getUserAddress();
  }, [isFocused]);

  useEffect(() => {
    userAddress && fetchDeliveryCharge();
  }, [userAddress]);

  const fetchDeliveryCharge = async () => {
    console.log('user address : ', userAddress);
    const addresses = await getListingAddress(
      userAddress.id || userAddress.addressId || userAddress.address_id,
    );
    console.log('itemData', itemData);
    console.log('listing address', addresses);
    if (borrowMethod === keywords.shipping) {
      const deliveryCharge = await getDeliveryCharge(
        addresses?.length > 0 ? addresses[0]?.postal_code : '',
        itemData?.postalCode || '',
      );
      console.log('delivery charge : ', deliveryCharge);
      const buyBorrowDeviveryCharge =
        type === keywords.buy
          ? deliveryCharge?.initialCost || 0
          : deliveryCharge?.totalCost || 0;

      setDeliveryCharge(
        parseFloat(
          buyBorrowDeviveryCharge > 50
            ? (buyBorrowDeviveryCharge / 2).toFixed(2)
            : buyBorrowDeviveryCharge?.toFixed(2),
        ),
      );
      setFetching(false);
    }
    setFetching(false);
  };

  const getDefaultPaymentMethod = async () => {
    try {
      const response = await fetch(
        `${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-default-payment-method`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            customerId: customerId,
          }),
        },
      );

      const data = await response.json();
      console.log(data, 'all available payment methods');
      if (data?.paymentMethod) {
        setPaymentMethod(data?.paymentMethod);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = () => {
    // handle promo code
  };
  // console.log(itemData)

  const handleRequest = async (
    clietSecret: string,
    paymentIntentId: string,
  ) => {
    if (loading) return;
    if (!address.addressId) {
      errorToast('address cannot found, Select a differenct addresses');
      return;
    }
    if (clietSecret && paymentIntentId && paymentMethod) {
      setLoading(true);
      if (type === keywords.buy) {
        const response = await requestBuy(
          user.id!,
          itemData.userID,
          borrowMethod !== keywords.shipping ? 0 : 1,
          totalPrice * 0.13, // tax
          deliveryCharge, // shipping cost
          insuranceFee == 0 && isChecked ? 5 : insuranceFee,
          parseFloat(itemData.discount) || 0,
          totalAmount,
          itemData.id,
          borrowMethod !== keywords.shipping
            ? Object.keys(selectedDates)[0]
            : '',
          borrowMethod === keywords.shipping
            ? Object.keys(selectedDates)[0]
            : '',
          saleOrBorrowPrice,
          paymentIntentId,
          paymentMethod?.id,
          clietSecret,
          address.addressId,
          message,
        );
        if (response) {
          //send email for requesting
          await sendOnRequestBuyEmails(
            itemData,
            user,
            borrowMethod,
            deliveryCharge,
          );
          await createChatAndNavigate(
            user.id!,
            itemData.userID,
            itemData.username,
            navigation,
            message || 'undefined',
          );

          navigation.navigate('RequestSent', {
            itemData,
            selectedDates: selectedDates,
            totalAmount,
            lender: false,
            borrowMethod,
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        const response = await requestBorrow(
          itemData.id,
          user.id!,
          itemData.userID,
          borrowMethod !== keywords.shipping ? 0 : 1,
          Object.keys(selectedDates)[0],
          Object.keys(selectedDates)[Object.keys(selectedDates).length - 1],
          totalPrice * 0.13, // tax
          borrowMethod === keywords.shipping ? deliveryCharge : 0, // shipping cost
          insuranceFee == 0 && isChecked ? 5 : insuranceFee,
          parseFloat(itemData.discount) || 0,
          totalAmount,
          saleOrBorrowPrice,
          paymentMethod?.id,
          clietSecret,
          paymentIntentId,
          0, //service cost
          address.addressId,
          message,
        );
        console.log('Response  : ', response);
        if (response) {
          const borrowStart = Object.keys(selectedDates)[0];
          const borrowEnd =
            Object.keys(selectedDates)[Object.keys(selectedDates).length - 1];
          await sendOnRequestBorrowEmails(
            itemData,
            borrowStart,
            borrowEnd,
            user,
            borrowMethod,
            deliveryCharge,
          );
          await createChatAndNavigate(
            user.id!,
            itemData.userID,
            itemData.username,
            navigation,
            message || 'undefined',
          );
          navigation.navigate('RequestSent', {
            itemData,
            selectedDates: selectedDates,
            totalAmount,
            lender: true,
            borrowMethod,
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
      errorToast('Missing payment method! try again');
    }
  };

  const updateUser = async () => {
    try {
      let { data, error } = await supabase
        .from('user_meta')
        .select(
          `
          id,
          email,
          user_name,
          first_name,
          last_name,
          street_address_line_1,
          street_address_line_2,
          city,
          state,
          postal_code,
          country,
          stripe_id,
          stripe_account_id,
          stripe_customer_id,
          bio,
          gender,
          height,
          weight,
          body_type,
          onboarding_complete,
          account_paused,
          user_picture:images!user_id(
            id,
            url_path
          ),
          favourites:listings_favourite!user_id(
            id
          )
        `,
        )
        .eq('id', user.id)
        .select();

      if (error) throw new Error(error.message);

      if (data) {
        dispatch(usermetaUpdate(data[0]));
        console.log('user meta data : ', data[0]);
      }
    } catch (error) {
      console.log('error updating user meta : ', (error as Error).message);
    }
  };

  const createCustomerAccount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            userId: user.id,
          }),
        },
      );
      console.log('response :', response);
      const data = await response.json();
      console.log(data);
      if (data?.success) {
        setIsLoading(false);
        await updateUser();
        navigateToAccount();
      } else {
        setIsLoading(false);
        errorToast(data?.message || 'unable to create account! try again');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error: ', error);
    }
  };

  const handleConnect = async () => {
    if (!customerId && !paymentMethod) {
      await createCustomerAccount();
    } else {
      navigateToAccount();
    }
  };

  const navigateToAccount = () => {
    if (paymentMethod) {
      navigation.navigate('PaymentMethods');
    } else {
      navigation.navigate('CreatePaymentMethod');
    }
  };

  const createPaymentIntent = async () => {
    try {
      if (isLoading) {
        return;
      }
      setLoading(true);
      const response = await fetch(
        `${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount: 400, //totalAmount.toFixed(0),
            currency: 'cad',
            customerId: customerId,
            paymentMethodId: paymentMethod?.id,
          }),
        },
      );

      const data = await response.json();
      console.log(data);
      if (data?.paymentIntent?.client_secret) {
        handleRequest(
          data?.paymentIntent.client_secret,
          data?.paymentIntent.id,
        );
        setLoading(false);
      } else {
        setLoading(false);
        errorToast('Could not create payment intent try again');
      }
      return data;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: { image: ImageSourcePropType; text: string };
    index: number;
  }) => (
    <View style={SRAP.itemContainer} key={index}>
      <Image source={item.image} style={SRAP.itemImage} />
      <Text style={SRAP.itemText}>{item.text}</Text>
    </View>
  );

  return (
    <Suspense fallback={<Loader />}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
        <BorrowHeader headerType="review" headerTitle={keywords.reviewAndPay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={20}>
          {fetching ? (
            <Loader />
          ) : (
            <>
              <ScrollView
                style={SRAP.container}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag">
                <TouchableOpacity
                  style={SRAP.addressMainContainer}
                  onPress={() => {
                    setBottomSheetType('address');
                    bottomSheetRef.current?.snapToIndex(1);
                    setSnapPoint('60%');
                  }}>
                  <H2 text={keywords.address} />
                  <View style={SRAP.addressContainer}>
                    <Text style={SRAP.address} numberOfLines={1}>
                      {userAddress?.address?.split('#')[0] ||
                        keywords.shippingAddress}
                    </Text>
                    <View>
                      <FontAwesomeIcon icon={'chevron-right'} />
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={SRAP.infoContainer}>
                  <H2
                    text={keywords.impactByRenting}
                    style={{ color: palette.white, marginBottom: 10 }}
                  />
                  <FlatList
                    data={imagesData}
                    contentContainerStyle={{ width: '100%' }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View style={SRAP.orderContainer}>
                  <H2 text={keywords.orderDetails} />
                  <ListingItem
                    itemData={itemData}
                    selectedDates={selectedDates}
                  />
                  {/* <View style={SRAP.promoCodeContainer}>
                                    <TextField value={promoCode} onChangeText={(code) => setPromoCode(code)} placeholder={keywords.promoCode} style={SRAP.promoCode} />
                                    <View>
                                        <Button text={keywords.apply} onPress={handleApply} variant='main' style={SRAP.apply} />
                                    </View>
                                </View> */}
                  {originalPrice < 500 && (
                    <View style={SRAP.checkboxContainer}>
                      <Checkbox
                        label={keywords.checkBoxMessage}
                        onClick={() => setIsChecked(!isChecked)}
                        isChecked={isChecked}
                        textStyle={SRAP.checkBoxText}
                      />
                    </View>
                  )}
                  <Text style={SRAP.savingMessage}>
                    {keywords.savingMessage.replace(
                      '40%',
                      itemData.discount + '%',
                    )}
                  </Text>
                  <View style={SRAP.priceRow}>
                    <Text style={SRAP.text}>{keywords.subTotal}</Text>
                    <Text style={SRAP.text}>{`CA $${borrowPrice?.toFixed(
                      2,
                    )}`}</Text>
                  </View>
                  {(insuranceFee != 0 || isChecked) && (
                    <View style={SRAP.priceRow}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={SRAP.text}>{keywords.insurance}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setBottomSheetType('insurance');
                            setSnapPoint(300);
                          }}
                          style={SRAP.icon}>
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </TouchableOpacity>
                      </View>
                      <Text style={SRAP.text}>{`CA $${
                        insuranceFee === 0 ? 5 : insuranceFee
                      }`}</Text>
                    </View>
                  )}
                  {borrowMethod === keywords.shipping && (
                    <View style={SRAP.priceRow}>
                      <Text style={SRAP.text}>{keywords.delivery}</Text>
                      <Text style={SRAP.text}>{`CA $${
                        deliveryCharge > 50
                          ? (deliveryCharge / 2).toFixed(2)
                          : deliveryCharge?.toFixed(2)
                      }`}</Text>
                    </View>
                  )}
                  <View style={SRAP.priceRow}>
                    <Text style={SRAP.text}>{keywords.total}</Text>
                    <Text style={SRAP.text}>{`CA $${totalAmount?.toFixed(
                      2,
                    )}`}</Text>
                  </View>
                </View>
                <View style={SRAP.lenderContainer}>
                  <H2
                    text={
                      selectedDays > 3
                        ? keywords.messageLender
                        : keywords.messageSeller
                    }
                  />
                  <TouchableOpacity
                    style={SRAP.userContainer}
                    onPress={() =>
                      navigation.navigate('FeedProfile', {
                        userID: itemData.userID,
                      })
                    }>
                    <Image
                      source={{
                        uri: itemData?.userAvatar || placeholderPicture,
                      }}
                      style={SRAP.userImage}
                    />
                    <H2 text={itemData.username} />
                  </TouchableOpacity>
                  <TextField
                    value={message}
                    onChangeText={message => setMessage(message)}
                    placeholder={keywords.messagePlaceholder}
                    style={{
                      borderWidth: 0,
                      backgroundColor: palette.lightGrey,
                      marginVertical: 20,
                      width: '100%',
                    }}
                  />

                  <View>
                    <Text style={SRAP.note}>
                      {keywords.note}:
                      <Text style={SRAP.noteText}>
                        {' '}
                        {keywords.lenderNoteMessage}{' '}
                      </Text>
                    </Text>
                  </View>
                </View>

                {paymentMethod ? (
                  <TouchableOpacity
                    style={SRAP.lenderContainer}
                    onPress={handleConnect}>
                    <H2 text={keywords.payment} />
                    <View style={SRAP.paymentContainer}>
                      <Text style={SRAP.address}>
                        {`${paymentMethod.card.brand} ${paymentMethod.card.last4}`}
                      </Text>
                      <View>
                        <FontAwesomeIcon icon={'chevron-right'} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Button
                    text={keywords.connectAccount}
                    onPress={handleConnect}
                    variant="secondary"
                    style={SRAP.connnectButton}
                    loading={isLoading}
                    color={palette.darkBlue}
                  />
                )}
              </ScrollView>
            </>
          )}
        </KeyboardAvoidingView>
        <Wrapper>
          <View style={SRAP.buttonMainContainer}>
            <View style={SRAP.buttonContainer}>
              <Button
                text={keywords.back}
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={SRAP.button}
              />
              <View style={{ width: 10 }} />
              <Button
                text={keywords.request}
                onPress={createPaymentIntent}
                variant="main"
                style={SRAP.button}
                loading={loading}
              />
            </View>
          </View>
        </Wrapper>
        <BottomSheets
          bottomSheetRef={bottomSheetRef}
          handleSheetChanges={(index: number) => {
            if (index > 0) {
              setSnapPoint(index);
            } else {
              setSnapPoint(1);
            }
          }}
          snapPoint={snapPoint}
          setSnapPoint={setSnapPoint}>
          {bottomSheetType === 'insurance' ? (
            <View style={SRAP.modalContainer}>
              <View style={SRAP.insurance}>
                <H1 text={keywords.insurance} />
              </View>
              <Text style={SRAP.insuranceMessage}>
                {keywords.insuranceMessage}
              </Text>
              <View style={SRAP.insuranceButton}>
                <Button
                  text={keywords.gotIt}
                  onPress={() => setSnapPoint(1)}
                  variant="main"
                />
              </View>
            </View>
          ) : (
            <ListingAddress address={userAddress} setAddress={setUserAddress} />
          )}
        </BottomSheets>
        {/* <BottomSheets bottomSheetRef={ref} snapPoint={snapPoint} setSnapPoint={setSnapPoint} handleSheetChanges={() => { }}>
                <ListingAddress address={address} setAddress={setAddress} />
            </BottomSheets> */}
        <Toast config={toastConfig} />
      </View>
    </Suspense>
  );
};

export default ReviewAndpay;
