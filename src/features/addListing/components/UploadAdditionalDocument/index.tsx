import { palette } from "@/components/styles/theme";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { reduxSelect } from "@/types/reduxHooks";
import React, { useState } from "react";
import { UADS } from "./UploadAdditionalDocument.styles";
import { keywords } from "../../utils/keywords";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env'
import Button from "@/components/elements/Button/Button";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import ListingHeader from "../ListingHeader";
import useImagePicker from "@/components/elements/ImagePicker";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import H2 from "@/components/elements/H2";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const UploadAdditionalDocument = () => {
    const insets = useSafeAreaInsets();
    const imagePicker = useImagePicker();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const stripeID = reduxSelect(state => state.usermeta.stripe_account_id);
    const [loading, setLoading] = useState(false);

    const uploadDocument = async () => {
        console.log(imagePicker.selectedImagePath, "image file")
        if (imagePicker.selectedImagePath?.length === 0) {
            console.log("showing taost mesage")
            errorToast("Select any additional proof of address image")
            // return;
        } else {
            setLoading(true)
            try {

                const file = {
                    uri: imagePicker.selectedImagePath[0].path,
                    type: 'image/jpeg', // Update the MIME type accordingly
                    name: 'test-document.jpeg',
                };

                const formData = new FormData();

                formData.append("accountId", stripeID);
                formData.append("documentType", "additional_document")
                // Append file
                formData.append('file', file);

                console.log(formData, formData)

                const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/create-connect?action=upload-document`, {
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
                    errorToast(parsedData.error);
                    return
                }

                setLoading(false)
                navigation.navigate("CreateBankAccount", { showStep: true })
            } catch (error: any) {
                setLoading(false)
                console.log("Error uploading additional documents : ", error)
                errorToast(error?.message)
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
            <ListingHeader title={keywords.uploadDocument} headerType='additionalDocument' />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={UADS.flex1}>
                <ScrollView keyboardDismissMode="on-drag" style={UADS.flex1} showsVerticalScrollIndicator={false}>
                    <H2 text={keywords.addAdditionalDocumentMessage} style={UADS.title} />
                    <View>
                        <TouchableOpacity onPress={showImagePickerAlert} style={UADS.mediaContainer}>
                            {imagePicker.selectedImagePath?.length > 0 ?
                                <Image source={
                                    { uri: imagePicker.selectedImagePath[0].path }}
                                    style={UADS.image} /> :
                                <View style={UADS.buttonSubContainer}>
                                    <FontAwesomeIcon size={25} icon={faPlus} color={palette.black} />
                                    <Text style={UADS.text}>{keywords.addPhotoVideo.split('/')[0]} </Text>
                                </View>
                            }
                        </TouchableOpacity>
                        <Text style={[UADS.text, { paddingBottom: '15%' }]}>{keywords.uploadAdditionalDocumentInstructions}</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={UADS.bottomButton}>
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

export default UploadAdditionalDocument;