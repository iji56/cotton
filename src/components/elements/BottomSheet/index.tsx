import React, { Dispatch, ReactNode, SetStateAction, } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import SBS from './BottomSheet.styles';

interface BottomSheetProp {
    bottomSheetRef: any;
    handleSheetChanges: (index: number) => void;
    children: ReactNode,
    snapPoint: number | string;
    setSnapPoint: Dispatch<SetStateAction<number | string>>;
}

const BottomSheets = ({ bottomSheetRef, handleSheetChanges, children, snapPoint, setSnapPoint }: BottomSheetProp) => {

    const handleClose = () => {
        bottomSheetRef?.current?.snapToIndex(1); // Snap to the closed position
        setSnapPoint && setSnapPoint(2); // Reset the snap point for the next open
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            onChange={handleSheetChanges}
            enablePanDownToClose
            snapPoints={[
                1,
                snapPoint,
                typeof snapPoint === 'number'
                    ? snapPoint + 1
                    : `${parseInt(snapPoint.split("%")[0], 10) + 1}%`
            ]}
            onClose={handleClose}
            style={{ marginTop: 2 }}
        >
            <BottomSheetView style={SBS.contentContainer}>
                {children}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default BottomSheets