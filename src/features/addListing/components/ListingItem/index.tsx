import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H2 from '@/components/elements/H2'
import SLI from './ListingItem.styles'
import { placeholderPicture } from '@/features/borrow/utils/staticTexts'
import Video from 'react-native-video'

type ListingItemProp = {
    itemData: any
}

const ListingItem = ({ itemData }: ListingItemProp) => {
    const isVideo = itemData?.images?.path.lastIndexOf('.mp4')
    return (
        <View style={SLI.listingContainer}>
            {isVideo !== -1 ?
                <Video
                    source={{ uri: itemData?.images.path }}
                    style={SLI.image}
                    controls={true}
                    repeat={true}

                /> :
                <Image style={SLI.image} source={{ uri: itemData?.images ? itemData?.images?.sourceURL || itemData?.images?.path : placeholderPicture }} />
            }
            <View style={SLI.caption}>
                <View style={SLI.title}>
                    <H2 text={itemData?.name} />
                </View>
                <Text></Text>
                <View style={SLI.details}>
                    <Text style={SLI.type}>
                        {itemData.type || 'Tops'} | {itemData.size}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default ListingItem

const styles = StyleSheet.create({})