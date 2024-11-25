import { TouchableOpacity, View } from 'react-native';
import SPH from './ProfileHeader.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Wrapper from '@/components/Wrapper';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const ProfileHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={SPH.container}>
      <Wrapper>
        <View style={SPH.mainContainer}>
          {/* <TouchableOpacity
            style={SPH.containerNavItem}
            onPress={() => navigation.navigate('ListingMain', { sampleProps: 'lol' })}
            >
            <FontAwesomeIcon
              icon={faPlus}
              color={'#000'}
              size={20}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={SPH.containerNavItem}
            onPress={() => navigation.navigate('SettingsNav')}
          >
            <FontAwesomeIcon
              icon={faGear}
              color={'#000'}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </Wrapper>
    </View>
  );
};

export default ProfileHeader;
