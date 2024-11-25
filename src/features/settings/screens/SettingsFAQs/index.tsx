import { palette } from "@/components/styles/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsHeader from "../../components/SettingsHeader";
import SFS from "./SettingsFAQs.styles";
import H2 from "@/components/elements/H2";
import { keywords } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const SettingsFAQs = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

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
      <SettingsHeader headerTitle={keywords.faq} />
      <H2 text={keywords.allTopics} style={SFS.heading} />
      <TouchableOpacity style={SFS.container} onPress={() => navigation.navigate('GeneralFAQs')}>
        <Text style={SFS.text}>{keywords.general}</Text>
        <FontAwesomeIcon icon={faChevronRight} />
      </TouchableOpacity>
      <TouchableOpacity style={SFS.container} onPress={() => navigation.navigate('BorrowingFAQs')}>
        <Text style={SFS.text}>{keywords.borrowing}</Text>
        <FontAwesomeIcon icon={faChevronRight} />
      </TouchableOpacity>
      <TouchableOpacity style={SFS.container} onPress={() => navigation.navigate('LendingFAQs')}>
        <Text style={SFS.text}>{keywords.lending}</Text>
        <FontAwesomeIcon icon={faChevronRight} />
      </TouchableOpacity>
    </View>
  )
}

export default SettingsFAQs;