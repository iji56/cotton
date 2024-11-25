import { Dimensions, Text, View } from "react-native"
import CMS from "./ChatMessage.styles";
import Avatar from "@/components/elements/Avatar";
import { baseUrl } from "@/features/auth/api/authSignUp";

const { width } = Dimensions.get('window')

type ChatMessageProps = {
  who: 'sender' | 'receiver';
  message: string;
  timeStamp: string;
  picture: string;
}
const ChatMessage = ({ who, message, timeStamp, picture }: ChatMessageProps) => {
  return (
    <View style={CMS.mainContainer}>
      {who === 'sender' ? (
        <View style={CMS.senderWrapper}>
          <View style={CMS.senderContainer}>
            <Text style={CMS.message}>{message}</Text>
          </View>
          <Text style={CMS.time}>{timeStamp}</Text>
        </View>
      ) : (
        <View style={CMS.receiverMainContainer}>
          <Avatar avatar={picture?.startsWith('http') ? picture : `${baseUrl}${picture}`} size={'xs'} />
          <View style={CMS.receiverWrapper}>
            <View style={CMS.receiverContainer}>
              <Text style={CMS.message}>{message}</Text>
            </View>
            <Text style={CMS.time}>{timeStamp}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default ChatMessage;