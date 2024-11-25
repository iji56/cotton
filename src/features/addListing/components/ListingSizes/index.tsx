import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState, } from 'react'
import SLS from './ListingSizes.styles'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { keywords, sizes, } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FlatList } from 'react-native-gesture-handler'
import { dressSizes, pantSizes, shoeSizes, topsSizes } from '@/features/feed/utils/filters'


type PropType = {
    size: string;
    setSize: Dispatch<SetStateAction<string>>;
    subCategory: string;
}

const ListingSizes = ({ size, setSize, subCategory }: PropType) => {
    const [filteredSizes, setFilteredSizes] = useState<string[]>([]);

    useEffect(() => {


        if (subCategory === 'tops') {
            filteredSizes.push(...topsSizes);
        }
        if (subCategory === 'shoes') {
            filteredSizes.push(...shoeSizes);
        }
        if (subCategory === 'dresses' ||
            subCategory === 'two-piece set' ||
            subCategory === 'jackets & coats') {
            filteredSizes.push(...dressSizes.slice(1));
        }
        if (
            subCategory === 'shorts' ||
            subCategory === 'pants' ||
            subCategory === 'skirts') {
            filteredSizes.push(...pantSizes);
        }
        setFilteredSizes(filteredSizes)
    }, []);

    const renderItem = ({ item, index }: { item: string, index: number }) => {

        return (
            <View style={[SLS.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}>
                <TouchableOpacity style={SLS.textContainer} onPress={() => setSize(item)}>
                    <Text style={SLS.text} numberOfLines={1} >{item}</Text>
                </TouchableOpacity>
                {/* <Checkbox label='' isChecked={item.text === color} onClick={() => setColor(item.text)} /> */}
            </View>
        )
    }
    return (
        <View style={SLS.container}>
            <H1 text={keywords.selectSize} style={SLS.title} />
            <FlatList
                data={filteredSizes}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingSizes