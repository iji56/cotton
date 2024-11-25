import { ActivityIndicator } from 'react-native'
import React from 'react'
import { palette } from '@/components/styles/theme'

const Loader = ({ color }: { color?: string }) =>
    <ActivityIndicator size={'large'} color={color ? color : '#D69900'} />

export default Loader