import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import FFM from './FeedFilterModal.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import H2 from '@/components/elements/H2';
import H1 from '@/components/elements/H1';
import AccordionItem from '@/components/elements/Accordion';
import FilterSectionButton from '@/components/elements/Button/FilterSectionButton';
import { listingColors, pantSizes, shoeSizes, dressSizes, topsSizes, listingTypes, listingAccessoriesMicroCategories, listingDressesMicroCategories, listingTwoPieceMicroCategories, listingJacketsMicroCategories, listingJeansMicroCategories, listingPantsMicroCategories, listingShortsMicroCategories, listingSkirtsMicroCategories, listingTopsMicroCategories, listingSweatersMicroCategories, listingShoesMicroCategories, listingSwimsMicroCategories } from '../../utils/filters';
import RangeSlider from '@/components/elements/Forms/RangeSlider';
import Button from '@/components/elements/Button/Button';
import { Checkbox } from '@/components/elements/Forms/CheckBox';
import { getBrands } from '../../api/getBrands';
import { palette } from '@/components/styles/theme';
import { FilterOptions, FilterProps } from '../../types/supabaseListings';
import { FeedMainContext } from '../../context/FeedMainContext';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FeedFilterModalProps = {
    visible: boolean;
    toggleVisible: Dispatch<SetStateAction<boolean>>;
    handleApply: ({ ...args }: FilterOptions) => void;
};

