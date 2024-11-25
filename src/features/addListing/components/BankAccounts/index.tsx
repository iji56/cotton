import { palette } from "@/components/styles/theme";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { reduxSelect } from "@/types/reduxHooks";
import React, { useEffect, useRef, useState } from "react";
import { BSS } from "./BankAccounts.styles";
import { keywords } from "../../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "@/components/elements/Button/IconButton";
import { faBank } from "@fortawesome/free-solid-svg-icons";
import { faBank as bank, faTrashAlt } from "@fortawesome/sharp-light-svg-icons";
import BottomSheets from "@/components/elements/BottomSheet";
import { faPencil } from "@fortawesome/sharp-regular-svg-icons";
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env'
import Loader from "@/components/elements/Loader";
import { errorToast, toastConfig } from "@/lib/toastConfig";
import Toast from "react-native-toast-message";
import ListingHeader from "../ListingHeader";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { ParamListBase, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const BankAccount = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const stripeID = reduxSelect(state => state.usermeta.stripe_account_id);
    const [snapPoint, setSnapPoint] = useState<string | number>(1);
    const [bankaccounts, setBankAccounts] = useState({
        bankAccounts: []
    });
    const [selectedBankId, setSelectedBankId] = useState('')
    const [loading, setLoading] = useState(false);
    const ref = useRef<any>();
    const isFocused = useIsFocused()

    useEffect(() => {
        const getAllBankAccounts = async () => {
            const response = await getBankAccounts();
            console.log("resposne  : ", response)
        }
        stripeID && getAllBankAccounts()
    }, [isFocused]);

    const getBankAccounts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-external-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    accountId: stripeID
                }),
            });

            const data = await response.json();
            console.log(data.externalAccount, 'all available payment methods')
            if (data?.error) {
                setLoading(false)
                errorToast(data.error);
                return;
            }
            if (data) {
                setBankAccounts({
                    bankAccounts: data.externalAccount.data
                });
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
            const payload = {
                accountId: stripeID,
                bankId: selectedBankId
            }
            const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/delete-external-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("delete response : ", data)
            if (data?.error) {
                errorToast(data.error)
            }
            await getBankAccounts()
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
            const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/set-default-external-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    connectedAccountId: stripeID,
                    externalAccountId: selectedBankId
                }),
            });

            const data = await response.json();
            console.log("set default response : ", data)
            await getBankAccounts()
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
        // handle code
    }

    const renderItem = ({ item, index }: { item: { bank_name: string, last4: string, id: string, default_for_currency: boolean }, index: number }) => {
        return (
            <View key={index} style={BSS.listItemContainer}>
                <FontAwesomeIcon icon={item.default_for_currency ? faBank : bank} size={20} style={BSS.icon} />
                <View style={{ flex: 1 }}>
                    <Text style={BSS.secondaryText}>{item?.bank_name}{` (xxxxxxx-${item?.last4})`}</Text>
                    {item.default_for_currency &&
                        <View style={BSS.default}>
                            <Text style={BSS.defaultText}>{keywords.default}</Text>
                        </View>
                    }
                </View>
                <IconButton
                    onPress={() => {
                        setSelectedBankId(item.id)
                        setSnapPoint(250)
                    }}
                    icon={faEllipsisVertical}
                    style={BSS.editIcon}
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
            {loading ?
                <Loader /> :
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{
                        flex: 1,
                        paddingLeft: insets.left,
                        paddingBottom: insets.bottom,
                        paddingRight: insets.right,
                    }}>
                    <ListingHeader title={keywords.bankAccounts} headerType='banks' />
                    <ScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={bankaccounts.bankAccounts}
                            ListFooterComponent={() => (
                                <TouchableOpacity style={BSS.buttonContainer} onPress={() => navigation.navigate("CreateBankAccount")}>
                                    <Text>{keywords.addBankAccount}</Text>
                                    <FontAwesomeIcon icon={faPlus} size={20} style={BSS.icon} />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <></>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </ScrollView>
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
                            <TouchableOpacity onPress={handleEdit} style={BSS.bottomButtonContainer}>
                                <FontAwesomeIcon icon={faPencil} size={20} />
                                <Text style={BSS.buttonText}>{keywords.editBankAccount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={BSS.bottomButtonContainer}>
                                <FontAwesomeIcon icon={faTrashAlt} size={20} color={palette.red} />
                                <Text style={[BSS.buttonText, { color: palette.red }]}>{keywords.deleteBankAccount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDefault} style={BSS.bottomButtonContainer}>
                                <FontAwesomeIcon icon={bank} size={20} />
                                <Text style={BSS.buttonText}>{keywords.setAsDefault}</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheets>

                </KeyboardAvoidingView>
            }
            <Toast config={toastConfig} />
        </View>
    )
}

export default BankAccount;