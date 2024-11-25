import React, { useState } from "react";
import { ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatHeader from "../../components/ChatHeader";
import MainChatList from "../../components/MainChatList";
import { palette, theme } from "../../../../components/styles/theme";
import { getChatList } from "../../api/getChatList";
import { reduxSelect } from "../../../../types/reduxHooks";
import { useFocusEffect } from "@react-navigation/native";
import { ChatMainData } from "../../types/chatMain";
import { keywords } from "../../utils/keywords";

const ChatMain = () => {
  let [chatListData, setChatListData] = useState<ChatMainData[]>([]);
  const insets = useSafeAreaInsets();
  const uid = reduxSelect((state) => state.auth.uid)

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchData = async (uid: string | null | undefined) => {
        try {
          if (uid) {
            let data = await getChatList(uid);
            if (data) setChatListData(data);
          } else {
            throw new Error("invalid uid");
          }

        } catch (error) {
          console.log(error)
        }
      }
      fetchData(uid);

      return () => {
        !isActive
      }
    }, [])
  );

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: palette.white
    }}>
      <ChatHeader type="main" title={keywords.chats} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <MainChatList data={chatListData} />
      </ScrollView>
    </View>
  )
}

export default ChatMain;