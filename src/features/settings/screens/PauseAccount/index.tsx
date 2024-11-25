import { View, Text, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import SettingsHeader from '../../components/SettingsHeader'
import { keywords } from '../../utils/keywords'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '@/components/styles/theme'
import Button from '@/components/elements/Button/Button'
import SPA from './PauseAccount.styles'
import { Calendar, DateData } from 'react-native-calendars'
import { fillDates } from '@/features/borrow/utils/fillDates'
import { convertDateStringToNumber } from '@/features/borrow/utils/convertDateStringToNumber'
import { checkDateCollisions } from '@/features/borrow/utils/checkDateCollisions'
import { errorToast, toastConfig } from '@/lib/toastConfig'
import Toast from 'react-native-toast-message'
import { pauseAccount } from '../../api/pauseAccount'
import { reduxSelect } from '@/types/reduxHooks'
import { useNavigation } from '@react-navigation/native'
import BottomSheets from '@/components/elements/BottomSheet'
import H2 from '@/components/elements/H2'

const PauseAccount = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { id } = reduxSelect(state => state.usermeta);
    const [disabledDates, setDisabledDates] = useState({});
    const [selectedDates, setSelectedDates] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [bottomSheethide, setBottomSheetHide] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<string | undefined>(undefined);
    const [selectedEndDate, setSelectedEndDate] = useState<string | undefined>(undefined);
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const ref = useRef<any>(null);

    let today = new Date();
    today.setDate(today.getDate());
    let minDateAvailable = today.toISOString().split('T')[0];
    const referenceDate = parseInt(today.toISOString().split('T')[0].replace(/-/g, ''), 10);

    const selectDate = (date: string) => {
        try {
            if (selectedStartDate === undefined) {
                setSelectedStartDate(date);
            } else if (selectedEndDate === undefined) {
                setSelectedEndDate(date);
            } else {
                setMarkedDates({})
                setSelectedStartDate(date);
                setSelectedEndDate(undefined);

                const startDate = convertDateStringToNumber(date);
                const endDate = convertDateStringToNumber(date);
                let collisions = checkDateCollisions(startDate, endDate, disabledDates);
                if (!collisions && startDate && endDate) {
                    let range = fillDates([startDate, endDate], false, false, referenceDate)
                    console.log(range)
                    setSelectedDates(range);
                    setMarkedDates({
                        ...disabledDates,
                        ...range
                    });
                }
                return
            }

            const startDate = convertDateStringToNumber(selectedStartDate || date);
            const endDate = convertDateStringToNumber(selectedEndDate || date);
            let collisions = checkDateCollisions(startDate, endDate, disabledDates);
            if (!collisions && startDate && endDate) {
                let range = fillDates([startDate, endDate], false, false, referenceDate)
                console.log(range)
                setSelectedDates(range);
                setMarkedDates({
                    ...disabledDates,
                    ...range
                });
            } else {
                return;
            }
        } catch (e) {
            console.log("Error : ", e)
        }
    }

    const handlePauseAccount = async () => {
        setLoading(true)
        if (selectedStartDate && selectedEndDate) {
            console.log(selectedStartDate, selectedEndDate)
            const response = await pauseAccount(id!, selectedStartDate, selectedEndDate)
            console.log("pause account response : ", response)
            // navigation.goBack()
            setBottomSheetHide(true)
            setSnapPoint('40%');
        } else {
            errorToast("Select any two dates");
        }
        setLoading(false)
    }

    const handleHome = () => {
        setSnapPoint(2)
        setTimeout(() => {
            navigation.reset({
                routes: [{ name: 'PrimaryNav' }],
                index: 0
            })
        }, 100)
    }

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: palette.white,
            }}>
            <SettingsHeader headerTitle={keywords.pauseAccount} />
            <ScrollView contentContainerStyle={SPA.container} showsVerticalScrollIndicator={false}>
                <Text style={SPA.text}>{keywords.pauseAccountMessage}</Text>
                <Text style={SPA.boldText}>{keywords.howLongWantToPauseAccount}</Text>
                <Calendar
                    minDate={minDateAvailable}
                    onDayPress={(day: DateData) => selectDate(day.dateString)}
                    markedDates={markedDates}
                    markingType='period'
                />
                <Text style={SPA.text}>{keywords.unpauseAccountMessage}</Text>
            </ScrollView>
            <View style={SPA.button}>
                <Button text={keywords.pauseMyAccount} onPress={handlePauseAccount} variant='main' loading={loading} />
            </View>
            <BottomSheets bottomSheetRef={ref} handleSheetChanges={(index: number) => {
                if (index > 2) {
                    setSnapPoint(index);
                } else {
                    bottomSheethide && handleHome()
                }
            }}
                snapPoint={snapPoint}
                setSnapPoint={setSnapPoint}>
                <View style={SPA.header}>
                    <H2 style={SPA.title} text={keywords.accountPaused} />
                </View>
                <View style={SPA.bottomButtonContainer}>
                    <Text style={SPA.messageText}>{keywords.yourAccountHasBeenPausedMessage}</Text>
                    <Text style={SPA.messageText}>{keywords.youCanUnpauseMessage}</Text>
                    <View style={SPA.button} >
                        <Button text={keywords.home} onPress={handleHome} variant='main' loading={loading} />
                    </View>
                </View>
            </BottomSheets>
            <Toast config={toastConfig} />
        </View>
    )
}

export default PauseAccount