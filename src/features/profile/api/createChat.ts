import { supabase } from "@/lib/supabase";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const createChat = async (currentUser: string, otherUser: string) => {
    try {
        // Check if the chat room exists by querying the chat_rooms table
        let { data: existingChatRooms, error } = await supabase
            .from('chat_rooms')
            .select('id')
            .eq('user_a', currentUser)
            .eq('user_b', otherUser);

        if (error) {
            throw error;
        }

        if (existingChatRooms && existingChatRooms.length > 0) {
            return existingChatRooms[0].id;
        }

        // Check if the chat room exists by querying with otherUser as user_a and currentUser as user_b
        ({ data: existingChatRooms, error } = await supabase
            .from('chat_rooms')
            .select('id')
            .eq('user_a', otherUser)
            .eq('user_b', currentUser));

        if (error) {
            throw error;
        }

        if (existingChatRooms && existingChatRooms.length > 0) {
            return existingChatRooms[0].id;
        }

        // If no chat room exists, create a new one
        let { data: newChatRoomData, error: newChatRoomError } = await supabase
            .from('chat_rooms')
            .insert([{ user_a: currentUser, user_b: otherUser }])
            .select('id');

        if (newChatRoomError) {
            throw newChatRoomError;
        }

        if (newChatRoomData && newChatRoomData.length > 0) {
            return newChatRoomData[0].id; // Return the newly created chat room ID
        } else {
            console.error('Error creating chat room: No data returned');
            return null;
        }
    } catch (error: any) {
        console.error('Error creating chat room:', error.message);
        return null;
    }
};

export const createChatAndNavigate = async (currentUser: string, otherUser: string, userName: string, navigation: NativeStackNavigationProp<ParamListBase>, message?: string) => {
    try {
        const chat_id = await createChat(currentUser, otherUser);
        if (chat_id) {
            if (message && message !== 'undefined') {
                await supabase.from('chat_messages').insert({
                    chat_room_id: chat_id,
                    message_body: message,
                    user_id: currentUser,
                });
            } else if (!message) {
                // navigation.dispatch(
                //     CommonActions.reset({
                //         index: 0,
                //         routes: [{ name: 'Chat' }], // Replace 'Chat' with the name of the initial screen in your Chat stack
                //     })
                // );
                navigation.navigate('Chat', {
                    screen: 'ChatSingle',
                    params: { chatID: chat_id, receiverName: userName }
                });
            }
        } else {
            console.error('Failed to create or fetch chat room');
        }
    } catch (error) {
        console.error('Error creating chat and navigating:', error);
    }
}