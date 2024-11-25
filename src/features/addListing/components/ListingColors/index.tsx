import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import { Checkbox } from '@/components/elements/Forms/CheckBox'
import SLC from './ListingColors.styles'
import { keywords } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FlatList } from 'react-native-gesture-handler'
import { listingColors } from '@/features/feed/utils/filters'


type PropType = {
    color: string[];
    setColor: Dispatch<SetStateAction<string[]>>;
}

const ListingColors = ({ color, setColor }: PropType) => {

    const handleSelectColor = (selectedColor: string) => {
        if (color.includes(selectedColor)) {
            let index = color.indexOf(selectedColor);
            color.splice(index, 1);
            setColor([...color])
        } else {
            setColor([...color, selectedColor])
        }
    }

    const renderItem = ({ item, index }: { item: string, index: number }) => {

        return (
            <TouchableOpacity onPress={() => handleSelectColor(item)} style={[SLC.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}>
                <View style={SLC.textContainer}>
                    <Text style={SLC.text} numberOfLines={1} >{item}</Text>
                </View>
                <Checkbox label='' isChecked={color.includes(item)} onClick={() => handleSelectColor(item)} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={SLC.container}>
            <H1 text={keywords.selectColor} style={SLC.title} />
            <FlatList
                data={listingColors}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingColors