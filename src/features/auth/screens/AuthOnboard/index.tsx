import { Linking, Text, TouchableOpacity, View } from "react-native"
import { STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'

const AuthOnboard = ({ route }) => {
  const user = route.params.user;

  const openStripeLink = async (data: { accountLink: { url: any; }; }) => {
		const url = data.accountLink.url;

		const supported = await Linking.canOpenURL(url);
		if (supported) {
			// Open the link in the default browser
			await Linking.openURL(url);
		} else {
			console.error("Don't know how to open this URL: " + url);
		}
	};

  const createConnect = async () => {
		try {
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-connect`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${user.accessToken}`
				},
				body: JSON.stringify({
					id: user.id,
					email: user.email,
					individual: {
						first_name: user.first_name,
						last_name: user.last_name,
						email: user.email,
						address: {
							line1: user.street_address_line_1,
              line2: user.street_address_line_2,
							city: user.city,
							state: user.state,
							postal_code: user.postal_code,
							country: 'CA',
						},
				}}),
			});
      const data = await response.json();
        
			await openStripeLink(data);
			return {
				data,
			};
		} catch (error) {
			console.log(error)
		}
	}



  return (
    <View>
    </View>
  )
}

export default AuthOnboard;