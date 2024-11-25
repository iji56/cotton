import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ListingMainContext } from "../../context/ListingMainContext";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import H3 from "@/components/elements/H3";
import { faImages, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import LIS from "./ListingImages.styles";
import { launchImageLibrary } from "react-native-image-picker";
import { ImagePickerType } from "../../types/ImagePickerType";
import { theme } from "@/components/styles/theme";

/**
 * TODO: add image size limiter
 *
 * @returns 
 */
const ListingImages = () => {
  const { selectedImages, setSelectedImages } = useContext(ListingMainContext);
  const [cover, setCover] = useState<null | ImagePickerType>(null)
    
  const pickImages = async () => {
    const images = await launchImageLibrary({
      selectionLimit: 5,
      mediaType: 'photo',
      includeBase64: true,
    });

    if (images && !images.didCancel && images.assets) {
      setSelectedImages(images.assets as ImagePickerType[]);
    }
  }

  const selectCover = (selectedImage: ImagePickerType) => {
    const index = selectedImages.findIndex(image => image.uri === selectedImage.uri);

    if (index !== -1 && index !== 0) {
      const updatedImages = selectedImages.filter(image => image.uri !== selectedImage.uri);

      updatedImages.unshift(selectedImage);
      setSelectedImages(updatedImages);
    }
  }

  const removeImage = (selectedImage: ImagePickerType) => {
    setSelectedImages(selectedImages.filter((image) => image.uri !== selectedImage.uri));
  };

  return (
    <View>
      {selectedImages && selectedImages.length > 0 ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={LIS.mainContainer}>
              <View style={LIS.selectedContainer}>
                {selectedImages?.map((image, index) => {
                  return (
                    <TouchableOpacity
                      style={LIS.selectedImages}
                      key={image.fileName}
                      onPress={() => selectCover(image)}
                    >
                      <TouchableOpacity
                        style={LIS.closeIcon}
                        onPress={() => removeImage(image)}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <Image
                        style={index === 0 ? LIS.coverImage : LIS.singleImage}
                        source={{ uri: image.uri }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedImages.length < 5 ?
                <TouchableOpacity
                  style={LIS.addContainer}
                  onPress={() => pickImages()}>
                  <View style={LIS.imageAdd}>
                    <FontAwesomeIcon icon={faImages} size={24} />
                    <H3 text={'add more'} />
                  </View>
                </TouchableOpacity>
                : null
              }
            </View>
          </ScrollView>
          <Text style={LIS.caption}>select an image to be your cover.</Text>
        </View>
      ) : (
        <View>
          <View style={LIS.altContainer}>
            <TouchableOpacity
              style={LIS.imageAdd}
              onPress={() => pickImages()}>
              <FontAwesomeIcon icon={faImages} size={24} />
              <H3 text={'add images'} />
            </TouchableOpacity>
          </View>
          <Text style={LIS.caption}>you can select up to 5 images.</Text>
        </View>
      )}
    </View>
  )
}

export default ListingImages;