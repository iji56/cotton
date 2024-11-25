import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import SettingsHeader from '../../components/SettingsHeader'
import { keywords } from '../../utils/keywords'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'
import H2 from '@/components/elements/H2'
import SDA from './DeleteAccount.styles'
import Button from '@/components/elements/Button/Button'
import BottomSheets from '@/components/elements/BottomSheet'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { deleteAccount } from '../../api/deleteAccount'
import { reduxSelect } from '@/types/reduxHooks'
import { authSignOut } from '@/features/auth/api/authSignOut'

const DeleteAccount = () => {
    const insets = useSafeAreaInsets();
    const { id } = reduxSelect(state => state.usermeta);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const [loading, setLoading] = useState(false);
    const ref = useRef<any>(null);

    const handleDeleteAccount = async () => {
        setSnapPoint(1);
        setLoading(true)
        const response = await deleteAccount(id!)
        console.log("delete account response : ", response)
        await authSignOut();
        setLoading(false)
    }

    const handlePause = () => {
        navigation.navigate('PauseAccount')
    }

    const Dot = () => <Text style={SDA.dot}>{'\u2022'}</Text>

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white,
            }}>
            <SettingsHeader headerTitle={keywords.deleteAccount} />
            <View style={{ marginHorizontal: 10 }}>
                <H2 text={keywords.areYouSureDeletingAccount} style={SDA.warningText} />
                <Text style={SDA.text}>{keywords.thisWill}</Text>
                <View style={SDA.list}>
                    <Dot />
                    <Text style={SDA.text}>{keywords.deleteYourProfile}</Text>
                </View>
                <View style={SDA.list}>
                    <Dot />
                    <Text style={SDA.text}>{keywords.deleteAllListing}</Text>
                </View>
                <View style={SDA.list}>
                    <Dot />
                    <Text style={SDA.text}>{keywords.cancelUpcommingLendsBorrows}</Text>
                </View>
                <View style={SDA.list}>
                    <Dot />
                    <Text style={SDA.text}>{keywords.loseAllAvailableAndFuturePayouts}</Text>
                </View>
                <Text style={[SDA.text, SDA.pauseAccount]}>
                    {keywords.consider}
                    <Text style={SDA.link} onPress={handlePause}>{keywords.pausing}</Text>
                    {keywords.accountInstead}
                </Text>
                <View style={SDA.buttonContainer}>
                    <Button text={keywords.deleteMyAccount} onPress={() => setSnapPoint('60%')} variant='logout' />
                </View>
            </View>
            <BottomSheets bottomSheetRef={ref} handleSheetChanges={(index: number) => {
                if (index > 0) {
                    setSnapPoint(index);
                } else {
                    setSnapPoint(1);
                }
            }}
                snapPoint={snapPoint}
                setSnapPoint={setSnapPoint}>
                <H2 text={keywords.areYouSureDeletingAccount} style={SDA.areYouSure} />
                <View style={SDA.bottomButtonContainer}>
                    <Button text={keywords.keep} onPress={() => setSnapPoint(1)} variant='main' />
                    <View style={SDA.space} />
                    <Button text={keywords.delete} onPress={handleDeleteAccount} variant='logout' loading={loading} />
                </View>
            </BottomSheets>
        </View>
    )
}

export default DeleteAccount