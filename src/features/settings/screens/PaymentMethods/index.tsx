import { palette } from "@/components/styles/theme";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsHeader from "../../components/SettingsHeader";
import { reduxSelect } from "@/types/reduxHooks";
import React, { useEffect, useRef, useState } from "react";
import { SSS } from "./PaymentMethods.styles";
import { ParamListBase, useIsFocused, useNavigation } from "@react-navigation/native";
import { keywords } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "@/components/elements/Button/IconButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { faBank, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faBank as bank, faTrashAlt } from "@fortawesome/sharp-light-svg-icons";
import BottomSheets from "@/components/elements/BottomSheet";
import { faPencil } from "@fortawesome/sharp-regular-svg-icons";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env'
import Loader from "@/components/elements/Loader";
import { toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import { PaymentCard } from "../../types/payment";

const PaymentMethods = () => {

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const customerId = reduxSelect(state => state.usermeta.stripe_customer_id);
  const [snapPoint, setSnapPoint] = useState<string | number>(1);
  const [paymentMethods, setPaymentMethods] = useState({
    defaultPaymentMethodId: '',
    paymentMethods: []
  });

  const [selectedPayment, setSelectedPayment] = useState<PaymentCard>()
  const [loading, setLoading] = useState(false);
  const ref = useRef<any>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const getAllPaymentMethods = async () => {
      const response = await getPaymentMethods();
      console.log("resposne  : ", response)
    }
    getAllPaymentMethods()
  }, [isFocused]);

  const getPaymentMethods = async () => {
    try {
      if (!customerId) {
        return;
      }
      setLoading(true)
      const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-payment-method-with-default`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          customerId: customerId
        }),
      });

      const data = await response.json();
      console.log(data.paymentMethods, 'all available payment methods')
      if (data) {
        setPaymentMethods(data);
      }
      setLoading(false)
      return data
    }
    catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    setSnapPoint(1)
    try {
      const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/delete-payment-method`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          paymentMethodId: selectedPayment?.id
        }),
      });

      const data = await response.json();
      console.log("delete response : ", data)
      await getPaymentMethods()
      return {
        data,
      };
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleDefault = async () => {
    setLoading(true)
    setSnapPoint(1)
    try {
      const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/set-default-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          paymentMethodId: selectedPayment?.id,
          customerId: customerId
        }),
      });

      const data = await response.json();
      console.log("set default response : ", data)
      await getPaymentMethods()
      return {
        data,
      };
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleEdit = () => {
    setSnapPoint(1)
    navigation.navigate("CreatePaymentMethod", { payment: selectedPayment })
  }

  const renderItem = ({ item, index }: { item: PaymentCard, index: number }) => {
    return (
      <View key={index} style={SSS.listItemContainer}>
        <FontAwesomeIcon icon={item.id === paymentMethods.defaultPaymentMethodId ? faBank : bank} size={20} style={SSS.icon} />
        <View style={{ flex: 1 }}>
          <Text style={SSS.secondaryText}>{item?.card?.brand}{` (xxxxxxx-${item?.card?.last4})`}</Text>
          {item.id === paymentMethods.defaultPaymentMethodId &&
            <View style={SSS.default}>
              <Text style={SSS.defaultText}>{keywords.default}</Text>
            </View>
          }
        </View>
        <IconButton // address nearby
          onPress={() => {
            setSelectedPayment(item)
            setSnapPoint(250)
          }}
          icon={faEllipsisVertical}
          style={SSS.editIcon}
        />
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: palette.white,
      }}
    >
      <SettingsHeader headerTitle={keywords.paymentMethods} />
      {loading ?
        <Loader /> :
        <FlatList
          data={paymentMethods.paymentMethods}
          ListFooterComponent={() => (
            <View style={SSS.buttonContainer}>
              <Text>{keywords.addPaymentMethod}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("CreatePaymentMethod")} style={SSS.plusIcon}>
                <FontAwesomeIcon icon={faPlus} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => (
            <></>
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />

      }
      <BottomSheets bottomSheetRef={ref} handleSheetChanges={(index: number) => {
        if (index > 0) {
          setSnapPoint(index);
        } else {
          setSnapPoint(1);
        }
      }}
        snapPoint={snapPoint}
        setSnapPoint={setSnapPoint}>
        <View style={{ width: '100%', paddingLeft: '5%' }}>
          <TouchableOpacity onPress={handleEdit} style={SSS.bottomButtonContainer}>
            <FontAwesomeIcon icon={faPencil} size={20} />
            <Text style={SSS.buttonText}>{keywords.editPaymentMethod}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={SSS.bottomButtonContainer}>
            <FontAwesomeIcon icon={faTrashAlt} size={20} color={palette.red} />
            <Text style={[SSS.buttonText, { color: palette.red }]}>{keywords.deletePaymentMethod}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDefault} style={SSS.bottomButtonContainer}>
            <FontAwesomeIcon icon={bank} size={20} />
            <Text style={SSS.buttonText}>{keywords.setAsDefault}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheets>
      <Toast config={toastConfig} />
    </View >
  )
}

export default PaymentMethods;