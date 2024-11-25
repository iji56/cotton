import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Addresses from "./AddressesMain";
import AddressMap from "../components/AddressMap";
import AddAddresses from "./AddAddresses";

const Addressesnav = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="AddressesMain" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="AddressesMain" component={Addresses} />
            <Stack.Screen name="AddAddresses" component={AddAddresses} />
            <Stack.Screen name="AddressesMap" component={AddressMap} />
        </Stack.Navigator>
    )
}

export default Addressesnav;