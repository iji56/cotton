import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import ChatHeader from '../../components/ChatHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../../../../components/styles/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getMessage } from '../../api/getMessage';
import { reduxSelect } from '../../../../types/reduxHooks';
import { supabase } from '../../../../lib/supabase';
import ChatForm from '../../components/ChatForm';
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { SCS } from './ChatSingle.style';
import { formatTime } from '@/utils/formatDate';
import { ChatRouteType } from '../../types/chatSingle';
import { ChatContext } from '../../context/ChatContext';
import Toast from 'react-native-toast-message';
import { errorToast, successToast, toastConfig } from '@/lib/toastConfig';
import ChatMessage from '../../components/ChatMessage';
import { keywords } from '../../utils/keywords';
import BottomSheets from '@/components/elements/BottomSheet';
import { reportLists } from '@/features/profile/utils/keywords';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import TextField from '@/components/elements/Forms/TextField';
import Button from '@/components/elements/Button/Button';
import { placeholderPicture } from '@/features/borrow/utils/staticTexts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { blockUser } from '@/features/feed/api/blockUser';
import { unblockUser } from '@/features/feed/api/unblockUser';

const ChatSingle = ({ route }: ChatRouteType) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { chatID, receiverName, picture, receiverId } = route.params;
  const userID = reduxSelect(state => state.auth.uid);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedReportText, setSelectedReportText] = useState('');
  const [snapPoint, setSnapPoint] = useState<number | string>(1);
  const ref = useRef<any>();

  //Create a function to handle inserts
  const handleInserts = (payload: any) => {
    const newMessage = payload.new;
    console.log('new message : ', newMessage);
    const formattedMessage = {
      id: newMessage.id,
      text: newMessage.message_body,
      sender: newMessage.user_id,
      created_at: newMessage.created_at,
    };
    setMessages(prevMessages => [...prevMessages, formattedMessage]);
  };

  // subscribe to supabase chat_messages table for any change
  useEffect(() => {
    try {
      console.log('subscribed to message listeneres...');
      supabase
        .channel('chat_messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages' },
          handleInserts,
        )
        .subscribe((status, error) => {
          console.log(
            'postgres_changes chat_messages subscription status : ',
            status,
          );
          console.log('error : ', error);
        });
    } catch (error) {
      console.log('error in subscribing to chats listeners: ', error);
    }
  }, []);

  // Get the latest messages when the user returns focus to screen
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          let messagesData = await getMessage(chatID);

          if (messagesData) {
            const formattedMessages = messagesData.map(msg => ({
              id: msg.id,
              text: msg.message_body,
              sender: msg.user_id,
              created_at: msg.created_at,
            }));
            setMessages(formattedMessages);
            setError('');
          }
        } catch (error) {
          console.error('Error getting messges : ', error);
          setError('could not load messages');
          setTimeout(() => {
            setError('');
          }, 1000);
        }
      };
      fetchData();
    }, []),
  );

  // Keyboard scroll functionality
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // error notification
  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'error',
      text2: error,
      topOffset: 100,
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    if (error) showToast();
  }, [error]);

  const handleIconPressed = () => {
    handleBottomSheet();
  };

  const handleReport = () => {
    handleBottomSheet('80%');
    successToast(keywords.reportMessage);
  };

  const handleBottomSheet = (number?: string) => {
    setSnapPoint(number || '25%');
    ref.current?.snapToIndex(1);
  };

  const handleReportUser = () => {
    handleBottomSheet('70%');
  };

  const handleRestriction = () => {
    if (restricted) {
      successToast(keywords.restrictMessage);
    } else {
      successToast(keywords.unrestrictMessage);
    }
    handleBottomSheet('1%');
    setRestricted(!restricted);
  };
  const handleBlockUser = () => {
    handleBottomSheet('65%');
  };

  const handleSelectReport = (value: string) => {
    setSelectedReport(value);
  };

  const handleBlock = async () => {
    handleBottomSheet('1%');
    if (blocked) {
      const response = await unblockUser(userID!, receiverId);
      if (response?.startsWith('Error')) {
        errorToast(response);
      } else {
        successToast(`${receiverName}${keywords.unblockMessage}`);
      }
    } else {
      const response = await blockUser(userID!, receiverId);
      if (response?.startsWith('Error')) {
        errorToast(response);
      } else {
        successToast(`${receiverName}${keywords.blockMessage}`);
      }
    }
    setBlocked(!blocked);
  };

  const handleDelete = () => {
    // delete chat room
    successToast(`${keywords.deletedMessages}${receiverName}`);
    handleBottomSheet('1%');
    setTimeout(() => {
      navigation.goBack();
    }, 3000);
  };

  const handleBlockAndReport = () => {
    // call block and report api
    setBlocked(true);
    handleBottomSheet('1%');
    successToast(`${receiverName}${keywords.blockMessage}`);

    setTimeout(() => {
      successToast(keywords.reportMessage);
    }, 3000);
  };

  return (
    <ChatContext.Provider value={{ error, setError }}>
      <View
        style={{
          flex: 1,
          backgroundColor: palette.white,
          paddingTop: insets.top,
        }}>
        <ChatHeader
          type="single"
          details={{ chatID, receiverName, picture }}
          onIconPressed={handleIconPressed}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 10}
          style={{
            flex: 1,
          }}>
          <ScrollView
            style={SCS.chatParent}
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd();
            }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag">
            {/* <Text style={SCS.subtitle}>welcome to your chat with {receiverName}.</Text> */}
            {messages.map(message => {
              let timeStamp = '';
              if (message.created_at) {
                timeStamp = formatTime(message.created_at);
                timeStamp;
              }

              return (
                <ChatMessage
                  who={message.sender !== userID ? 'receiver' : 'sender'}
                  message={message.text}
                  timeStamp={timeStamp}
                  picture={picture}
                  key={message.id}
                />
              );
            })}
          </ScrollView>
          {!blocked ? (
            <ChatForm chatID={chatID} />
          ) : (
            <View style={{ borderTopWidth: 1, borderColor: palette.lightGrey }}>
              <Text style={[SCS.heading, { textAlign: 'center' }]}>
                You blocked this account
              </Text>
              <Text
                style={[SCS.itemText, { textAlign: 'center', marginTop: -5 }]}>
                You can't message {receiverName}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: 40,
                  width: '80%',
                  alignSelf: 'center',
                  justifyContent: 'space-evenly',
                  marginVertical: 10,
                }}>
                <Button
                  text={keywords.unblock}
                  onPress={handleBlock}
                  variant="main"
                  style={{ flex: 0.46 }}
                />
                <Button
                  text={keywords.delete}
                  onPress={handleDelete}
                  variant="secondary"
                  style={{ flex: 0.46, borderColor: palette.red }}
                  buttonTextColor={palette.red}
                />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>

        <BottomSheets
          snapPoint={snapPoint}
          setSnapPoint={setSnapPoint}
          bottomSheetRef={ref}
          handleSheetChanges={(index: number) => {}}>
          {snapPoint === '25%' ? (
            <View>
              <TouchableOpacity style={SCS.button} onPress={handleRestriction}>
                <Text style={SCS.buttonText}>
                  {restricted ? keywords.unrestrict : keywords.restrict}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={SCS.button} onPress={handleBlockUser}>
                <Text style={SCS.buttonText}>
                  {blocked ? keywords.unblock : keywords.block}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[SCS.button, { borderBottomWidth: 0 }]}
                onPress={handleReportUser}>
                <Text style={SCS.buttonText}>{keywords.report}</Text>
              </TouchableOpacity>
            </View>
          ) : snapPoint === '70%' ? (
            <FlatList
              data={reportLists}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={
                <Text style={SCS.heading}>
                  {keywords.reasonToReportAccount}
                </Text>
              }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  style={[SCS.item, { borderTopWidth: index === 0 ? 0.3 : 0 }]}
                  onPress={() => handleSelectReport(item.value)}>
                  <Checkbox
                    label=""
                    isChecked={selectedReport === item.value}
                    onClick={() => handleSelectReport(item.value)}
                    borderRadius={20}
                  />
                  <Text style={SCS.itemText}>{item?.label}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <>
                  {selectedReport === 'Other' && (
                    <TextField
                      value={selectedReportText}
                      onChangeText={setSelectedReportText}
                      placeholder={keywords.reasonPlaceholder}
                      multiline
                      style={SCS.input}
                    />
                  )}
                  <View style={SCS.bottomButton}>
                    <Button
                      text={keywords.submit}
                      onPress={handleReport}
                      variant="main"
                    />
                  </View>
                </>
              }
            />
          ) : snapPoint === '65%' ? (
            <View style={SCS.blockContainer}>
              <Image
                source={{ uri: picture || placeholderPicture }}
                style={SCS.image}
              />
              <Text style={[SCS.heading, { textAlign: 'center' }]}>
                {keywords.block} {receiverName}?
              </Text>
              <Text style={SCS.label}>
                {keywords.theyWouldNotAbleToSendMessage}
              </Text>
              <Text style={SCS.label}>{keywords.theirListingWontShow}</Text>
              <Text style={SCS.label}>{keywords.youCanUnblock}</Text>
              <Text style={[SCS.label, { fontWeight: '600' }]}>
                {keywords.settingsBlockedAccounts}
              </Text>
              <View style={SCS.bottomButton}>
                <Button
                  text={blocked ? keywords.unblock : keywords.block}
                  onPress={handleBlock}
                  variant="main"
                />
              </View>
              <View style={[SCS.bottomButton, { marginTop: -5 }]}>
                <Button
                  text={keywords.blockAndReport}
                  onPress={handleBlockAndReport}
                  variant="secondary"
                  style={{ borderWidth: 0 }}
                  buttonTextColor={palette.red}
                />
              </View>
            </View>
          ) : (
            <View style={SCS.blockContainer}>
              <Text style={SCS.heading}>
                {keywords.thanksWeReceivedYourReport}
              </Text>
              <View style={SCS.blockBody}>
                <Text style={SCS.heading}>
                  {keywords.youCanBlock} {receiverName}
                </Text>
                <Image
                  source={{ uri: picture || placeholderPicture }}
                  style={SCS.image}
                />
                <Text style={[SCS.heading, { textAlign: 'center' }]}>
                  {keywords.block} {receiverName}?
                </Text>
                <Text style={SCS.label}>
                  {keywords.theyWouldNotAbleToSendMessage}
                </Text>
                <Text style={SCS.label}>{keywords.theirListingWontShow}</Text>
                <Text style={SCS.label}>{keywords.youCanUnblock}</Text>
                <Text style={[SCS.label, { fontWeight: '600' }]}>
                  {keywords.settingsBlockedAccounts}
                </Text>
                <View style={SCS.bottomButton}>
                  <Button
                    text={blocked ? keywords.unblock : keywords.block}
                    onPress={handleBlock}
                    variant="main"
                  />
                </View>
              </View>
            </View>
          )}
        </BottomSheets>
        <Toast config={toastConfig} />
      </View>
    </ChatContext.Provider>
  );
};

export default ChatSingle;
