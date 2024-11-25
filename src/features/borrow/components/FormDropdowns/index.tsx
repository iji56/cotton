import { Text, View } from "react-native"
import { EditListingContext } from "../../context/EditListingContext";
import { useContext } from "react";

const FormDropdowns = () => {
  const {
    error,
    formData,
    setError,
    setFormData
  } = useContext(EditListingContext);

  return (
    <View><Text>Form Dropdowns</Text></View>
  )
}

export default FormDropdowns;