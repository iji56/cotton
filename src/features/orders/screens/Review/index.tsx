import { Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import OrdersHeader from '../../components/OrdersHeader';
import { keywords } from '../../utils/keywords';
import ListingItem from '../../components/ListingItem';
import H2 from '@/components/elements/H2';
import SR from './Review.styles';
import { reduxSelect } from '@/types/reduxHooks';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Button from '@/components/elements/Button/Button';
import { fontScale } from '@/utils/fontScale';
import TextField from '@/components/elements/Forms/TextField';
import { faCamera, faCircleX } from '@fortawesome/pro-regular-svg-icons';
import { getUserData } from '../../api/getUserData';
import { saveReview } from '../../api/review';
import Toast from 'react-native-toast-message';
import { errorToast, toastConfig } from '@/lib/toastConfig';
import { uploadUserImage, uploadVideo } from '../../api/uploadImageVideo';
import useImagePicker from '@/components/elements/ImagePicker';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Review = ({ route }: any) => {
    const currentUser = reduxSelect(state => state.usermeta.id);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const imagePicker = useImagePicker()
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [userDetail, setUserDetail] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const listing = route.params.listingData ?? null;
    const order = route.params.orderData ?? null;
    const picture = 'https://placecage.vercel.app/placecage/g/200/300';


    useEffect(() => {

        const getUserDetail = async () => {
            const response = await getUserData(!order?.cp_id ?
                currentUser === order.owner_id ? order?.purchaser_id : order.owner_id :
                currentUser === order.borrower_id ? order?.lender_id : order.borrower_id);
            setUserDetail(response[0]);
        };

        getUserDetail()
    }, []);

    const showImagePickerAlert = () => {
        Alert.alert(
            'Select Image',
            'Choose an option to select an image',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        imagePicker.openCamera('any', 1);
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        imagePicker.openGallary('any', 1);
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

    const handleRating = (rating: number) => {
        setRating(rating)
    }

    const handleSubmit = async () => {
        if (title.length === 0 || review.length === 0) {
            errorToast(keywords.addReviewError)
        } else if (imagePicker.selectedImagePath?.length === 0) {
            errorToast(keywords.emptyImageError)
        } else {
            setLoading(true)
            let fileType: 'video' | 'image' = imagePicker.selectedImagePath[0].mime.split('/')[0] === 'video' ? 'video' : 'image';

            let response = fileType === 'image' ?
                await uploadUserImage(imagePicker.selectedImagePath[0].path, currentUser!) :
                await uploadVideo(imagePicker.selectedImagePath[0].path, currentUser!)
            if (response) {
                await saveReview(
                    order.listing_id,
                    order.borrower_id ?? order.purchaser_id,
                    order.lender_id ?? order.owner_id,
                    // 1 => borrower to item
                    // 2 => lender to borrower
                    // 3 => seller to buyer
                    // 4 => buyer to item
                    currentUser === order?.borrower_id ? 1 :
                        currentUser === order?.lender_id ? 2 :
                            currentUser === order?.owner_id ? 3 : 4,
                    title,
                    review,
                    // if user selected video
                    fileType !== 'image' ? response : '',
                    // if user selected image
                    fileType === 'image' ? response : '',
                    rating
                );
                setLoading(false)
                navigation.navigate('OrdersMain');
            } else {
                setLoading(false)
                console.log("Image or video not savedd : ", response)
            }
        }
    }

    const renderStar = ({ item }: { item: number }) => {
        return (
            <TouchableOpacity onPress={() => handleRating(item)}>
                <FontAwesomeIcon icon={faStar} size={20} color={rating >= item ? palette.yellow : palette.darkGrey} style={[SR.star]} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <OrdersHeader headerTitle={keywords.review} redirect={'OrdersMain'} back={true} />
            <ScrollView contentContainerStyle={SR.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={SR.infoCard}>
                    <View style={SR.listingContainer}>
                        <ListingItem itemData={{
                            image: order?.image_url,
                            name: listing?.listing_name,
                            type: listing?.brand,
                            size: listing?.size
                        }} />
                    </View>

                    <H2 text={!order?.cp_id ?
                        currentUser === order.owner_id ? keywords.buyer : keywords.seller :
                        currentUser === order.borrower_id ? keywords.lender : keywords.borrower} style={SR.marginTop10} />
                    <View style={SR.userContainer}>
                        <Image source={{ uri: userDetail?.user_info?.userAvatar || picture }} style={SR.userImage} />
                        <Text style={SR.username}>{userDetail?.user_info?.user_name}</Text>
                    </View>
                    <H2 text={keywords.howYouRateBorrower} style={SR.marginTop10} />
                    <FlatList
                        style={SR.starContainer}
                        data={[1, 2, 3, 4, 5]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderStar}
                        horizontal
                    />
                    <H2 text={keywords.addPhotoOrVideo} style={SR.marginVertical10} />
                    <View style={SR.mediaMainContainer}>
                        <View style={SR.mediaContainer}>

                            <TouchableOpacity onPress={showImagePickerAlert}>
                                <FontAwesomeIcon icon={faCamera} size={fontScale(30)} color={palette.darkGrey} />
                            </TouchableOpacity>
                        </View>
                        {imagePicker.selectedImagePath.length > 0 &&
                            <>
                                <View style={[SR.mediaContainer, { marginLeft: 10 }]}>
                                    <Image source={{ uri: imagePicker.selectedImagePath[0].path }} style={SR.image} />
                                </View>
                                <TouchableOpacity onPress={() => imagePicker.setSelectedImagePath([])} style={SR.removeIcon}>
                                    <FontAwesomeIcon icon={faCircleX} />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                    <H2 text={keywords.titleOfReview} style={SR.marginVertical10} />
                    <TextField value={title} onChangeText={(text) => setTitle(text)} placeholder={keywords.titleReviewPlaceholder} style={SR.inputField} />
                    <H2 text={keywords.writeReview} style={SR.marginVertical10} />
                    <TextField value={review} onChangeText={(text) => setReview(text)} placeholder={keywords.reviewPlaceholder} multiline style={SR.multilineInputField} />
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
            <Button text={keywords.submit} onPress={handleSubmit} variant='main' style={SR.button} loading={loading} />
        </View>
    )
}

export default Review
