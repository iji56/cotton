import { Text, TouchableOpacity, View } from 'react-native';
import { SCH } from './ChatHeader.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Wrapper from '@/components/Wrapper';
import H1 from '@/components/elements/H1';
import { palette } from '@/components/styles/theme';
import Avatar from '@/components/elements/Avatar';
import IconButton from '@/components/elements/Button/IconButton';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';

type ChatHeaderProps = {
  type: 'main' | 'single';
  title?: string;
  details?: {
    chatID: string;
    receiverName: string;
    picture: string | null;
  };
  onIconPressed?: () => void;
}

const ChatHeader = ({ type, title, details, onIconPressed }: ChatHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const name = details?.receiverName ?? 'user';

  return (
    <View style={SCH.mainContainer}>
      {type === 'main' ? (
        <Wrapper>
          <View style={SCH.flexParent}>
            {/* <TouchableOpacity
              style={SCH.backButton}
              onPress={() => navigation.navigate('ChatMain')}>
              <FontAwesomeIcon icon={faArrowLeft} color={palette.black} size={20} />
            </TouchableOpacity> */}
            <H1 text={title!} style={SCH.header} />
          </View>
        </Wrapper>
      ) : (
        <Wrapper>
          <View style={SCH.container}>
            <View style={SCH.flexParent}>
              <TouchableOpacity
                style={SCH.backButton}
                onPress={() => navigation.navigate('ChatMain')}>
                <FontAwesomeIcon icon={faArrowLeft} color={palette.black} size={20} />
              </TouchableOpacity>
              <H1 text={name} style={SCH.header} />
            </View>
            <View style={SCH.button}>
              <TouchableOpacity onPress={() => { }}>
                <Avatar avatar={details?.picture!} size={'xs'} />
              </TouchableOpacity>
              <IconButton icon={faEllipsisV} onPress={onIconPressed ? onIconPressed : () => { }} />
            </View>
          </View>
        </Wrapper>
      )}
    </View>
  );
};

export default ChatHeader;
