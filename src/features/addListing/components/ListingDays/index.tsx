import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import { Checkbox } from '@/components/elements/Forms/CheckBox'
import SLD from './ListingDays.styles'
import { days, keywords } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FlatList } from 'react-native-gesture-handler'

type Day = {
    text: string,
    days: number,
    value: number
}

type PropType = {
    periodToLend: Day[];
    setPeriodToLend: Dispatch<SetStateAction<Day[]>>;
}

const ListingDays = ({ periodToLend, setPeriodToLend }: PropType) => {

    const handleSelectDate = (item: Day) => {
        if (item.days === 4) {
            if (periodToLend.some(day => day.days === item.days)) {
                // const filteredDays = periodToLend.filter(day => day.days !== item.days);
                setPeriodToLend([]);
            } else {
                setPeriodToLend([item])
            }
        } else {
            let copiedPeriodToLend = [];
            for (let i = 0; i < days.length; i++) {
                console.log(days[i])
                copiedPeriodToLend.push(days[i])
                if (days[i].days === item.days) {
                    break;
                }
            }
            setPeriodToLend([...copiedPeriodToLend])
        }

        // if (periodToLend.some(day => day.days === item.days)) {
        //     const filteredDays = periodToLend.filter(day => day.days !== item.days);
        //     setPeriodToLend(filteredDays);
        // } else {
        //     setPeriodToLend([...periodToLend, item])
        // }
    }

    const renderItem = ({ item, index }: { item: { text: string, days: number, value: number }, index: number }) => {

        return (
            <TouchableOpacity style={[SLD.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}
                onPress={() => handleSelectDate(item)}>
                <View style={SLD.textContainer}>
                    <Text style={SLD.text} numberOfLines={1} >{item.text}</Text>
                </View>
                <Checkbox label='' isChecked={periodToLend.some(day => day.days === item.days)} onClick={() => handleSelectDate(item)} />
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <View style={SLD.container}>
                <H1 text={keywords.selectPriod} />
            </View>
            <FlatList
                data={days}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingDays