import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import H1 from '@/components/elements/H1';
import { keywords } from '../../utils/keywords';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Controller, useForm } from "react-hook-form";
import useImagePicker from '@/components/elements/ImagePicker';
import TextField from '@/components/elements/Forms/TextField';
import { SUS } from './SignUp.styles';
import { supabase } from '@/lib/supabase';
import { normalizeWhitespaces } from '@/utils/formSanitization';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { faPencil, } from "@fortawesome/sharp-light-svg-icons";
import { faCamera } from "@fortawesome/pro-light-svg-icons";
import Button from '@/components/elements/Button/Button';
import { PropType } from '../../types/usermetaReducerType';
import { ModalContext } from '../../context/ModalContext';

type FormPropType = {
    username: string;
    name: string;
}

const SignUpDetail = ({ index, setIndex }: PropType) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { setImage, setUsername, setName } = useContext(ModalContext);
    const imagePicker = useImagePicker();
    const [isFocused, setIsFocused] = useState({
        username: false,
        name: false
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        setError,
        clearErrors,
        watch,
    } = useForm({
        defaultValues: {
            image: null,
            username: '',
            name: ''
        },
    });

    const checkUsernameTaken = async (username: string): Promise<void> => {
        try {
            const { data, error } = await supabase
                .from('user_meta')
                .select('user_name')
                .eq('user_name', username)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setError('username', { type: 'custom', message: 'Username is already taken' });
            } else {
                clearErrors('username');
            }
        } catch (error) {
        }
    };

    const debounce = <F extends (...args: any[]) => void>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
        let timeout: ReturnType<typeof setTimeout> | null = null;

        return (...args: Parameters<F>): void => {
            const later = () => {
                timeout = null;
                func(...args);
            };

            if (timeout !== null) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(later, wait);
        };
    };

    const debouncedCheckUsernameTaken = debounce(checkUsernameTaken, 300);

    const nextPage = async (formData: FormPropType) => {
        let payload = {
            userImage: imagePicker.selectedImagePath[0],
            username: normalizeWhitespaces(formData.username),
            name: normalizeWhitespaces(formData.name),
            //   gender: gender,
        }
        setImage(imagePicker.selectedImagePath[0]);
        setUsername(normalizeWhitespaces(formData.username))
        setName(normalizeWhitespaces(formData.name))
        setIndex(index + 1)
    }


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

    return (
        <View style={SUS.mainContainer}>
            <H1 text={keywords.enterPersonalDetail} style={SUS.headerTitle} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardDismissMode='on-drag'>
                <TouchableOpacity style={SUS.profileImage} onPress={showImagePickerAlert}>
                    {imagePicker.selectedImagePath.length > 0 ?
                        <Image source={{ uri: imagePicker.selectedImagePath[0].sourceURL || imagePicker.selectedImagePath[0].path }} style={SUS.userImage} /> :
                        <FontAwesomeIcon icon={faCamera} size={25} />
                    }
                </TouchableOpacity>
                {imagePicker.selectedImagePath.length > 0 &&
                    <TouchableOpacity style={SUS.editButton} onPress={showImagePickerAlert}>
                        <FontAwesomeIcon icon={faPencil} />
                    </TouchableOpacity>}
                <Text style={SUS.error}>{errors?.image?.message || ''}</Text>
                <View style={SUS.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[SUS.textInputContainer, { borderWidth: isFocused.username ? 1 : 0 }]}>
                                {isFocused.username && <Text style={SUS.label}>{keywords.username}</Text>}
                                <TextField
                                    value={value ?? ''}
                                    placeholder={keywords.usernamePlaceholder}
                                    onChangeText={(text) => {
                                        onChange(text.trim()); // Update the form value
                                        debouncedCheckUsernameTaken(text); // Check if username is taken
                                    }}
                                    onBlur={() => {
                                        setIsFocused({ ...isFocused, username: false })
                                        onBlur()
                                    }}
                                    onFocus={() => setIsFocused({ ...isFocused, username: true })}

                                    style={[SUS.textInput, { height: isFocused.username ? 40 : 50 }]}
                                    autoCapitalize={'none'}
                                />
                            </View>
                        )}
                        name="username"
                    />
                    <Text style={SUS.error}>{errors?.username?.message || ''}</Text>
                </View>

                <View style={SUS.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true, }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={[SUS.textInputContainer, { borderWidth: isFocused.name ? 1 : 0 }]}>
                                {isFocused.name && <Text style={SUS.label}>{keywords.name}</Text>}
                                <TextField
                                    value={value ?? ''}
                                    placeholder={keywords.namePlaceholder}
                                    onChangeText={onChange}
                                    onBlur={() => {
                                        setIsFocused({ ...isFocused, name: false })
                                        onBlur()
                                    }}
                                    onFocus={() => setIsFocused({ ...isFocused, name: true })}
                                    style={[SUS.textInput, { height: isFocused.name ? 40 : 50 }]}
                                    autoCapitalize={'none'}
                                />
                            </View>
                        )}
                        name="name"
                    />
                    <Text style={SUS.error}>{errors?.name?.message || ''}</Text>
                </View>
            </ScrollView>
            {(!isFocused.name && !isFocused.username) &&
                <View style={SUS.submissionContainer}>
                    <View style={SUS.button}>
                        <Button text={keywords.next}
                            onPress={() => {
                                if (control.getFieldState('username').invalid) {
                                    setError("username", { message: "Username is missing" })
                                    clearErrors('name');
                                } else if (control.getFieldState('name').invalid) {
                                    setError("name", { message: "Name is missing" })
                                    clearErrors('username');
                                } else if (imagePicker.selectedImagePath.length === 0) {
                                    setError("image", { message: "Image is missing" })
                                } else {
                                    clearErrors();
                                    handleSubmit(nextPage)();
                                }
                            }}
                            variant="main" />
                    </View>
                </View>
            }
        </View>
    )
}

export default SignUpDetail