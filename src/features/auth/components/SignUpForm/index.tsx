import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SSU } from "./SignUpForm.styles";
import { reduxDispatch } from "@/types/reduxHooks";
import { useState } from "react";
import { authSignIn } from "../../api/authSignIn";
import { getUsermeta } from "../../api/getUsermeta";
import { getSettings } from "@/features/settings/api/getSettings";
import { authError, authLogin } from "@/store/actions/authActions";
import { usermetaAdd } from "@/store/actions/usermetaActions";
import { settingsAdd } from "@/store/actions/settingsActions";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const SignUpForm = () => {
  const [userEmail, setUserEmail]       = useState('matt@mtthdz.com');
  const [userPassword, setUserPassword] = useState('raxapp');
  const dispatch                        = reduxDispatch();
  const navigation                      = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  // const signIn = async (
  //   userEmail: string,
  //   userPassword: string,
  //   actionType: 'signin' | 'signup'
  // ) => {
  //   try {
  //     const sessionData  = await authSignIn({ userEmail, userPassword, actionType });
  //     const usermeta     = await getUsermeta(sessionData.uid);
  //     const userSettings = await getSettings(sessionData.uid);

  //   } catch (error) {
  //     dispatch(authError(error as Error));
  //   }
  // }

  const user = {
    accessToken: '',
    id: 'r232g2g32g65y45t4',
    email: '',
    first_name: '',
    last_name: '',
    street_address_line_1: '',
    street_address_line_2: '',
    city: '',
    state: '',
    postal_code: ''
  }

  return (
    <View style={SSU.container}>
      <TextInput
        style={SSU.input}
        placeholder="username"
      />
      <TextInput
        style={SSU.input}
        placeholder="email"
      />
      <TextInput
        style={SSU.input}
        placeholder="password"
        secureTextEntry
      />
      <TouchableOpacity
        style={SSU.button}
        onPress={() => navigation.navigate('AuthNav', { screen: 'AuthOnboard', params: { user: user } })}
      >
        <Text style={SSU.buttonText}>sign up</Text>
      </TouchableOpacity>
      <Text style={SSU.subtitle}>By signing up, I agree to rax's Terms of Use & Privacy Policy</Text>
    </View>
  )
}

export default SignUpForm;