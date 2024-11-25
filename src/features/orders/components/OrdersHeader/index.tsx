import Wrapper from "@/components/Wrapper";
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { faDollarCircle } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity, View } from "react-native";
import { SOH } from "./OrdersHeader.styles";
import { reduxSelect } from "@/types/reduxHooks";
import H2 from "@/components/elements/H2";
import H1 from "@/components/elements/H1";

type OrdersHeaderProps = {
  headerTitle: null | string;
  headerType?: null | 'main';
  redirect: 'OrdersMain' | 'PayoutMain';
  back?: true
}

const OrdersHeader = ({ headerTitle, headerType, redirect, back }: OrdersHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const user = reduxSelect(state => state.usermeta);

  return (
    <View style={SOH.mainContainer}>
      {headerType === 'main' ? (
        <Wrapper>
          <View style={SOH.betweenParent}>
            <View style={SOH.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faArrowLeft} color={'#000'} size={20} />
              </TouchableOpacity>
              <H2 text={headerTitle ? headerTitle : ''} style={SOH.headerTitle} />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('PayoutMain')} style={SOH.dollorIcon}>
              <FontAwesomeIcon icon={faDollarCircle} color={'#000'} size={20} />
            </TouchableOpacity>
          </View>
        </Wrapper>
      ) : (
        <Wrapper>
          <View style={[SOH.centerParent, { justifyContent: 'flex-start' }]}>
            <TouchableOpacity
              style={SOH.backButton}
              onPress={() => {
                //  back ? 
                navigation.goBack()
                // : 
                // navigation.navigate(redirect)
              }}>
              <FontAwesomeIcon icon={faArrowLeft} color={'#000'} size={20} />
            </TouchableOpacity>
            <H1 text={headerTitle ? headerTitle : ''} style={SOH.headerTitle} />
          </View>
        </Wrapper>
      )}
    </View>
  )
}

export default OrdersHeader;