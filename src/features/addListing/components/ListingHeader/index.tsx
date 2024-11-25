import Wrapper from "@/components/Wrapper";
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import LHS from "./ListingHeader.styles";
import H1 from "@/components/elements/H1";
import { palette } from "@/components/styles/theme";

type ListingHeaderProps = {
  title: string;
  headerType?: 'main' | 'identityDocument' | 'additionalDocument' | 'createBank' | 'banks' | 'others';
  goBack?: boolean;
}

const ListingHeader = ({ headerType = 'main', title, goBack }: ListingHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBack = () => {
    if (headerType === 'main') {
      setTimeout(() => {
        navigation.reset({
          routes: [{ name: 'PrimaryNav' }],
          index: 0
        })
      }, 0)
    } else if (headerType === 'identityDocument' || headerType === 'additionalDocument') {
      navigation.navigate('ListingMain')
    } else if (headerType === 'createBank') {
      // !goBack
      //   ?
      //   navigation.goBack()
      //   :
      navigation.navigate('ListingMain')
    } else if (headerType === 'banks') {
      navigation.navigate('ListingMain')
    } else {
      navigation.goBack()
    }
  }
  return (
    <View style={LHS.container}>
      <Wrapper>
        <View style={LHS.settingsContainer}>
          {/* {headerType !== 'main' && */}
          <TouchableOpacity
            onPress={handleBack}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              color={palette.black}
              size={25}
            />
          </TouchableOpacity>
          {/* } */}
          <H1 text={title} style={LHS.headerTitle} />
        </View>
      </Wrapper>
    </View>
  )
};

export default ListingHeader;