import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FeedMainContext } from '../../context/FeedMainContext';
import Wrapper from '@/components/Wrapper';
import FeedChip from '../FeedChip';
import FLV from './FeedListView.styles';
import ClothItem from '../ClothItem';
import { occasionFilters } from '../../utils/filters';
import { palette } from '@/components/styles/theme';
import H2 from '@/components/elements/H2';
import PeopleItem from '../PeopleItem';
import Loader from '../Loader';
import { ListViewPropType } from '../../types/feedNav';

const FeedListView = ({ handleFilter }: ListViewPropType) => {
    const {
        listingData,
        page,
        setPage,
        refreshing,
        setRefreshing,
        selectedFilters,
        setSelectedFilters,
    } = useContext(FeedMainContext);

    const [filtersSelected, setFiltersSelected] = useState<'both' | 'cloth' | 'people'>('both');
    const [showAllClothe, setShowAllCloth] = useState(false);
    const [showAllPeople, setShowAllPeople] = useState(false);
    // used memo to calculate number of filters selected
    const filterSelectedCount = useMemo(() => {
        const filteredCount = selectedFilters.flat().filter(filter => filter && !occasionFilters.includes(filter)).length;
        return filteredCount;
    }, [selectedFilters, occasionFilters]);

    const itemsPerPage = 8;
    const flatListRef = useRef<FlatList | null>(null);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
        }
        // this will render every time when user change filter and this is used to track filter type e.g. cloth, people or both cloth and people
        setFiltersSelected((prev) => {
            let type = '';
            if (selectedFilters.length === 0 ||
                (selectedFilters[0].length === 0 &&
                    selectedFilters[1].length === 0 &&
                    selectedFilters[2].length === 0 &&
                    selectedFilters[3].length === 0 &&
                    selectedFilters[4] === "" &&
                    selectedFilters.length === 5)) {
                type = 'both'
            }
            else if (selectedFilters.includes(occasionFilters[0])) {
                type = 'people'
            }
            else if (!selectedFilters.includes(occasionFilters[0])) {
                type = 'cloth'
            }
            return type
        })
    }, [selectedFilters])

    // this will call when user change filter
    const toggleFilter = (filter: string) => {
        let newSelectedFilters = [...selectedFilters]; // maked copy of selected filters so that we can update it without changing orignal array
        if (filter === occasionFilters[0]) { // if user click people
            if (selectedFilters.includes(occasionFilters[0])) {
                // removing all other filters
                newSelectedFilters = [[], [], [], [], ""];
            } else {
                // removing all other filters and adding people filter
                newSelectedFilters = [[], [], [], [], "", filter];
            }
            setSelectedFilters(newSelectedFilters)
        } else if (occasionFilters.includes(filter)) {// if user click any occasion
            if (selectedFilters.length === 0) {
                // creating initial selected array if user first time selecting any filter
                newSelectedFilters = [[], [], [], [], "",]
            }
            // checking if user selected people filter?
            if (selectedFilters.includes(occasionFilters[0])) {
                // removing previous selected people filter and adding latest selected occassion filter
                let index = selectedFilters.indexOf(occasionFilters[0])
                newSelectedFilters.splice(index, 1, filter);
            } else { // when user apply any filter from filer modal
                // checking if user has selected any occasion filter
                if (selectedFilters.some(selectedFilter => occasionFilters.includes(selectedFilter))) {
                    occasionFilters.map(occasion => {
                        if (selectedFilters.includes(occasion)) {
                            // get selected occassion filter index value, 
                            let index = selectedFilters.indexOf(occasion)
                            if (occasion !== filter) {
                                // remove previous selected occasion filter and add latest selected occassion filter
                                newSelectedFilters.splice(index, 1, filter);
                            } else {
                                // if user click on select occasion filter then just remove it
                                newSelectedFilters.splice(index, 1);
                            }
                        }
                    })

                } else {
                    // just push the new selected filter
                    newSelectedFilters.push(filter)
                }
            }
            setSelectedFilters(newSelectedFilters);
        } else {
            for (let i = 0; i < 4; i++) {
                if (Array.isArray(newSelectedFilters[i]) && newSelectedFilters[i].includes(filter)) {
                    // checking if color is selected or not, if selected remove it else add it
                    let index = newSelectedFilters[i].indexOf(filter)
                    newSelectedFilters[i].splice(index, 1);
                    break;
                }
            }
            // for distance
            if (newSelectedFilters.includes(filter)) {
                let index = newSelectedFilters.indexOf(filter)
                // newSelectedFilters[index] ="";
                newSelectedFilters.splice(index, 1);
            }
            setSelectedFilters(newSelectedFilters);
        }
    }


    const onRefresh = () => {
        setRefreshing(true);
        setPage(page == 1 ? 0 : 1); // This will trigger the useFocusEffect
        // No need to explicitly call fetchData here since setPage(1) will do it via useFocusEffect
    };

    // function to get specific filters icons
    const getIcon = (icon: string) => {
        let image = null;
        switch (icon) {
            case 'all': image = require('../../../../components/assets/all.png')
                break;
            case 'formal': image = require('../../../../components/assets/formal.png')
                break;
            case 'work': image = require('../../../../components/assets/work.png')
                break;
            case 'bridal': image = require('../../../../components/assets/bridal.png')
                break;
            case 'festival': image = require('../../../../components/assets/festival.png')
                break;
            case 'night out': image = require('../../../../components/assets/out.png')
                break;
            case 'vacation': image = require('../../../../components/assets/vacation.png')
                break;
            case 'wedding guest': image = require('../../../../components/assets/wedding.png')
                break;
            default: null;
                break;
        }
        return image;
    }

    const showAllClothes = () => {
        setShowAllCloth(!showAllClothe)
    }

    const showAllPeoples = () => {
        setShowAllPeople(!showAllPeople)
    }

    const handleResetFilter = () => {
        setSelectedFilters([])
    }

    const renderClothItem = ({ item, index, separators }: any) => {
        return <ClothItem item={item} index={index} separators={separators} />;
    };

    const renderPeopleItem = ({ item, index, separators }: any) => {
        return <PeopleItem item={item} index={index} separators={separators} />;
    };


    const ClothesView = () => (
        <>
            <H2 text='Items' />
            <FlatList
                contentContainerStyle={FLV.container}
                keyboardDismissMode='on-drag'
                ref={flatListRef} // Assign the ref here
                data={filtersSelected !== 'both' ? listingData?.length > 0 ? listingData : listingData?.clothes : showAllClothe ? listingData?.clothes : listingData?.clothes || []}
                renderItem={renderClothItem}
                keyExtractor={(item, index) => item.id.toString()} // Use index as the key
                onEndReached={() => {
                    // Trigger pagination only if the last page was full
                    if (listingData.length % itemsPerPage === 0 && listingData.length >= itemsPerPage) {
                        setPage(prevPage => prevPage + 1);
                    }
                }}
                onEndReachedThreshold={0.75}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            {/* {
                filtersSelected === 'both' && listingData?.clothes?.length > 2 && <TouchableOpacity onPress={showAllClothes}>
                    <View style={FLV.line} />
                    <H2 text={showAllClothe ? 'Hide all items' : 'See all items'} style={{ textAlign: 'center' }} />
                    <View style={FLV.line} />
                </TouchableOpacity>
            } */}
        </>
    );

    const PeoplesView = () => {
        return (
            <>
                <H2 text='people' />
                <FlatList
                    contentContainerStyle={FLV.container}
                    keyboardDismissMode='on-drag'
                    ref={flatListRef} // Assign the ref here
                    data={filtersSelected !== 'both' ? listingData?.length > 0 ? listingData : listingData?.people : showAllPeople ? listingData?.people : listingData?.people || []}
                    renderItem={renderPeopleItem}
                    keyExtractor={(item, index) => item.id.toString()} // Use index as the key
                    onEndReached={() => {
                        if (listingData.length % itemsPerPage === 0 && listingData.length >= itemsPerPage) {
                            setPage(prevPage => prevPage + 1);
                        }
                    }}
                    onEndReachedThreshold={0.75}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                {/* {
                    filtersSelected === 'both' && listingData?.people?.length > 2 && <TouchableOpacity onPress={showAllPeoples}>
                        <View style={FLV.line} />
                        <H2 text={showAllPeople ? "Hide all users" : 'See all users'} style={{ textAlign: 'center' }} />
                        <View style={FLV.line} />
                    </TouchableOpacity>
                } */}
            </>
        )
    }
