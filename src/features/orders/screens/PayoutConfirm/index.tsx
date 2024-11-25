import { theme } from "@/components/styles/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrdersHeader from "../../components/OrdersHeader";

const PayoutConfirm = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: theme.colors.background
    }}>
      <OrdersHeader headerTitle={'payout'} redirect={'PayoutMain'} />
      <TouchableOpacity
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('PayoutMain');
        }}
      ><Text>To wallet</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PayoutConfirm;