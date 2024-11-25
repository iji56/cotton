import { palette, theme } from "@/components/styles/theme";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import BorrowHeader from "../../components/BorrowHeader";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FormMain from "../../components/FormMain";
import { keywords } from "../../utils/staticTexts";

const EditListing = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const itemPayload = route.params.listingData;
  console.log(itemPayload)

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: palette.white
      }}
    >
      <BorrowHeader headerType="edit" headerTitle={keywords.editLiting} backNavPayload={itemPayload} />

      <FormMain data={itemPayload} />
    </View>
  )
}

export default EditListing;