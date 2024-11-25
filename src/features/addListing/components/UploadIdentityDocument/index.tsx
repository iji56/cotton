import { palette } from "@/components/styles/theme";
import { Alert, Dimensions, Image as ImageView, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { reduxSelect } from "@/types/reduxHooks";
import React, { useEffect, useState } from "react";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env'
import Button from "@/components/elements/Button/Button";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import ListingHeader from "../ListingHeader";
import useImagePicker from "@/components/elements/ImagePicker";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import H2 from "@/components/elements/H2";
import { keywords } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { SUID } from "./UploadIdentityDocument.styles";
import { Image } from "react-native-image-crop-picker";

const UploadIdentityDocument = () => {
    const insets = useSafeAreaInsets();
    const imagePicker = useImagePicker();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const stripeID = reduxSelect(state => state.usermeta.stripe_account_id);
    const [frontImage, setFrontImage] = useState<Image | null>(null);
    const [backImage, setBackImage] = useState<Image | null>(null);
    const [selectedImageType, setSelectedImageType] = useState<'front' | 'back'>('front');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedImageType === 'front') {
            setFrontImage(imagePicker.selectedImagePath[0])
        } else {
            setBackImage(imagePicker.selectedImagePath[0])
        }
    }, [imagePicker.selectedImagePath]);

    const uploadDocument = async () => {
        if (imagePicker.selectedImagePath?.length === 0) {
            errorToast("Select identify image");
            // return;
        } else if (!frontImage || !backImage) {
            errorToast("Select both front and back image");
        } else {
            setLoading(true)
            try {
                const frontFile = {
                    uri: frontImage.path,
                    type: 'image/jpeg',
                    name: 'test-document.jpeg',
                };

                const backFile = {
                    uri: backImage.path,
                    type: 'image/jpeg',
                    name: 'test-document.jpeg',
                };

                const formData = new FormData();

                formData.append("accountId", stripeID);
                formData.append('frontFile', frontFile);
                formData.append('backFile', backFile);

                const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-connect?action=upload_identity_document`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                    body: formData,
                });
                const parsedData: any = await response.json();
                console.log("parsed data : ", parsedData)

                if (parsedData?.error) {
                    setLoading(false)
                    errorToast(parsedData?.error || "Could not add account try again");
                    return
                }

                navigation.navigate("UploadAdditionalDocument")
                setLoading(false)

            } catch (error: any) {
                setLoading(false)
                errorToast(error?.message || "Could not add account try again");
                console.log("Error creating new payment : ", error)
            }
        }
    }

    const showImagePickerAlert = () => {
        Alert.alert(
            'Select Image',
            'Choose an option to select an image',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        imagePicker.openCamera('photo', 1);
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        imagePicker.openGallary('photo', 1);
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );
    }
    const { height } = Dimensions.get('window')
    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white,
            }}
        >
            <ListingHeader title={keywords.uploadDocument} headerType='identityDocument' />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={SUID.flex1}>
                <ScrollView keyboardDismissMode="on-drag" style={{ height: height }} showsVerticalScrollIndicator={false}>
                    <H2 text={keywords.addDocumentMessage} style={SUID.title} />
                    <View>
                        <H2 text={keywords.frontImage} style={{ marginTop: 20, marginLeft: 20 }} />
                        <TouchableOpacity onPress={() => {
                            setSelectedImageType('front');
                            showImagePickerAlert()
                        }} style={SUID.mediaContainer}>
                            {frontImage ?
                                <ImageView source={
                                    { uri: frontImage?.path }}
                                    style={SUID.image} /> :
                                <View style={SUID.buttonSubContainer}>
                                    <FontAwesomeIcon size={25} icon={faPlus} color={palette.black} />
                                    <Text style={SUID.text}>{keywords.addFrontImage} </Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <View>
                        <H2 text={keywords.backImage} style={{ marginTop: 5, marginLeft: 20 }} />
                        <TouchableOpacity onPress={() => {
                            setSelectedImageType('back');
                            showImagePickerAlert()
                        }} style={SUID.mediaContainer}>
                            {backImage ?
                                <ImageView source={
                                    { uri: backImage?.path }}
                                    style={SUID.image} /> :
                                <View style={SUID.buttonSubContainer}>
                                    <FontAwesomeIcon size={25} icon={faPlus} color={palette.black} />
                                    <Text style={SUID.text}>{keywords.addBackImage} </Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={[SUID.text, {paddingBottom: '15%'}]}>{keywords.uploadDocumentInstructions}</Text>

                </ScrollView>
            </KeyboardAvoidingView>
            <View style={SUID.bottomButton}>
                <Button text={keywords.continue}
                    onPress={uploadDocument}
                    variant="main"
                    style={{ width: '50%' }}
                    loading={loading}
                />
            </View>
            <Toast config={toastConfig} />
        </View>
    )
}

export default UploadIdentityDocument;