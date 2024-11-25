import { Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useCallback } from 'react';
import SDDP from './DropDownPicker.styles';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';


type DropDownPickerProp = {
    options: string[];
    selectedOption: string;
    onChange: (option: string) => void;
    bottomSheetRef: any;
    snapPoint: number;
    setSnapPoint: Dispatch<SetStateAction<number>>;
}


const DropDownPicker = ({ options, onChange, snapPoint, setSnapPoint, bottomSheetRef }: DropDownPickerProp) => {

    const handleSheetChanges = useCallback((index: number) => {
        if (index > 0) {
            setSnapPoint(index);
        }else{
            setSnapPoint(1);
        }
    }, []);

    const handleClose = () => {
        bottomSheetRef?.current?.snapToIndex(1); // Snap to the closed position
        setSnapPoint(2); // Reset the snap point for the next open
    };

    const renderItem = ({ item, index }: { item: string, index: number }) => (
        <TouchableOpacity style={SDDP.item} onPress={() => onChange(item)} key={index}>
            <Text style={SDDP.text}>{item}</Text>
        </TouchableOpacity>
    )

    return (
        <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={[1, snapPoint]}
            detached
            onClose={handleClose}>
            <BottomSheetFlatList
                data={options}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={SDDP.seperator} />}
                showsVerticalScrollIndicator={false}
            />
        </BottomSheet >
    )
}

export default DropDownPicker