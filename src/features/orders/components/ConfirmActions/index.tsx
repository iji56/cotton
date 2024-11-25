import { Text, TouchableOpacity, View } from "react-native"
import Wrapper from "@/components/Wrapper";
import { SCA } from "./ConfirmActions.styles";
import { reduxSelect } from "@/types/reduxHooks";
import { CommonActions, ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'

type ConfirmActionsProps = {
  lender: boolean;
  shipping: boolean;
  userID: string;
  otherUserID: string;
  otherUsername: string;
	approval: boolean;
	paymentIntent: string
}

const ConfirmActions = ({
  lender,
  shipping,
  userID,
  otherUserID,
  otherUsername,
	approval,
	paymentIntent
}: ConfirmActionsProps) => {
  const navigation  = useNavigation<NativeStackNavigationProp<ParamListBase>>();
	const [approved, setApproved] = useState(false);
	const accessToken = reduxSelect((state) => state.auth.access_token) ?? null;

	useEffect(()=> {
		if (approval === false){
			setApproved(false)
		} else {
			setApproved(true)
		}
	},[])

	const approveTransaction = async () => {
		try {
			const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/confirm-borrow`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${accessToken}`
					},
					body: JSON.stringify({
						paymentIntent: paymentIntent,
						approved: true
					}),
				}); 
				const { capturedPaymentIntent } = await response.json();

				console.log(capturedPaymentIntent, "CAPTURED PAYMENT INTENT")
				setApproved(true);
		} catch (error) {
			console.log(error)
		}
	}

  const createChat = async (currentUser: string, otherUser: string) => {
    try {
      // Check if the chat room exists by querying the chat_rooms table
      let { data: existingChatRooms, error } = await supabase
          .from('chat_rooms')
          .select('id')
          .eq('user_a', currentUser)
          .eq('user_b', otherUser);

      if (error) throw error;
      if (existingChatRooms && existingChatRooms.length > 0) return existingChatRooms[0].id;

      // Check if the chat room exists by querying with otherUser as user_a and currentUser as user_b
      ({ data: existingChatRooms, error } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('user_a', otherUser)
        .eq('user_b', currentUser));

      if (error) throw error;
      if (existingChatRooms && existingChatRooms.length > 0) return existingChatRooms[0].id;

      // If no chat room exists, create a new one
      let { data: newChatRoomData, error: newChatRoomError } = await supabase
        .from('chat_rooms')
        .insert([{ user_a: currentUser, user_b: otherUser }])
        .select('id');

      if (newChatRoomError) throw newChatRoomError;

      if (newChatRoomData && newChatRoomData.length > 0) {
        return newChatRoomData[0].id; // Return the newly created chat room ID
      } else {
        console.error('Error creating chat room: No data returned');
        return null;
      }
    } catch (error) {
      console.error('Error creating chat room:', error.message);
      return null;
    }
  };

	//TODO:
	//1. Get the Canada Post Number
	//2. get the chat number
	//3. create the support thing?
  return (
    <View style={SCA.mainContainer}>
      <Wrapper>
        { shipping ? (
          <View style={SCA.rowContainer}>
            <Text style={SCA.subHeader}>Canada Post Number</Text>
            <Text>e12315kfs231</Text>
          </View>
        ) : null }

        <View>
          <TouchableOpacity
            style={SCA.actionButton}
            onPress={async () => {
              try {
                const otherUser = otherUserID;
                const chat_id = await createChat(userID, otherUserID);
    
                if (chat_id) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Chat' }], // Replace 'Chat' with the name of the initial screen in your Chat stack
                    })
                  );

                  navigation.navigate('Chat', {
                    screen: 'ChatSingle',
                    params: { chatID: chat_id, receiverName: otherUsername }
                  });
                } else {
                  console.error('Failed to create or fetch chat room');
                }
              } catch (error) {
                console.error('Error creating or fetching chat room:', error.message);
              }
            }}
          >
            <Text style={SCA.actionButtonText}>chat with {otherUsername}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={SCA.actionButtonAlt}
            onPress={() => console.log('nice')}
          >
            <Text style={SCA.actionButtonTextAlt}>support</Text>
          </TouchableOpacity>
					{ lender == true && approved == false ? 
          <TouchableOpacity
					style={SCA.actionButtonAlt}
					onPress={() => approveTransaction()}
          >
            <Text style={SCA.actionButtonTextAlt}>Approve Transaction</Text>
          </TouchableOpacity>
					: null}
        </View>
      </Wrapper>
    </View>
  )
}

export default ConfirmActions;