import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H2 from '@/components/elements/H2'
import SLI from './ListingItem.styles'
import { formatDate } from '../../utils/formatDate'
import { placeholderPicture } from '../../utils/keywords'
import { imageBaseUrl } from '@/utils/createStorageURL'

type ListingItemProp = {
    itemData: any
    selectedDates?: any
}

const ListingItem = ({ itemData, selectedDates }: ListingItemProp) => {
    return (
        <View style={SLI.listingContainer}>
            <Image style={SLI.image} source={{ uri: itemData?.image ? `${imageBaseUrl}${itemData?.image}` : placeholderPicture }} />
            <View style={SLI.caption}>
                <View style={SLI.title}>
                    <H2 text={itemData?.name} />
                </View>
                <View style={SLI.details}>
                    {selectedDates &&
                        <Text style={SLI.duration}>

                            {selectedDates[0] === selectedDates[1] ? formatDate(selectedDates[0]) :
                                `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[1])}`}
                        </Text>
                    }
                    <Text style={SLI.type}>
                        {itemData.type}  {!selectedDates && itemData.size}
                    </Text>
                    {selectedDates &&
                        <Text style={SLI.size}>
                            {itemData.size}
                        </Text>
                    }
                </View>
            </View>
        </View>
    )
}

export default ListingItem

const styles = StyleSheet.create({})