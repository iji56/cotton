import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { SMCC } from './MainChatCard.style';
import Wrapper from '@/components/Wrapper';
import Avatar from '@/components/elements/Avatar';
import { baseUrl } from '@/features/auth/api/authSignUp';

const { width } = Dimensions.get('window');

type ChatCardProps = {
  chatID: null | string;
  name: null | string;
  picture: null | string;
  message: null | string;
  receiverId?: string;
  elapsedTime: null | string;
  last: boolean;
  sender: boolean;
  status?: string;
  duration?: string;
  read?: boolean;
};

const MainChatCard = ({
  chatID,
  name,
  message,
  receiverId,
  elapsedTime,
  picture,
  last,
  sender,
  status,
  duration,
  read,
}: ChatCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const receiverName = name ?? 'user';
  const messagePreview = message ?? 'send a message';
  return (
    <TouchableOpacity
      style={[SMCC.button, { borderBottomWidth: last ? 0 : 1 }]}
      onPress={() =>
        navigation.navigate('ChatSingle', {
          chatID,
          receiverName,
          picture,
          receiverId,
        })
      }>
      <Wrapper>
        <View style={SMCC.mainContainer}>
          <View style={SMCC.avatarContainer}>
            <Avatar
              avatar={
                picture?.startsWith('http') ? picture : `${baseUrl}${picture}`
              }
              size="s"
            />
          </View>
          <View style={SMCC.content}>
            <View style={SMCC.name}>
              <Text style={[SMCC.title, { fontWeight: read ? '400' : '600' }]}>
                {receiverName}
              </Text>
              <Text style={SMCC.meta}>{elapsedTime}</Text>
            </View>
            <Text
              style={[
                SMCC.meta,
                {
                  fontWeight: read || sender ? '400' : '600',
                  width: width * 0.7,
                },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {messagePreview}
            </Text>
            {/* {!status && <Text style={SMCC.status}>{status ?? 'Request pending'} | {duration ?? 'Aug 6-15'}</Text>} */}
          </View>
        </View>
      </Wrapper>
    </TouchableOpacity>
  );
};

export default MainChatCard;
