import H2 from "@/components/elements/H2";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SSF } from "./SettingsForms.styles";
import { reduxDispatch, reduxSelect } from "@/types/reduxHooks";
import { PreferencesSwitchType } from "../../types/preferencesType";
import { Checkbox } from "@/components/elements/Forms/CheckBox";
import {  keywords } from "../../utils/keywords";

const PreferencesForm = () => {
  const dispatch = reduxDispatch();
  const settings = reduxSelect(state => state.settings);
  const [userSettings, setUserSettings] = useState<PreferencesSwitchType>({
    pref_pickup: settings.pref_pickup,
    pref_hide_size: settings.pref_hide_size,
    notif_follow: settings.notif_follow,
    notif_like: settings.notif_like,
    notif_borrow: settings.notif_borrow,
    notif_lend: settings.notif_lend,
    notif_chat: settings.notif_chat,
    email_follow: settings.email_follow,
    email_like: settings.email_like,
    email_borrow: settings.email_borrow,
    email_lend: settings.email_lend,
    email_chat: settings.email_chat,
  });

  // updates local component state by subscribing to redux store
  useEffect(() => {
    setUserSettings({
      pref_pickup: settings.pref_pickup,
      pref_hide_size: settings.pref_hide_size,
      notif_follow: settings.notif_follow,
      notif_like: settings.notif_like,
      notif_borrow: settings.notif_borrow,
      notif_lend: settings.notif_lend,
      notif_chat: settings.notif_chat,
      email_follow: settings.email_follow,
      email_like: settings.email_like,
      email_borrow: settings.email_borrow,
      email_lend: settings.email_lend,
      email_chat: settings.email_chat,
    });
  }, [settings]);

  const [pushNotificationPrefs, setPushNotificationPrefs] = useState([
    { text: "Promotional offers", selected: true, type: 'pushNotification' },
    { text: "Recomendations", selected: true, type: 'pushNotification' },
    { text: "Order Updates", selected: true, type: 'pushNotification' },
    { text: "Reminders", selected: true, type: 'pushNotification' },
  ]);

  const [emailPrefs, setEmailPrefs] = useState([
    { text: "Promotional offers", selected: true, type: 'email' },
    { text: "Recomendations", selected: true, type: 'email' },
    { text: "Order Updates", selected: true, type: 'email' },
    { text: "Reminders", selected: true, type: 'email' },
    { text: "Borrow/Buy requests", selected: true, type: 'email' },
    { text: "Use research and marketing surveys", selected: true, type: 'email' },
  ]);

  const toggleCeckBox = (item: { text: string, selected: boolean, type: 'pushNotification' | 'email' }) => {
    if (item.type === 'email') {
      setEmailPrefs(prev => prev.map(prefs => {
        if (prefs.text === item.text) {
          return { ...prefs, selected: !item.selected }
        }
        return prefs
      }))
    } else {
      setPushNotificationPrefs(prev => prev.map(prefs => {
        if (prefs.text === item.text) {
          return { ...prefs, selected: !item.selected }
        }
        return prefs
      }))
    }
  }

  const renderItem = ({ item, index }: { item: { text: string, selected: boolean, type: 'pushNotification' | 'email' }, index: number }) => (
    <View style={SSF.custInp} key={index}>
      <View style={SSF.TextComponent}>
        <Text style={SSF.text}>{item.text}</Text>
      </View>
      <View style={SSF.ImageComponent}>
        <Checkbox label="" isChecked={item.selected} onClick={() => toggleCeckBox(item)} />
      </View>
    </View>
  )

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={SSF.Description}>
        <Text style={SSF.CustomText}>{keywords.marketingPreferences}</Text>
        <Text style={SSF.descriptionText}>
          {keywords.marketingPrefMessage}
        </Text>
      </View>
      <View style={SSF.inputContainer}>
        <View style={SSF.innerContainer}>
          <Text style={SSF.CustomText}>{keywords.pushNotification}</Text>
          <FlatList
            data={pushNotificationPrefs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
        <View style={SSF.innerContainer2}>
          <Text style={SSF.CustomText}>{keywords.email}</Text>
          <FlatList
            data={emailPrefs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default PreferencesForm;