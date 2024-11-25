import { SUPABASE_ANON_KEY, STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'
import { getCountryCode } from './getCountryCode';

export const createShipmentPayloadSample = {
    shippingPoint: "K2B8J6",
    sender: {
        name: "John",
        company: "Vorksol",
        contactNumber: "1 (450) 823-8432",
        address: {
            addressLine: "23 jardin private",
            city: "MONTREAL",
            province: "QC",
            countryCode: "CA",
            postalCode: "H2B1A0"

        }
    },
    destination: {
        name: "Waleed",
        company: "Tech hub",
        address: {
            addressLine: "23 jardin private",
            city: "Ottawa",
            province: "ON",
            countryCode: "CA",
            postalCode: "K1K4T3"
        }
    },
    parcel: {
        weight: 5,
        length: 3,
        width: 2,
        height: 5
    },
    notificationEmail: "temp@gmail.com",
    contractId: "0043953016",
    paymentMethod: "CreditCard"
};

type UserProp = {
    name: string;
    company?: string;
    contactNumber?: string;
    address: string;
    city: string;
    province: string;
    countryCode: string;
    postalCode: string;
}

type PercelProp = {
    weight: number,
    width: number;
    height: number;
    length: number;
}

export const createShipment = async (shipmentPoint: string, sender: UserProp, destination: UserProp & { email: string }, parcel: PercelProp) => {
    try {
        let destinationCountryCode = await getCountryCode(destination.countryCode);
        // let senderCountryCode = await getCountryCode(sender.countryCode);

        let senderAddressLine1 = "";
        let senderAddressLine2 = "";
        let destinationAddressLine1 = "";
        let destinationAddressLine2 = "";

        // dividing addresses in two address format
        if (sender.address.length >= 44) {
            let lastSpaceIndex = sender.address.substring(0, 44).lastIndexOf(" ");
            senderAddressLine1 = sender.address?.substring(0, lastSpaceIndex);
            senderAddressLine2 = sender.address?.substring(lastSpaceIndex + 1).substring(0, 43);  // remove if still length is more than 44 (rare case)
        } else {
            senderAddressLine1 = sender.address;
        }
        if (destination.address.length > 44) {
            let lastSpaceIndex = destination.address.substring(0, 44).lastIndexOf(" ");
            destinationAddressLine1 = destination.address?.substring(0, lastSpaceIndex);
            destinationAddressLine2 = destination.address?.substring(lastSpaceIndex + 1).substring(0, 43); // remove if still length is more than 44 (rare case)
        } else {
            destinationAddressLine1 = destination.address;
        }

        const payload = JSON.stringify({
            "shippingPoint": destination.postalCode.split(' ').join('').toUpperCase(), //shipmentPoint, // removed spaces i.e. make M4C 5B1 to M4C5B1
            "sender": {
                "name": sender.name?.trim(),
                "company": sender.name?.trim(),//sender?.company || "vorksol",
                "contactNumber": sender?.contactNumber || createShipmentPayloadSample.sender.contactNumber,
                "address": {
                    "addressLine1": senderAddressLine1?.trim(),
                    "addressLine2": senderAddressLine2?.trim(),
                    "city": sender.city?.trim(),
                    "province": sender.province?.trim(),
                    "countryCode": "CA", //senderCountryCode?.trim(),
                    "postalCode": sender.postalCode.split(' ').join('').toUpperCase()
                }
            },
            "destination": {
                "name": destination.name?.trim(),
                "company": "",
                "address": {
                    "addressLine1": destinationAddressLine1?.trim(),
                    "addressLine2": destinationAddressLine2?.trim(),
                    "city": destination.city?.trim(),
                    "province": destination.province?.trim(),
                    "countryCode": destinationCountryCode?.trim(),
                    "postalCode": destination.postalCode.split(' ').join('').toUpperCase()
                }
            },
            "parcel": {
                "weight": parcel.weight,
                "length": parcel.length,
                "width": parcel.width,
                "height": parcel.height
            },
            "notificationEmail": destination?.email?.trim(),
            "contractId": "0043953016",
            "paymentMethod": "CreditCard"
        });
        console.log(payload)
        const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-shipment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: payload
        }
        );
        if (response.ok) {
            const data = await response.json();
            console.log("Data: ", data)

            // response sample 

            // "response": {
            //     "shipmentId": "504961723707806699",
            //     "shipmentStatus": "created",
            //     "trackingPin": "123456789012",
            //     "labelId": "10005848178"
            // }

            return data
        } else {
            let data = await response.json();
            console.log("Error creating shipment response : ", data)
            return {
                error: "Error creating shipment"
            }
        }

    }
    catch (error) {
        console.log("Error creating shipment : ", error)
    }
}