import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import SettingsHeader from '../SettingsHeader'
import { keywords } from '../../utils/keywords'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import H2 from '@/components/elements/H2'
import { borrowerQuestions } from '../../utils/faqs'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import SBF from './BorrowingFAQs.styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'

const BorrowingFAQs = () => {
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
        <TouchableOpacity key={index} style={SBF.container} onPress={() => handleNavigation(item)}>
            <Text style={SBF.text}>{item.question}</Text>
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
            <H2 text={keywords.borrowing} style={SBF.heading} />
            <FlatList
                data={borrowerQuestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default BorrowingFAQs