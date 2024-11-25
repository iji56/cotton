import { useContext } from "react";
import { Text, View } from "react-native"
import { EditListingContext } from "../../context/EditListingContext";

const FormSliders = () => {
  const {
    error,
    formData,
    setError,
    setFormData
  } = useContext(EditListingContext);

  return (
    <View><Text>Form Sliders</Text></View>
  )
}

export default FormSliders;