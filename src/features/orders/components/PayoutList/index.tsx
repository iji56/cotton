import { FlatList, RefreshControl, Text, View } from "react-native"
import PayoutCard from "../PayoutCard"
import { useRef, useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaymentsMainContext } from "../../context/PaymentsMainContext";

const PayoutList = () => {
	const insets = useSafeAreaInsets();
	const itemsPerPage = 20;
  const flatListRef  = useRef(null);
  const {
    filteredPayments,
    setPage,
    refreshing,
    setRefreshing,
  } = useContext(PaymentsMainContext);

	const renderItem = ({ item, index }) => {
    return <PayoutCard paymentID={item.payment_intent_id} payment={item}/>;
  };

	const onRefresh = () => {
    setRefreshing(true);
    setPage(1); // This will trigger the useFocusEffect
    // No need to explicitly call fetchData here since setPage(1) will do it via useFocusEffect
  };

  return (
    <View>
      { filteredPayments.length === 0 ? (
        <Text>no Payments</Text>
      ): (
        <FlatList
          ref={flatListRef} // Assign the ref here
          data={filteredPayments}
					horizontal={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id.toString()} // Use index as the key
          onEndReached={() => {
            // Trigger pagination only if the last page was full
            if (filteredPayments.length % itemsPerPage === 0 && filteredPayments.length >= itemsPerPage) {
              setPage(prevPage => prevPage + 1);
            }
          }}
					numColumns={1}
          onEndReachedThreshold={0.75}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  )
}

export default PayoutList