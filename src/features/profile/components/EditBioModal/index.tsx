import React, { useContext, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { SEBM } from './EditBioModal.styles';
import Wrapper from '@/components/Wrapper';
import { ProfileContext } from '../../context/ProfileContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { reduxDispatch, reduxSelect } from '@/types/reduxHooks';
import { usermetaUpdate } from '@/store/actions/usermetaActions';
import Avatar from '@/components/elements/Avatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import { updateProfile } from '../../api/updateProfile';
import Loader from '@/components/elements/Loader';
import { keywords } from '../../utils/keywords';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import Toast from 'react-native-toast-message';
import { imagePlaceHolder } from '@/features/feed/utils/keywords';

const EditBioModal = () => {

  const { modalVisible, setModalVisible } = useContext(ProfileContext);
  const dispatch = reduxDispatch();
  const user = reduxSelect(state => state.usermeta);
  const profilePicture = user.user_picture || imagePlaceHolder
  console.log("profilePicture : ", profilePicture)
  const [firstName, setFirstName] = useState(user.first_name);
  const [userName, setUserName] = useState(user.user_name);
  const [bio, setBio] = useState(user.bio);
  const [error, setError] = useState<null | string>(null);
  const [image, setImage] = useState(profilePicture)
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const closeModal = () => {
    setFirstName(user.first_name);
    setUserName(user.user_name);
    setBio(user.bio);
    setError(null);
    setModalVisible(false);
  }

  const handleSubmit = async (e: any) => {
    try {
      if (user.bio === bio && image.startsWith('http')) {
        errorToast("nothing to update")
        setModalVisible(false);
        return;
      }
      setLoading(true)
      const response = await updateProfile(user.id!, userName!, firstName!, bio!, image, !image.startsWith('https'));
      if (response.status) {
        console.log("image updaed resposne    ", response)
        setLoading(false)
        dispatch(usermetaUpdate({
          ...user,
          first_name: firstName,
          user_name: userName,
          bio: bio,
          user_picture: response.image!
        }));
        setError(null);
        setModalVisible(false);
      } else {
        setError(response.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log((error as Error).message)
      // setError((error as Error).message)
    }
  };

  const updateImage = async () => {
    try {
      const image = await launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: true,
      });

      if (!image.didCancel) {
        setImage(image.assets![0].uri!);
      }
    } catch (error) {
    }
  }

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: palette.white
    }}>
      <Modal
        isVisible={modalVisible}
        style={SEBM.backgroundContainer}
        propagateSwipe={true}
      >
        <View style={SEBM.mainContainer}>
          <View style={[SEBM.headerContainer, { marginTop: 20 }]}>
            <Wrapper>
              <View style={SEBM.flexContainer}>
                <TouchableOpacity style={SEBM.tertiaryButton} onPress={() => closeModal()}>
                  <Text>{keywords.cancel}</Text>
                </TouchableOpacity>
                <Text style={SEBM.title}>{keywords.editProfile}</Text>
                <TouchableOpacity style={SEBM.tertiaryButton} onPress={handleSubmit}>
                  <Text style={SEBM.tertiaryText}>{keywords.done}</Text>
                </TouchableOpacity>
              </View>
            </Wrapper>
          </View>
          {loading ? <Loader /> :
            <View style={SEBM.formContainer}>
              <Wrapper>
                <Text style={SEBM.errorMessage}>{error}</Text>
                <View style={SEBM.pictureContainer}>
                  <TouchableOpacity onPress={updateImage} style={SEBM.avatarContainer}>
                    <Avatar avatar={image} size='m' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={updateImage}>
                    <Text style={SEBM.inputButton}>{keywords.editProfilePicture}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={SEBM.inputContainer} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
                  <TextInput
                    style={SEBM.textInput}
                    value={firstName || ''}
                    onChangeText={setFirstName}
                    placeholder="Name"
                    editable={false}
                  />
                  <TextInput
                    style={SEBM.textInput}
                    value={userName || ''}
                    onChangeText={setUserName}
                    placeholder="Username"
                    editable={false}
                  />
                  <TextInput
                    style={SEBM.textInputLarge}
                    multiline={true}
                    maxLength={280}
                    value={bio || ''}
                    onChangeText={setBio}
                    placeholder="Bio"
                  />
                </ScrollView>
              </Wrapper>
            </View>
          }
        </View>
      </Modal>
      <Toast config={toastConfig} />
    </View>
  );
};

export default EditBioModal;