console.log("here123")
    return (
        <Wrapper>

            {/* Listing filter header section starts  */}

            <View style={FLV.filterContainer}>
                <TouchableOpacity onPress={handleFilter} style={FLV.filterButton}>
                    <Image source={require('../../../../components/assets/filter.png')} style={FLV.icon} />
                    {filterSelectedCount > 0 ?
                        <Text style={FLV.selectedFilter}>
                            {filterSelectedCount}
                        </Text>
                        :
                        <Text style={[FLV.selectedFilter, { backgroundColor: palette.lightGrey }]} />
                    }<Text >Filter </Text>
                </TouchableOpacity>
                <View style={FLV.divider} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    {/* make array of all selected filter with occasion filters, => here flat function is used to serialize color array  */}
                    {[...new Set([...selectedFilters, occasionFilters].flat())].filter(filter => filter !== '').map((item, index) => {
                        const iconName = getIcon(item)
                        return (
                            <FeedChip
                                key={index}
                                label={item}
                                selected={selectedFilters.flat().includes(item)}
                                onPress={() => toggleFilter(item)}
                                icon={iconName}
                                showCrossIcon={!occasionFilters.includes(item)}
                            />)
                    })}
                </ScrollView>
            </View>

            {/* Listing filter header section ends  */}
            {refreshing ? <Loader /> :

                listingData.length === 0 ? (
                    selectedFilters.length > 0 && <Text style={FLV.warningText}>No results. Please refine filters to show more items.</Text>

                ) : (
                    filtersSelected === 'cloth' ?
                        // view for cloth 
                        <ScrollView contentContainerStyle={FLV.scrollview} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
                            <View style={FLV.resultHeader}>
                                <Text>Showing {listingData.length ?? listingData?.clothes?.length} results</Text>
                                <TouchableOpacity style={FLV.filterButton} onPress={handleResetFilter}>
                                    <Text>reset</Text>
                                </TouchableOpacity>
                            </View>
                            {(listingData?.length > 0 || listingData?.clothes?.length > 0) && <ClothesView />}
                        </ScrollView> :
                        filtersSelected === 'people' ?
                            // view for people 
                            <ScrollView contentContainerStyle={FLV.scrollview} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
                                {(listingData?.length > 0 || listingData?.people?.length > 0) && <PeoplesView />}

                            </ScrollView> :
                            // view for both cloth and people
                            <ScrollView contentContainerStyle={FLV.scrollview} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
                                {listingData?.clothes?.length > 0 && <ClothesView />}
                                {listingData?.people?.length > 0 && <PeoplesView />}
                            </ScrollView>
                )

            }
        </Wrapper>
    );
}

export default FeedListView

const styles = StyleSheet.create({})