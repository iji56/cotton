import { View } from 'react-native'
import React, { Dispatch, SetStateAction, useState, } from 'react'
import SLC from './ListingCalender.styles'
import { keywords } from '../../utils/keywords'
import H1 from '@/components/elements/H1'
import { Calendar } from 'react-native-calendars'
import { getNextFourDates } from '@/features/borrow/utils/nextFourDays'
import { convertDateStringToNumber } from '@/features/borrow/utils/convertDateStringToNumber'
import { checkDateCollisions } from '@/features/borrow/utils/checkDateCollisions'
import { fillDates } from '@/features/borrow/utils/fillDates'

interface DateDetails {
    selected: boolean;
    disableTouchEvent: boolean;
    selectedColor: string;
}

type PropType = {
    selectedDates: any[];
    setSelectedDates: Dispatch<SetStateAction<Record<string, DateDetails>>>;
}

const ListingCalender = ({ selectedDates, setSelectedDates }: PropType) => {
    const [markedDates, setMarkedDates] = useState({});
    const [disabledDates, setDisabledDates] = useState({});
    let today = new Date();

    today.setDate(today.getDate());
    let minDateAvailable = today.toISOString().split('T')[0];
    const referenceDate = parseInt(today.toISOString().split('T')[0].replace(/-/g, ''), 10);


    const selectDate = (date: string) => {
        let nextFourDayDate = getNextFourDates(date, 1);
        const startDate = convertDateStringToNumber(date);
        const endDate = convertDateStringToNumber(nextFourDayDate[nextFourDayDate.length - 1]);
        let collisions = checkDateCollisions(startDate, endDate, disabledDates);
        if (!collisions) {
            let range = fillDates([startDate, endDate], false, false, referenceDate)
            console.log("range : ", range, selectedDates)
            const dateExists = selectedDates.some(dateObj => Object.keys(dateObj)[0] === date);
            let newSelectedDates=[...selectedDates];
            if (dateExists) {
                newSelectedDates = selectedDates.filter(dateObj => Object.keys(dateObj)[0] !== date);

            } else {
                if (selectedDates) {
                    newSelectedDates.push(range)
                } else {
                    newSelectedDates.push(range);
                }
            }
            setSelectedDates(newSelectedDates);

            const selectedDatesObject = newSelectedDates.reduce((acc, dateObj) => {
                const dateKey = Object.keys(dateObj)[0];
                acc[dateKey] = dateObj[dateKey];
                return acc;
            }, {});

            setMarkedDates({
                ...disabledDates,
                ...selectedDatesObject
            });
        } else {
            return;
        }
    }

    return (
        <View style={SLC.container}>
            <H1 text={keywords.selectPriod} />
            <Calendar
                minDate={minDateAvailable}
                onDayPress={day => selectDate(day.dateString)}
                markedDates={markedDates}
                markingType='period'
            />
        </View>
    )
}

export default ListingCalender