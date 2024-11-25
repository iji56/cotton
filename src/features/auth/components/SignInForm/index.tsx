import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SSI } from "./SignInForm.styles";
import { useState } from "react";
import { authSignIn } from "../../api/authSignIn";
import { reduxDispatch } from "@/types/reduxHooks";
import { authError, authLogin } from "@/store/actions/authActions";
import { getUsermeta } from "../../api/getUsermeta";
import { getSettings } from "@/features/settings/api/getSettings";
import { settingsAdd } from "@/store/actions/settingsActions";
import { usermetaAdd } from "@/store/actions/usermetaActions";

const SignInForm = () => {
  const [userEmail, setUserEmail]       = useState('matt@mtthdz.com');
  const [userPassword, setUserPassword] = useState('raxapp');
  const dispatch                        = reduxDispatch();

  const signIn = async (
    userEmail: string,
    userPassword: string,
    actionType: 'signin' | 'signup'
  ) => {
    try {
      const sessionData  = await authSignIn({ userEmail, userPassword, actionType });
      const usermeta     = await getUsermeta(sessionData.uid);
      const userSettings = await getSettings(sessionData.uid);

      dispatch(authLogin(sessionData));
      dispatch(usermetaAdd(usermeta));
      dispatch(settingsAdd(userSettings));
    } catch (error) {
      dispatch(authError(error as Error));
    }
  }

  return (
    <View style={SSI.container}>
      <TextInput
        style={SSI.input}
        placeholder="email"
      />
      <TextInput
        style={SSI.input}
        placeholder="password"
        secureTextEntry
      />
      <Text style={SSI.link}>forgot password?</Text>
      <TouchableOpacity
        style={SSI.button}
        onPress={() => signIn(userEmail, userPassword, 'signin')}
      >
        <Text style={SSI.buttonText}>sign in</Text>
      </TouchableOpacity>
      <Text style={SSI.subtitle}>I accept the Terms of Use & Privacy Policy</Text>
    </View>
  )
}

export default SignInForm;