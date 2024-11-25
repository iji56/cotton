import { View, Text, Image } from 'react-native'
import React from 'react'
import H2 from '@/components/elements/H2'
import { keywords } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import Button from '@/components/elements/Button/Button'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import SPC from './PayoutConfirmation.styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'

const PayoutConfirmation = ({ route }: any) => {
    const { total, accountNumber } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const insets = useSafeAreaInsets();
    const handlePayForOtherItem = () => {
        // handl logic
    }

    const handleHome = () => {
        navigation.navigate('PayoutMain')
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white,
            marginHorizontal: 10,
        }}>
            <Image source={require('../../components/assets/check.png')} style={SPC.checkIcon} />
            <H1 text={keywords.congratulations} style={SPC.congratulations} />
            <H2 text={keywords.yourMoneyOnTheWay} style={SPC.messageText} />
            <H1 text={keywords.summary} style={SPC.summary}/>
            <View style={SPC.summaryContainer}>
                <H2 text={keywords.total} />
                <Text style={SPC.text}>{'CA $'}{total.toFixed(2)}</Text>
            </View>
            <View style={SPC.summaryContainer}>
                <H2 text={keywords.backAccount} />
                <Text style={SPC.text}>{keywords.accountEnding}{accountNumber}</Text>
            </View>
            <View style={SPC.summaryContainer}>
                <H2 text={keywords.estimatedTimeOfArrival} />
                <Text style={SPC.text}>{keywords.businessDays}</Text>
            </View>
            <View style={SPC.buttonContainer}>
                <Button text={keywords.getPaidOutForOtherItems} onPress={handlePayForOtherItem} variant='secondary' style={SPC.button} />
                <Button text={keywords.returnHome} onPress={handleHome} variant='main' style={SPC.button} />
            </View>
        </View>
    )
}

export default PayoutConfirmation