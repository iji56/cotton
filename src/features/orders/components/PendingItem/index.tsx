import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H2 from '@/components/elements/H2'
import SPL from './PendingItem.styles'
import { formatDate } from '../../utils/formatDate'
import { keywords, placeholderPicture } from '../../utils/keywords'
import { Checkbox } from '@/components/elements/Forms/CheckBox'
import { imageBaseUrl } from '@/utils/createStorageURL'

type PendingItemProp = {
    itemData: any
    selectedDates?: any;
    type?: true;
    toggleCheck?: (item: any) => void;
    selectedItems?: any,
    purchaser?: boolean
}

const PendingItem = ({ itemData, selectedDates, type, toggleCheck, selectedItems, purchaser }: PendingItemProp) => {
    return (
        <View style={SPL.listingContainer}>
            <Image style={SPL.image} source={{ uri: itemData?.imageUrl ? imageBaseUrl + itemData?.imageUrl : placeholderPicture }} />
            <View style={SPL.caption}>
                <View style={SPL.listingInfo}>
                    <View style={SPL.title}>
                        <H2 text={itemData?.name} />
                    </View>
                    {selectedDates &&
                        <Text style={SPL.duration}>
                            {formatDate(selectedDates[0]).split(',')[0]} - {formatDate(selectedDates[1]).split(',')[0]}
                        </Text>
                    }
                    <Text style={SPL.type}>
                        {purchaser ? keywords.purchaseBy : keywords.borrowedBy}{itemData?.borrower}
                    </Text>
                </View>
                <Text style={SPL.amount}>{'CA $'}{itemData?.price}</Text>
                {
                    type &&
                    <Checkbox label='' isChecked={selectedItems?.some((item: any) => item.id === itemData.id)} onClick={() => toggleCheck!(itemData)} />
                }
            </View>
        </View>
    )
}

export default PendingItem

const styles = StyleSheet.create({})