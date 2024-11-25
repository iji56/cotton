import { Alert, NativeSyntheticEvent, TextInput, TextInputContentSizeChangeEventData, TouchableOpacity, View } from 'react-native';
import { SCF } from './ChatForm.styles';
import { supabase } from '@/lib/supabase';
import React, { useContext, useState } from 'react';
import { reduxSelect } from '@/types/reduxHooks';
import Wrapper from '@/components/Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ChatContext } from '../../context/ChatContext';
import { faCamera, faPaperPlaneAlt } from '@fortawesome/pro-solid-svg-icons';
import { keywords } from '../../utils/keywords';
import useImagePicker from '@/components/elements/ImagePicker';

type Props = {
  chatID: string | null;
};

const ChatForm = ({ chatID }: Props) => {
  const { error, setError } = useContext(ChatContext);
  const imagePicker = useImagePicker();
  const user_id = reduxSelect(state => state.auth.uid);
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const showImagePickerAlert = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to select an image',
      [
        {
          text: 'Camera',
          onPress: () => {
            imagePicker.openCamera();
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            imagePicker.openGallary();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };
  // data does not need returning since Chat is subscribed via WebSocket
  const sendMessage = async (text: string) => {
    if (text) {
      console.log("user id : ", user_id)
      try {
        const { data, error } = await supabase.from('chat_messages').insert({
          chat_room_id: chatID,
          message_body: text,
          user_id: user_id,
        });

        if (error) throw new Error((error).message);

      } catch (error) {
        console.error("Error sending message : ", (error as Error).message);
        setError('could not send message. Try again later')
        setTimeout(() => {
          setError('')
        }, 1000)
      }
    }
  };

  const submitMessage = () => {
    setError('');
    sendMessage(text);
    setText('');
  };

  return (
    <View style={SCF.mainContainer}>
      <Wrapper>
        <View style={SCF.flexContainer}>
          <TouchableOpacity
            onPress={showImagePickerAlert}
            style={SCF.buttonInput}
          >
            <FontAwesomeIcon icon={faCamera} style={SCF.buttonInputContent} size={20} />
          </TouchableOpacity>
          <View style={SCF.inputContainer}>
            <TextInput
              style={SCF.textInput}
              multiline
              placeholder={keywords.message}
              onChangeText={setText}
              value={text}
              onContentSizeChange={handleContentSizeChange}
            />
          </View>
          <TouchableOpacity
            onPress={() => submitMessage()}
            style={SCF.buttonInput}
          >
            <FontAwesomeIcon icon={faPaperPlaneAlt} style={SCF.buttonInputContent} size={20} />
          </TouchableOpacity>
        </View>
        <View style={{height: 20}}/>
      </Wrapper>
    </View>
  );
};

export default ChatForm;
