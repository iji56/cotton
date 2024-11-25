import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import SLSC from './ListingSubCategories.styles'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { keywords, subCategories, } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FlatList } from 'react-native-gesture-handler'
import { listingTypes } from '@/features/feed/utils/filters'


type PropType = {
    category: string,
    subCategory: string;
    setSubCategory: Dispatch<SetStateAction<string>>;
}

const ListingSubCategories = ({ category, subCategory, setSubCategory }: PropType) => {

    const renderItem = ({ item, index }: { item: string, index: number }) => {


        return (
            <View style={[SLSC.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}>
                <TouchableOpacity style={SLSC.textContainer} onPress={() => setSubCategory(item)}>
                    <Text style={SLSC.text} numberOfLines={1} >{item}</Text>
                </TouchableOpacity>
                {/* <Checkbox label='' isChecked={item.text === color} onClick={() => setColor(item.text)} /> */}
            </View>
        )
    }
    return (
        <View style={SLSC.container}>
            <H1 text={keywords.chooseSubCategory} />
            <Text style={SLSC.text}>{category}{'>'}</Text>
            <FlatList
                data={listingTypes}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingSubCategories