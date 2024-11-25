import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AccordionItem from '@/components/elements/Accordion'
import { SFAQsItem } from './FAQS.styles'

type FAQsItemProp = {
    item: {
        answer: string,
        question: string
    },
    index: number;
}

const FAQsItem = ({ item, index }: FAQsItemProp) => {
    return (
        <AccordionItem key={index} title={item.question} textStyle={SFAQsItem.questions} viewStyle={SFAQsItem.questionView}>
            <Text style={SFAQsItem.text}>
                {item.answer}
            </Text>
        </AccordionItem>
    )
}

export default FAQsItem

const styles = StyleSheet.create({})