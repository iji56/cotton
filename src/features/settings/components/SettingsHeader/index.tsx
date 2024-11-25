import Wrapper from "@/components/Wrapper";
import { } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity, View } from "react-native";
import SSH from "./SettingsHeader.styles";
import H1 from "@/components/elements/H1";
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { palette } from "@/components/styles/theme";
import { useContext } from "react";
import { NotificationContext } from "@/features/Listeners/listeners";

type SettingsHeaderProps = {
  headerTitle: string;
  headerType?: null | 'main';
}

const SettingsHeader = ({ headerTitle, headerType }: SettingsHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { currentRoute, setCurrentRoute } = useContext(NotificationContext);

  return (
    <View style={SSH.container}>
      {headerType === 'main' ?
        (
          <Wrapper>
            <View style={SSH.settingsContainer}>
              <TouchableOpacity
                style={SSH.backButton}
                onPress={() => {
                  if (currentRoute) {
                    console.log("current route : ", currentRoute)
                    navigation.popToTop();
                    navigation.navigate(currentRoute);
                    setCurrentRoute(null);
                  } else {
                    navigation.goBack()
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  color={palette.black}
                  size={20}
                />
              </TouchableOpacity>
              <H1 text={headerTitle} />
            </View>
          </Wrapper>
        ) : (
          <Wrapper>
            <View style={SSH.settingsContainer}>
              <TouchableOpacity
                style={SSH.backButton}
                onPress={() => {
                  console.log("current route : ", currentRoute)
                  if (currentRoute) {
                    navigation.popToTop();
                    navigation.navigate(currentRoute);
                    setCurrentRoute(null);
                  } else {
                    navigation.goBack()
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  color={palette.black}
                  size={20}
                />
              </TouchableOpacity>
              <H1 text={headerTitle} />
            </View>
          </Wrapper>
        )
      }
    </View>
  )
}

export default SettingsHeader;