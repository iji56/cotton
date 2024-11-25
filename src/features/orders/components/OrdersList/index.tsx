import { Dimensions, Image, Modal, ScrollView, View } from "react-native";
import OrderCard from "../OrderCard";
import { OrdersMainContext } from "../../context/OrdersMainContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { RefreshControl, Text } from "react-native";
import RequestCard from "../RequestCard";
import H2 from "@/components/elements/H2";
import SearchField from "@/components/elements/Forms/SearchField";
import { keywords } from "../../utils/keywords";
import SOL from "./OrderList.styles";
import Button from "@/components/elements/Button/Button";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NotificationContext } from "@/features/Listeners/listeners";

const { height } = Dimensions.get('window');
const OrdersList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { notifications } = useContext(NotificationContext)
  const itemsPerPage = 8;
  const flatListRef = useRef(null);
  const {
    filteredOrders,
    setPage,
    refreshing,
    setFilteredOrders,
    setRefreshing,
  } = useContext(OrdersMainContext);
  const [search, setSearch] = useState('');
  const [copiedFilteredOrders, setCopiedFilteredOrders] = useState(filteredOrders)

  useEffect(() => {
    if (search.length > 0) {
      const timer = setTimeout(() => {
        const requests = filteredOrders?.request_listings?.filter(order => order?.listing_name?.toLowerCase()?.includes(search.toLowerCase()));
        const activeOrders = filteredOrders?.active_listings?.filter(order => order?.listing_name?.toLowerCase()?.includes(search.toLowerCase()));
        const completedOrders = filteredOrders?.complete_listings?.filter(order => order?.listing_name?.toLowerCase()?.includes(search.toLowerCase()));
        const cancelledOrders = filteredOrders?.cancelled_listings?.filter(order => order?.listing_name?.toLowerCase()?.includes(search.toLowerCase()));
        setCopiedFilteredOrders({
          active_listings: activeOrders,
          complete_listings: completedOrders,
          request_listings: requests,
          cancelled_listings: cancelledOrders
        })
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setCopiedFilteredOrders(filteredOrders)
    }
  }, [search])

  useEffect(() => {
    console.log(notifications)
    if (copiedFilteredOrders?.request_listings?.length > 0 && notifications?.length > 0) {

      const updatedListings = copiedFilteredOrders.request_listings.map((request) => {
        if (notifications.some(notification => notification.listing_p_b_id === request.listings_purchased_id ||
          notification.listing_p_b_id === request.listing_borrow_id
        )) {
          return {
            ...request,
            notification_id: notifications[notifications.length - 1]?.id,
            notification_read: false
          };
        }
        return request;
      });

      setCopiedFilteredOrders((prevFilteredOrders) => ({
        ...prevFilteredOrders,
        request_listings: updatedListings
      }));
    }
  }, [notifications]);

  const renderOrders = ({ item, index }: any) => <OrderCard orderID={item.payment_intent_id} order={item} />;

  const renderRequests = ({ item, index }: any) => <RequestCard orderID={item.payment_intent_id} order={item} />

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1); // This will trigger the useFocusEffect
    // No need to explicitly call fetchData here since setPage(1) will do it via useFocusEffect
  };

  const handleBrowseSelection = () => {
    navigation.navigate('NotificationNav', {
      screen: 'NotificationMain',
      params: {
        purchaserId: '0304ecd4-6c04-42db-b281-75ab9aa193ac',
        modal: 'buyer'
      }
    })
  }

  return (
    <View >
      {
        (filteredOrders.length == 0) ? (
          <View style={{ height: height * 0.8, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../components/assets/box.png')} style={SOL.boxImage} />
            <Text style={SOL.text}>{keywords.noOrder}</Text>
            <Text style={SOL.text}>{keywords.noOrderMessage}</Text>
            <View style={SOL.button}>
              <Button text={keywords.browseSelections} onPress={handleBrowseSelection} variant='main' />
            </View>
          </View>
        ) : (
          <>
            <View style={SOL.searchBarContainer}>
              <SearchField value={search} onChangeText={setSearch} placeholder={keywords.searchPlaceholder} variant='gray' icon={false} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={SOL.mainContainer} keyboardDismissMode="on-drag">

              {/* Request section */}

              <FlatList
                ref={flatListRef}
                data={copiedFilteredOrders?.request_listings}
                style={SOL.requestContainer}
                ListHeaderComponent={() => <H2 text={keywords.requests} style={[SOL.listHeading, { marginTop: -10 }]} />}
                renderItem={renderRequests}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={() => {
                  // Trigger pagination only if the last page was full
                  if (copiedFilteredOrders.length % itemsPerPage === 0 && copiedFilteredOrders.length >= itemsPerPage) {
                    setPage(prevPage => prevPage + 1);
                  }
                }}
                onEndReachedThreshold={0.75}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />

              {/* Active orders section */}

              <FlatList
                ref={flatListRef}
                data={copiedFilteredOrders?.active_listings}
                style={SOL.orderContainer}
                ListHeaderComponent={() => <H2 text={keywords.activeOrder} style={SOL.listHeading} />}
                renderItem={renderOrders}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={() => {
                  if (copiedFilteredOrders.length % itemsPerPage === 0 && copiedFilteredOrders.length >= itemsPerPage) {
                    setPage(prevPage => prevPage + 1);
                  }
                }}
                onEndReachedThreshold={0.75}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />

              {/* Completed orders section */}

              <FlatList
                ref={flatListRef}
                data={copiedFilteredOrders?.complete_listings}
                style={SOL.orderContainer}
                ListHeaderComponent={() => <H2 text={keywords.completedOrder} style={SOL.listHeading} />}
                renderItem={renderOrders}
                keyExtractor={(item, index) => index.toString()} // Use index as the key
                onEndReached={() => {
                  if (copiedFilteredOrders.length % itemsPerPage === 0 && copiedFilteredOrders.length >= itemsPerPage) {
                    setPage(prevPage => prevPage + 1);
                  }
                }}
                onEndReachedThreshold={0.75}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />

              {/* Cancelled orders section */}

              <FlatList
                ref={flatListRef}
                data={copiedFilteredOrders?.cancelled_listings}
                style={SOL.orderContainer}
                ListHeaderComponent={() => <H2 text={keywords.cancelledOrder} style={SOL.listHeading} />}
                renderItem={renderOrders}
                keyExtractor={(item, index) => index.toString()} // Use index as the key
                onEndReached={() => {
                  if (copiedFilteredOrders.length % itemsPerPage === 0 && copiedFilteredOrders.length >= itemsPerPage) {
                    setPage(prevPage => prevPage + 1);
                  }
                }}
                onEndReachedThreshold={0.75}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </ScrollView>
          </>
        )}
    </View>
  )
}

export default OrdersList;