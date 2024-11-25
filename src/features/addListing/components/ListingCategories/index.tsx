import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import { Checkbox } from '@/components/elements/Forms/CheckBox'
import SLD from './ListingCategories.styles'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { categories, keywords } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FlatList } from 'react-native-gesture-handler'


type PropType = {
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
}

const ListingCategories = ({ category, setCategory }: PropType) => {

    const renderItem = ({ item, index }: { item: { text: string }, index: number }) => {

        return (
            <View style={[SLD.itemContainer, { borderTopWidth: index === 0 ? 0 : 2, }]} key={index}>
                <TouchableOpacity style={SLD.textContainer} onPress={() => setCategory(item.text)}>
                    <Text style={SLD.text} numberOfLines={1} >{item.text}</Text>
                    <FontAwesomeIcon icon={faChevronRight} size={18}/>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View>
            <View style={SLD.container}>
                <H1 text={keywords.chooseCategory} />
            </View>
            <FlatList
                data={categories}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ListingCategories