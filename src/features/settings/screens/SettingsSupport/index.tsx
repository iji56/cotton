import { useEffect, useState } from "react";
import { palette } from "@/components/styles/theme";
import {  ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsHeader from "../../components/SettingsHeader";
import Wrapper from "@/components/Wrapper";
import SSS from "./SettingsSupport.styles";
import { reduxDispatch, reduxSelect } from "@/types/reduxHooks";
import { authDelete } from "@/features/auth/api/authDelete";
import { keywords } from "../../utils/keywords";
import { STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'

const SettingsSupport = () => {
  const insets = useSafeAreaInsets();
  const dispatch = reduxDispatch();
  const userID = reduxSelect(state => state.auth.uid) ?? '';
  const paused = reduxSelect(state => state.usermeta.account_paused) ?? false;
  const userAccountId = reduxSelect(state => state.usermeta.stripe_account_id) ?? null;
  const accessToken = reduxSelect((state) => state.auth.access_token) ?? null;
  const [userBalance, setUserBalance] = useState(null);
  const [userInstantBalance, setUserInstantBalance] = useState(null);
  const [userPendingBalance, setUserPendingBalance] = useState(null);

  //TODO: Disable the delete account button and add messaging before hand if they have any outstanding balances.
  const accountDelete = async () => {
    if (userAccountId !== null) {
      if (userBalance === 0 && userInstantBalance === 0 && userPendingBalance === 0) {
        try {
          const deletedStripeResponse = await deleteConnect();
          // Assuming success is indicated by a certain field in your response data
          // or a successful HTTP status code (e.g., 200 OK)
          if (deletedStripeResponse && deletedStripeResponse.data && deletedStripeResponse.data.success) {
            // Call authDelete only if deleteConnect was successful
            authDelete(userID);
          } else {
            // Handle unsuccessful deleteConnect attempt here
            console.log('Failed to delete Connect account:', deletedStripeResponse.data);
          }
        } catch (error) {
          // Handle any errors that occurred during deleteConnect
          console.error('Error deleting Connect account:', error);
        }
      }
    } else {
      authDelete(userID);
    }
  };

  useEffect(() => {
    if (userBalance === null) {
      getBalance()
    }
  }, [userBalance])

  const getBalance = async () => {
    try {
      const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          account_id: userAccountId,
        }),
      });

      const data = await response.json();
      setUserBalance(data.available[0].amount)
      setUserInstantBalance(data.instant_available[0].amount)
      setUserPendingBalance(data.pending[0].amount)
    }
    catch (error) {
      console.log(error)
    }
  }

  const deleteConnect = async () => {
    try {
      const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/delete-connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          account_id: userAccountId,
          id: userID,
        }),
      });
      const data = await response.json();
      return {
        data,
      };
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: palette.white,
        }}>
        <SettingsHeader headerTitle={keywords.contactUs}/>
        <Wrapper>
          <View style={SSS.Container}>
            <View style={SSS.Description}>
              <Text style={SSS.descriptionText}>
                {keywords.havAQuestion}
              </Text>
            </View>
            <View style={SSS.inputContainer}>
              <View style={SSS.innerContainer}>
                <Text style={SSS.CustomText}>{keywords.customerSupport}</Text>

                <View style={SSS.custInp}>
                  <Text>{keywords.email}</Text>
                  <Text style={SSS.text}>{keywords.emailPlaceholder}</Text>
                </View>
              </View>
              <View style={SSS.innerContainer2}>
                <Text style={SSS.CustomText}>{keywords.socialMedia}</Text>
                <View style={SSS.custInp}>
                  <Text>{keywords.instagram}</Text>
                  <Text style={SSS.text}>{keywords.socialMediaEmailPlaceholder}</Text>
                </View>
                <View style={SSS.custInp}>
                  <Text>{keywords.tiktok}</Text>
                  <Text style={SSS.text}>{keywords.socialMediaEmailPlaceholder}</Text>
                </View>
              </View>
            </View>
          </View>
        </Wrapper>
      </ScrollView>
    </>
  )
}

export default SettingsSupport;
