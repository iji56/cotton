import { Dispatch, SetStateAction, createContext } from "react"
import { GooglePlaceData } from "react-native-google-places-autocomplete";

export type Address = {
    address: string;
    address_id: string;
    default_status: true | null;
    apartment_suite: string;
    delivery_hand_off_instructions: string;
    postal_code?: string
}

type AddressesMainContextProp = {
    addresses: Address[];
    address: { address_id: string };
    nearbyAddresses: any;
    setAddresses: Dispatch<SetStateAction<GooglePlaceData[]>>;
    setAddress: Dispatch<SetStateAction< { address_id: string }>>;
    setNearbyAddresses: Dispatch<SetStateAction<any>>;
}

export const AddressesMainContext = createContext<AddressesMainContextProp>({
    addresses: [],
    address: { address_id: '' },
    nearbyAddresses: [],
    setAddresses: () => { },
    setAddress: () => { },
    setNearbyAddresses: () => { },
})