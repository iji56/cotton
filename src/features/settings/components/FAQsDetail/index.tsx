import { View, Text, FlatList } from 'react-native'
import React from 'react'
import SettingsHeader from '../SettingsHeader'
import { keywords } from '../../utils/keywords'
import SFD from './FAQsDetail.styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'

const FAQsDetail = ({ route }: any) => {
    const { question, answer, type } = route.params;
    const insets = useSafeAreaInsets();

    const Dot = () => <Text style={SFD.dot}>{'\u2022'}</Text>

    const renderItem = ({ item, index }: { item: string, index: number }) => (
        <View style={SFD.listContainer}>
            <Dot />
            <Text style={SFD.answer}>{item}</Text>
        </View>
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
            <View style={SFD.container}>
                <Text style={SFD.question}>{question}</Text>
                {type ? <FlatList
                    data={answer?.lists || []}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => {
                        if (answer?.text) {
                            return <Text style={SFD.answer}>{answer.text}</Text>
                        }
                        return null
                    }}
                    renderItem={renderItem}
                /> :
                    <Text style={SFD.answer}>{answer}</Text>
                }
            </View>
        </View>
    )
}

export default FAQsDetail;