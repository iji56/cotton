import { Text, TouchableOpacity, View } from "react-native"
import ListingHeader from "../../../addListing/components/ListingHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/components/styles/theme";
import Wrapper from "@/components/Wrapper";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { fillDates } from "@/features/borrow/utils/fillDates";
import { getTakenDates } from "@/features/borrow/api/getTakenDates";
import { formatDateSB } from "@/utils/formatDateSB";
import Modal from 'react-native-modal';
import { supabase } from "@/lib/supabase";
import BorrowHeader from "../../components/BorrowHeader";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SED } from "./EditDates.styles";

type MarkedDateType = {
  [date: string]: {
    selected: boolean;
    disableTouchEvent: boolean;
    selectedColor: string;
  };
};

// TODO: distinguish blocked dates, make them untoggleable. Maybe don't throw them into disabledDates, keep them within selectedDates so you can unselect them
// TODO: add max 90 days to calendar
const EditDates = ({ route }) => {
  const navigation  = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets      = useSafeAreaInsets();
  let itemPayload   = route.params.listingData;
  let today         = new Date();
  let todayDate     = today.toISOString().split('T')[0];
  let referenceDate = parseInt(todayDate.replace(/-/g, ''), 10);

  /**
   * disabledDates = unavailable due to existing transactions
   * selectedDates = use selected based on user input
   * markedDates   = used for calendar render. disabled + selected
   */
  const [originalDates, setOriginalDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [disabledDates, setDisabledDates] = useState({});
  const [markedDates, setMarkedDates]     = useState<MarkedDateType>({});
  const [loading, setLoading]             = useState<boolean>(false);
  const [error, setError]                 = useState<string | null>(null);
  const [modal, setModal]                 = useState<boolean>(false);
  const [paused, setPaused]               = useState<boolean>(route.params.listingData.paused);
  
  const convertTimestampToDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear(); // Use UTC methods
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC methods
    const day = String(date.getUTCDate()).padStart(2, '0'); // UTC methods
    return `${year}-${month}-${day}`;
  };

  const getCurrentDates = async (listing_id: string) => {
    try {
      // listings_borrow
      const datesBorrowed: number[] = [];
      const transactions = await getTakenDates(listing_id);
      
      transactions?.forEach((item) => {
        // Convert item borrow_start and borrow_end to YYYYMMDD format using formatDateSB
        const borrowStart = formatDateSB(item.borrow_start);
        const borrowEnd = formatDateSB(item.borrow_end);
  
        // Compare with today's date to decide if they should be added
        if (borrowStart >= referenceDate || borrowEnd >= referenceDate) {
          datesBorrowed.push(borrowStart);
          datesBorrowed.push(borrowEnd);
        }
      });
  
      const disabledDates = fillDates(datesBorrowed, false, true, referenceDate);
      setDisabledDates(disabledDates);
      setMarkedDates(disabledDates);
  
      // listings_availability
      const { data: availabilityData, error: availabilityError } = await supabase
      .from('listings_availability')
      .select('date')
      .eq('listing_id', listing_id)
      .gte('date', todayDate);
  
      if (availabilityError) throw new Error(availabilityError.message);
      if (availabilityData) {
        const newSelectedDates = availabilityData.map((item: any) => item.date);
        setOriginalDates((prevDates) => [...prevDates, ...newSelectedDates]);
        setSelectedDates((prevSelectedDates) => [...prevSelectedDates, ...newSelectedDates]); // Add to selectedDates
  
        // for cal picker render
        const updatedMarkedDates = { ...markedDates };
        newSelectedDates.forEach((date: string) => {
          updatedMarkedDates[date] = { selected: true, disableTouchEvent: false, selectedColor: '#FED878' };
        });
        const mergedMarkedDates = { ...disabledDates, ...updatedMarkedDates };
        setMarkedDates(mergedMarkedDates);
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const selectDate = (date: string) => {
    if (selectedDates.includes(date)) {
      // Date is already selected, so deselect it
      const updatedSelectedDates = selectedDates.filter((selectedDate) => selectedDate !== date);
      setSelectedDates(updatedSelectedDates);
  
      // Update markedDates to remove the selected date
      const updatedMarkedDates = { ...markedDates };
      delete updatedMarkedDates[date];
      setMarkedDates(updatedMarkedDates);
    } else {
      // Date is not selected, so select it
      const updatedSelectedDates = [...selectedDates, date].sort(); // Ensure dates are sorted chronologically
      setSelectedDates(updatedSelectedDates);
  
      // Update markedDates to add the selected date
      const updatedMarkedDates = { ...markedDates, [date]: { selected: true, disableTouchEvent: false, selectedColor: '#FED878' } };
      setMarkedDates(updatedMarkedDates);
    }
  }

  const clearSelectedDates = () => {
    // Clear the selectedDates array
    setSelectedDates([]);
    
    // Remove selected dates from markedDates
    const updatedMarkedDates = { ...markedDates };
    selectedDates.forEach((date) => {
      delete updatedMarkedDates[date];
    });
    setMarkedDates(updatedMarkedDates);
  };

  const saveSelectedDates = async () => {
    try {
      setLoading(true);
      const datesToRemove = originalDates.filter(date => !selectedDates.includes(date));
      const newDatesToSave = selectedDates.filter(date => !originalDates.includes(date));

      // delete unselected dates
      if (datesToRemove.length > 0) {
        for (const date of datesToRemove) {
          const { data, error } = await supabase
            .from('listings_availability')
            .delete()
            .eq('listing_id', itemPayload.id)
            .eq('date', date)
            .select();
  
          if (error) throw new Error((error).message);
        }
      }

      // add newly selected dates
      if (newDatesToSave.length > 0) {
        const insertData = newDatesToSave.map(date => ({ listing_id: itemPayload.id, date: date }));
        const { data, error } = await supabase
          .from('listings_availability')
          .insert(insertData)
          .select();

        if (error) throw new Error(error.message);
      }

      setOriginalDates([]);
      setSelectedDates([]);
      setDisabledDates({});
      setMarkedDates({});
      getCurrentDates(itemPayload.id);
      setLoading(false);
    } catch (error) {
      throw new Error((error as Error).message);
      setLoading(false);
    }
  };

  const pauseListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update({
          paused: !paused 
        })
        .eq('id', itemPayload.id)
        .select()

      if (error) throw new Error((error).message);
      if (data) {
        itemPayload = data[0];
        setPaused(data[0].paused);
        setModal(false);
      }
      
    } catch (error) {
      setError((error as Error).message);
      setModal(false);
    }
  }

  useEffect(() => {
    getCurrentDates(itemPayload.id);
  }, [])

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: theme.colors.background
      }}
    >
      <BorrowHeader headerType="edit" backNavPayload={itemPayload} />
        { paused ? (
          <Wrapper>
            <View style={SED.wallContainer}>
              <Text style={SED.wallText}>This listing is currently paused, meaning that users can view and favourite your listing, but cannot borrow it. Unpause this listing to allow users to borrow this item again, and to block future dates.</Text>
              <View style={SED.submissionContainer}>
                <TouchableOpacity
                  onPress={() => pauseListing()}
                  style={SED.buttonInput}
                >
                  <Text style={SED.buttonInputContent}>unpause listing</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Wrapper>
        ) : (
          <Wrapper>
            <View style={SED.main}>
              <Calendar
                minDate={todayDate}
                onDayPress={day => selectDate(day.dateString)}
                markedDates={markedDates}
              />
            </View>
            <View style={SED.submissionContainer}>
              <TouchableOpacity
                onPress={() => setModal(true)}
                style={SED.buttonInput}
              >
                <Text style={SED.buttonInputContent}>pause listing</Text>
              </TouchableOpacity>
              {selectedDates.length > 0 ?
                <TouchableOpacity
                  onPress={() => clearSelectedDates()}
                  style={SED.buttonInput}
                >
                  <Text style={SED.buttonInputContent}>clear</Text>
                </TouchableOpacity> 
              : null}
              <TouchableOpacity
                onPress={() => saveSelectedDates()}
                style={SED.buttonInput}
              >
                <Text style={SED.buttonInputContent}>save</Text>
              </TouchableOpacity>
            </View>
          </Wrapper>
        )}
        <Modal
          isVisible={modal}
          style={SED.modalBackground}
          propagateSwipe={true}
        >
          <View style={SED.modalContainer}>
            <Wrapper>
              <Text>This listing is active. Pausing will prevent users from borrowing this item, but they may still view and favourite it.</Text>
              <View style={SED.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => pauseListing()}
                  style={SED.navButton}
                >
                  <Text>pause listing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  style={SED.navButton}
                >
                  <Text style={SED.navNuttonText}>cancel</Text>
                </TouchableOpacity>
              </View>
            </Wrapper>
          </View>
        </Modal>
        { loading ? (
        <View style={SED.load}><Text style={SED.loadText}>Loading...</Text></View>
      ) : null }
    </View>
  )
}

export default EditDates;