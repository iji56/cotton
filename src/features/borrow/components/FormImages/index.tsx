import { useContext } from "react";
import { Text, View } from "react-native"
import { EditListingContext } from "../../context/EditListingContext";

const FormImages = () => {
  const {
    error,
    renderImages,
    deletedImages,
    newImages,
    setError,
    setRenderImages,
    setDeletedImages,
    setNewImages
  } = useContext(EditListingContext);

  return (
    <View><Text>Form Images</Text></View>
  )
}

export default FormImages;