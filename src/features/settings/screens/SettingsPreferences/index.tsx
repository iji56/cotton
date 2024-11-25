import { palette, theme } from "@/components/styles/theme";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Wrapper from "@/components/Wrapper";
import SettingsHeader from "../../components/SettingsHeader";
import PreferencesForm from "../../components/SettingsForms/PreferencesForm";
import { keywords } from "../../utils/keywords";

const SettingsPreferences = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white,
      }}
    >
      <SettingsHeader headerTitle={keywords.notifications} />
      <Wrapper>
        <PreferencesForm />
      </Wrapper>
    </View>
  )
}

export default SettingsPreferences;