const FeedFilterModal = ({ visible, toggleVisible, handleApply }: FeedFilterModalProps) => {
    const { selectedFilters } = useContext(FeedMainContext)
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [selectedMicroCategories, setSelectedMicroCategories] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [microCategories, setMicroCategories] = useState<string[]>([]);
    const [selectedbrand, setSelectedBrand] = useState<string[]>([]);
    const [selectedDistance, setSelectedDistance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [listingBrands, setListingBrands] = useState<string[]>([]);
    const [selectedCheck, setSelecteedCheck] = useState({
        newest: false,
        topRated: false,
    });
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const isFocused = useIsFocused()
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const filteredSizes = [];
        // if (selectedType.includes('pants')) {
        //     filteredSizes.push(...pantSizes);
        // }
        // if (selectedType.includes('tops')) {
        //     filteredSizes.push(...topsSizes);
        // }
        if (selectedType.includes('shoes')) {
            filteredSizes.push(...shoeSizes);
        }
        if (selectedType.includes('dresses') ||
            selectedType.includes('tops') ||
            selectedType.includes('two-piece set') ||
            selectedType.includes('jackets & coats')) {
            filteredSizes.push(...dressSizes);
        }
        if (
            selectedType.includes('shorts') ||
            selectedType.includes('pants') ||
            selectedType.includes('skirts')) {
            filteredSizes.push(...pantSizes);
        }
        setSizes(filteredSizes)

        const fiteredMicroCategories: string[] = [];
        selectedType.map(type => {
            if (type === listingTypes[0]) {
                fiteredMicroCategories.push(...listingAccessoriesMicroCategories)
            } else if (type === listingTypes[1]) {
                fiteredMicroCategories.push(...listingDressesMicroCategories)
            } else if (type === listingTypes[2]) {
                fiteredMicroCategories.push(...listingTwoPieceMicroCategories)
            } else if (type === listingTypes[3]) {
                fiteredMicroCategories.push(...listingJacketsMicroCategories)
            } else if (type === listingTypes[4]) {
                fiteredMicroCategories.push(...listingJeansMicroCategories)
            } else if (type === listingTypes[5]) {
                fiteredMicroCategories.push(...listingPantsMicroCategories)
            } else if (type === listingTypes[6]) {
                fiteredMicroCategories.push(...listingShortsMicroCategories)
            } else if (type === listingTypes[7]) {
                fiteredMicroCategories.push(...listingSkirtsMicroCategories)
            } else if (type === listingTypes[8]) {
                fiteredMicroCategories.push(...listingTopsMicroCategories)
            } else if (type === listingTypes[9]) {
                fiteredMicroCategories.push(...listingSweatersMicroCategories)
            } else if (type === listingTypes[10]) {
                fiteredMicroCategories.push(...listingShoesMicroCategories)
            } else if (type === listingTypes[11]) {
                fiteredMicroCategories.push(...listingSwimsMicroCategories)
            }
            setMicroCategories(fiteredMicroCategories)
        })

    }, [selectedType])

    useEffect(() => {
        if (selectedFilters.length > 0) {
            setSelectedDistance(selectedFilters[4] === "" ? 0 : parseFloat(selectedFilters[4]) || 0)
        }
        const fetchData = async () => {
            setIsLoading(true);
            const response = await getBrands();
            setListingBrands(response.map(brand => brand.brand))
            setIsLoading(false);
        }

        fetchData();
    }, [isFocused, visible]);

    const handleChange = (value: string, state: string[], setState: any) => {
        const copyState = [...state]; // Create a copy of the state

        if (copyState.includes(value)) {
            // Remove the color if it's already selected
            const index = copyState.indexOf(value);
            copyState.splice(index, 1);
        } else {
            // Add the color if it's not selected
            copyState.push(value);
        }

        // Update the state
        setState(copyState);
    };

    const handleClearFilter = () => {
        setSelectedType([]);
        setSelectedMicroCategories([]);
        setSelectedSize([]);
        setSelectedBrand([]);
        setSelectedDistance(0);
        setSelectedColors([]);
        setSelecteedCheck({ topRated: false, newest: false })
    }

    const Filters = ({ data, selectedFilter, stateUpdate }: FilterProps) => data.map((item, index) => (
        <FilterSectionButton
            key={index}
            id={item}
            title={item}
            onPress={() => stateUpdate(item)}
            isSelected={selectedFilter.includes(item)}
        />
    ))

    return (
        <Modal visible={visible} onRequestClose={() => toggleVisible(!visible)}>
            <View style={[FFM.header, {
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }]}>
                <TouchableOpacity onPress={() => toggleVisible(false)}>
                    <FontAwesomeIcon icon={'close'} size={20} />
                </TouchableOpacity>
                <H1 text='Filters' />
                <H2 text='Clear All' onPress={handleClearFilter} />
            </View>
            <View style={FFM.line} />


            <ScrollView contentContainerStyle={[FFM.container, { justifyContent: isLoading ? 'center' : 'flex-start' }]} showsVerticalScrollIndicator={false}>
                {isLoading ?
                    <ActivityIndicator size={'small'} color={palette.black} /> :

                    <>
                        {/* Listing type section starts */}
                        <AccordionItem title='Product type'  >
                            <View style={FFM.accordianHeader}>
                                <Filters data={listingTypes} selectedFilter={selectedType} stateUpdate={(value) => handleChange(value, selectedType, setSelectedType)} />
                            </View>
                        </AccordionItem>
                        <View style={FFM.line} />
                        {/* Listing type section ends */}

                        {/* Listing size section starts */}
                        {selectedType.length > 0 &&
                            <>
                                <AccordionItem title='Micro-category'>
                                    <View style={FFM.accordianHeader}>
                                        <Filters data={[...new Set(microCategories)]} selectedFilter={selectedMicroCategories} stateUpdate={(value) => handleChange(value, selectedMicroCategories, setSelectedMicroCategories)} />
                                    </View>
                                </AccordionItem>
                                <View style={FFM.line} />
                            </>
                        }
                        {/* Listing size section ends */}

                        {/* Listing size section starts */}
                        {selectedType.some(type => ['pants', 'tops', 'shoes', 'dresses', 'two-piece set', 'jackets & coats', 'shorts', 'skirts'].includes(type)) &&
                            <>
                                <AccordionItem title='Size'>
                                    <View style={FFM.accordianHeader}>
                                        <Filters data={[...new Set(sizes)]} selectedFilter={selectedSize} stateUpdate={(value) => handleChange(value, selectedSize, setSelectedSize)} />
                                    </View>
                                </AccordionItem>
                                <View style={FFM.line} />
                            </>
                        }
                        {/* Listing size section ends */}

                        {/* Listing color section starts */}
                        <AccordionItem title='Colour' >
                            <View style={FFM.accordianHeader}>
                                <Filters data={listingColors} selectedFilter={selectedColors} stateUpdate={(value) => handleChange(value, selectedColors, setSelectedColors)} />
                            </View>
                        </AccordionItem>
                        <View style={FFM.line} />
                        {/* Listing color section ends */}

                        {/* Listing Brand section starts */}
                        <AccordionItem title='Brand'>
                            <View style={FFM.accordianHeader}>
                                <Filters data={listingBrands} selectedFilter={selectedbrand} stateUpdate={(value) => handleChange(value, selectedbrand, setSelectedBrand)} />
                            </View>
                        </AccordionItem>
                        <View style={FFM.line} />
                        {/* Listing Brand section ends */}

                        {/* Listing Distance section starts */}
                        <AccordionItem title='Distance' >
                            <View style={[FFM.accordianHeader, { marginLeft: 5 }]}>
                                <RangeSlider value={selectedDistance} setValue={setSelectedDistance} />
                            </View>
                        </AccordionItem>
                        <View style={FFM.line} />
                        {/* Listing Distance section ends */}

                        {/* Listing Sort By section starts */}


                        {/* <AccordionItem title='Sort By' >
                    <View style={[FFM.accordianHeader, { flexDirection: 'column', justifyContent: 'flex-start' }]}>
                        <Checkbox label='Newest'
                            isChecked={selectedCheck.newest}
                            onClick={() => setSelecteedCheck({ ...selectedCheck, newest: !selectedCheck.newest })}
                        />
                        <Checkbox label='Top rated'
                            isChecked={selectedCheck.topRated}
                            onClick={() => setSelecteedCheck({ ...selectedCheck, topRated: !selectedCheck.topRated })}
                        />
                    </View>
                </AccordionItem>
                <View style={FFM.line} /> */}


                        {/* Listing Sort By section ends */}

                        {/* Apply all selected Filter button  */}
                    </>
                }
            </ScrollView>
            <View style={FFM.button}>
                <Button
                    text='Apply'
                    variant='main'
                    onPress={() => {
                        handleApply({
                            color: selectedColors,
                            brand: selectedbrand,
                            check: selectedCheck,
                            size: selectedSize,
                            type: selectedType,
                            distance: selectedDistance,
                            microCategories: selectedMicroCategories
                        });
                        toggleVisible(!visible)
                    }}
                />
            </View>
        </Modal>
    )
}

export default FeedFilterModal