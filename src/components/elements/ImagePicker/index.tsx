import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { PERMISSIONS, PermissionStatus, check, openSettings } from 'react-native-permissions';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import { grantCameraPermission, grantGallaryPermission } from '@/utils/permissions';
import { keywords } from './keyword';

const useImagePicker = () => {
    const [selectedImagePath, setSelectedImagePath] = useState<Image[]>([]);

    const openGallary = async (type?: 'photo' | 'video' | 'any', maxFiles?: number) => {
        let status: PermissionStatus;
        status = Platform.OS === 'android' ?
            await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES) :
            await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (status === 'denied' || status === 'blocked') {
            await grantGallaryPermission().then(status => {
                if (status) {
                    // open picker after getting permission
                    ImagePicker.openPicker({
                        mediaType: type ?? 'photo',
                        width: 300,
                        height: 400,
                        cropping: false,
                        multiple: true,
                        maxFiles: maxFiles ?? 5
                    }).then(images => {
                        setSelectedImagePath(images);
                    }).catch(error => {
                    })
                } else {
                    Alert.alert(
                        keywords.libraryPermissionRequired,
                        keywords.libraryPermission,
                        [
                            {
                                text: keywords.later,
                            },
                            {
                                text: keywords.setting,
                                onPress: () => {
                                    openSettings();
                                },
                            },
                        ],
                    );
                }
            })
        } else {
            ImagePicker.openPicker({
                mediaType: type ?? 'photo',
                width: 300,
                height: 400,
                cropping: false,
                multiple: true,
                maxFiles: maxFiles ?? 5
            }).then(images => {
                setSelectedImagePath(images);
            }).catch(error => {
                console.log("Error getting image : ", error)
            })
        }
    }

    const openCamera = async (type?: 'photo' | 'video' | 'any', maxFiles?: number) => {
        let status: PermissionStatus;
        status = Platform.OS === 'android' ?
            await check(PERMISSIONS.ANDROID.CAMERA) :
            await check(PERMISSIONS.IOS.CAMERA);
        if (status === 'denied' || status === 'blocked') {
            await grantCameraPermission().then(status => {
                if (status) {
                    // open camera after getting permission
                    ImagePicker.openCamera({
                        mediaType: type ?? 'photo',
                        width: 300,
                        height: 400,
                        cropping: false,
                        multiple: true,
                        maxFiles: maxFiles ?? 5
                    }).then(image => {
                        let oldImages = [image]
                        setSelectedImagePath(oldImages);
                    }).catch(error => {
                    })
                } else {
                    Alert.alert(
                        keywords.cameraPermissionRequired,
                        keywords.cameraPermission,
                        [
                            {
                                text: keywords.later,
                            },
                            {
                                text: keywords.setting,
                                onPress: () => {
                                    openSettings();
                                },
                            },
                        ],
                    );
                }
            })
        } else {
            ImagePicker.openCamera({
                mediaType: type ?? 'photo',
                width: 300,
                height: 400,
                cropping: false,
                multiple: true,
                maxFiles: maxFiles ?? 5
            }).then(image => {
                let oldImages = [image]
                setSelectedImagePath(oldImages);
            }).catch(error => {
            })
        }
    }

    return {
        selectedImagePath,
        openGallary,
        openCamera,
        setSelectedImagePath,
    };
};

export default useImagePicker;

