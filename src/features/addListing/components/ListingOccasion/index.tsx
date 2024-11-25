import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import { Checkbox } from '@/components/elements/Forms/CheckBox'
import SLO from './ListingOccasion.styles'
import { keywords, occasions } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FlatList } from 'react-native-gesture-handler'


type PropType = {
    occasion: string[];
    setOccasion: Dispatch<SetStateAction<string[]>>;
}

const ListingOccasion = ({ occasion, setOccasion }: PropType) => {

    const handleSelectOccasion = (selectedOccasion: string) => {
        if (occasion.includes(selectedOccasion)) {
            let index = occasion.indexOf(selectedOccasion);
            occasion.splice(index, 1);
            setOccasion([...occasion])
        } else {
            setOccasion([...occasion, selectedOccasion])
        }
    }

    const renderItem = ({ item, index }: { item: { text: string }, index: number }) => {

        return (
            <TouchableOpacity style={[SLO.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}
                onPress={() => handleSelectOccasion(item.text)}>
                <View style={SLO.textContainer}>
                    <Text style={SLO.text} numberOfLines={1} >{item.text}</Text>
                </View>
                <Checkbox label='' isChecked={occasion.includes(item.text)} onClick={() => handleSelectOccasion(item.text)} />
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <View style={SLO.container}>
                <H1 text={keywords.chooseOccation} />
                <Text style={SLO.title}>{keywords.selectAppApply}</Text>
            </View>
            <FlatList
                nestedScrollEnabled={true}
                contentContainerStyle={{flexGrow: 1}}
                data={occasions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingOccasion