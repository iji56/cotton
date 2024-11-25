import { SMCL } from "./MainChatList.style";
import MainChatCard from "../MainChatCard";
import { Image, Text, View } from "react-native";
import { reduxSelect } from "../../../../types/reduxHooks";
import { ChatMainProps, ProfilePictureType } from "../../types/chatMain";
import { timeSince } from "@/utils/formatDate";
import { normalizeWhitespaces } from "@/utils/formSanitization";
import { keywords } from "../../utils/keywords";

const MainChatList = ({ data }: ChatMainProps) => {
  let currentUser = reduxSelect((state) => state.usermeta.user_name);
  let userId = reduxSelect((state) => state.usermeta.id);

  const getValidImage = (images: ProfilePictureType[]) => {
    // Find the first image that starts with 'https'
    const httpsImage = images.find(img => img.url_path!.startsWith('https'));

    // If found, return it; otherwise, return the last image
    return httpsImage ? httpsImage.url_path : images.slice(-1)[0]?.url_path;
  };

  return (
    <View style={SMCL.container}>
      {data.length > 0 ? data.map((item, index) => {

        const chatUser = item.usermeta_a.user_name === currentUser
          ? item.usermeta_b.user_name
          : item.usermeta_a.user_name;
        const name = chatUser || 'unknown user';

        const picture = item.usermeta_a.user_name === currentUser
          ? getValidImage(item.usermeta_b?.images!)
          : getValidImage(item.usermeta_a?.images!);

        const message = item.newest_message?.[0]?.message_body || ''

        const sender = item.newest_message?.[0]?.user_id === userId;

        let elapsedTime = '';

        if (item.newest_message?.[0]?.created_at) {
          elapsedTime = timeSince(item.newest_message[0].created_at);
        }
        return <MainChatCard chatID={item.id} name={name} message={message} key={index} elapsedTime={elapsedTime} picture={picture} last={index === data.length - 1} sender={sender} />
      }) :
        <View style={SMCL.inputContainer}>
          <Image
            source={require('../../assets/chatImg.png')}
            style={SMCL.image}
          />
          <Text style={SMCL.descriptionText}>
            {keywords.noChat}
          </Text>
        </View>}
    </View>
  )
}

export default MainChatList;