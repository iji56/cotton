import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useMemo, } from 'react'
import SLMC from './ListingMicroCategories.styles'
import { keywords } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FlatList } from 'react-native-gesture-handler'
import { listingAccessoriesMicroCategories, listingDressesMicroCategories, listingJacketsMicroCategories, listingJeansMicroCategories, listingPantsMicroCategories, listingShoesMicroCategories, listingShortsMicroCategories, listingSkirtsMicroCategories, listingSweatersMicroCategories, listingSwimsMicroCategories, listingTopsMicroCategories, listingTwoPieceMicroCategories, listingTypes } from '@/features/feed/utils/filters'


type PropType = {
    subCategory: string,
    microCategory: string;
    setMicroCategory: Dispatch<SetStateAction<string>>;
}

const ListingMicroCategories = ({ subCategory, microCategory, setMicroCategory }: PropType) => {

    const data = useMemo(() => {
        return subCategory === listingTypes[0]
            ? listingAccessoriesMicroCategories
            : subCategory === listingTypes[1]
                ? listingDressesMicroCategories
                : subCategory === listingTypes[2]
                    ? listingTwoPieceMicroCategories
                    : subCategory === listingTypes[3]
                        ? listingJacketsMicroCategories
                        : subCategory === listingTypes[4]
                            ? listingJeansMicroCategories
                            : subCategory === listingTypes[5]
                                ? listingPantsMicroCategories
                                : subCategory === listingTypes[6]
                                    ? listingShortsMicroCategories
                                    : subCategory === listingTypes[7]
                                        ? listingSkirtsMicroCategories
                                        : subCategory === listingTypes[8]
                                            ? listingTopsMicroCategories
                                            : subCategory === listingTypes[9]
                                                ? listingSweatersMicroCategories
                                                : subCategory === listingTypes[10]
                                                    ? listingShoesMicroCategories
                                                    : subCategory === listingTypes[11]
                                                        ? listingSwimsMicroCategories
                                                        : [];
    }, [subCategory]);


    const renderItem = ({ item, index }: { item: string, index: number }) => {


        return (
            <View style={[SLMC.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}>
                <TouchableOpacity style={SLMC.textContainer} onPress={() => setMicroCategory(item)}>
                    <Text style={SLMC.text} numberOfLines={1} >{item}</Text>
                </TouchableOpacity>
                {/* <Checkbox label='' isChecked={item.text === color} onClick={() => setColor(item.text)} /> */}
            </View>
        )
    }
    return (
        <View style={SLMC.container}>
            <H1 text={keywords.chooseMicroCategory} />
            <Text style={SLMC.text}>{subCategory}{'>'}</Text>
            <FlatList
                key={subCategory}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                data={data}
                keyExtractor={(item, index) => `${subCategory}-${index}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingMicroCategories