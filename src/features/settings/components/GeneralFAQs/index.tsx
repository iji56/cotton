import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import SettingsHeader from '../SettingsHeader'
import { keywords } from '../../utils/keywords'
import H2 from '@/components/elements/H2'
import SGF from './GeneralFAQs.styles'
import { generalQuestions } from '../../utils/faqs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'

const GeneralFAQs = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const insets = useSafeAreaInsets();

    const handleNavigation = (item: {
        question: string, answer: string, type?: string
    }) => {
        navigation.navigate('FAQsDetail', {
            question: item.question,
            answer: item.answer,
            type: item.type
        })
    }

    const renderItem = ({ item, index }: { item: { question: string, answer: string }, index: number }) => (
        <TouchableOpacity key={index} style={SGF.container} onPress={() => handleNavigation(item)}>
            <Text style={SGF.text}>{item.question}</Text>
            <FontAwesomeIcon icon={faChevronRight} />
        </TouchableOpacity>
    )
    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white,
        }}>
            <SettingsHeader headerTitle={keywords.faq} />
            <H2 text={keywords.general} style={SGF.heading} />
            <FlatList
                data={generalQuestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default GeneralFAQs