import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IconButton from '@/components/elements/Button/IconButton'
import { faArrowLeft } from '@fortawesome/sharp-light-svg-icons';
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import H1 from '@/components/elements/H1'
import AHS from './AddressesHeader.styles'

type AddressesHeaderProp = {
    headerType: 'main' | 'map',
    headerTitle: string;
}

const AddressesHeader = ({ headerType, headerTitle }: AddressesHeaderProp) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    return (
        <View>
            {headerType === 'main' ?
                <View style={AHS.container}>
                    <IconButton
                        icon={faArrowLeft}
                        onPress={() => navigation.goBack()}
                        style={AHS.icon}
                        size={20}
                    />
                    <H1 text={headerTitle} />
                    <View />
                </View>
                :
                headerType === 'map' &&
                <View style={AHS.container}>
                    <IconButton
                        icon={faArrowLeft}
                        onPress={() => navigation.goBack()}
                        style={AHS.icon}
                        size={20}
                    />
                    <H1 text={headerTitle} />
                    <View />
                </View>
            }
        </View>
    )
}

export default AddressesHeader

const styles = StyleSheet.create({})