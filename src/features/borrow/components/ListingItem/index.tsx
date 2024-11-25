import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H2 from '@/components/elements/H2'
import { placeholderPicture } from '../../utils/staticTexts'
import SLI from './ListingItem.styles'
import { formatDate } from '../../utils/formatDate'
import { imageBaseUrl } from '@/utils/createStorageURL'

type ListingItemProp = {
    itemData: any
    selectedDates?: any
}

const ListingItem = ({ itemData, selectedDates }: ListingItemProp) => {
    return (
        <View style={SLI.listingContainer}>
            <Image style={SLI.image} source={{ uri: itemData?.images?.length > 0 ? `${imageBaseUrl}${itemData?.images[0]?.url_path}` : placeholderPicture }} />
            <View style={SLI.caption}>
                <View style={SLI.title}>
                    <H2 text={itemData?.name || itemData?.listing_name} />
                </View>
                <View style={SLI.details}>
                    {selectedDates &&
                        <Text style={SLI.duration}>
                            {Object.keys(selectedDates)[0] === Object.keys(selectedDates)[Object.keys(selectedDates).length - 1] ?
                                formatDate(Object.keys(selectedDates)[0]) : `${formatDate(Object.keys(selectedDates)[0])} - ${formatDate(Object.keys(selectedDates)[Object.keys(selectedDates).length - 1])}`}
                        </Text>
                    }
                    <Text style={SLI.type}>
                        {itemData.type}
                    </Text>
                    <Text style={SLI.size}>
                        {itemData.size}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default ListingItem

const styles = StyleSheet.create({})