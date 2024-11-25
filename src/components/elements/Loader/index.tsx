import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import SLoader from './Loader.styles'

const Loader = () => {
    return (
        <View style={SLoader.container}>
            <ActivityIndicator size={'large'} color={'#D69900'} />
        </View>
    )
}

export default Loader