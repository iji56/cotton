import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Button from '@/components/elements/Button/Button'
import H2 from '@/components/elements/H2'
import { keywords } from '../../utils/keywords'
import SPA from './PayoutAccount.styles'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight, } from '@fortawesome/free-solid-svg-icons'
import H1 from '@/components/elements/H1'
import { faInfoCircle, faPlus } from '@fortawesome/pro-regular-svg-icons'
import PendingItem from '../PendingItem'
import { palette } from '@/components/styles/theme'
import BottomSheets from '@/components/elements/BottomSheet'
import { ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PaymentsMainContext } from '../../context/PaymentsMainContext'
import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env'
import { reduxSelect } from '@/types/reduxHooks'
import { checkRequirements } from '@/features/addListing/api/checkRequirements'
import { getUserListings } from '@/features/profile/api/getUserListings'
import Loader from '@/components/elements/Loader'
import { errorToast, toastConfig } from '@/lib/toastConfig'
import Toast from 'react-native-toast-message'

const PayoutAccount = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const { availableBal, totalEarning, ordersData, futureBal } = useContext(PaymentsMainContext);
    const user = reduxSelect(state => state.usermeta);

    const [snapPoint, setSnapPoint] = useState(1)
    const [bankAccount, setBankAccount] = useState<{ bank_name: string, last4: number } | null>(null);
    const bottomSheetRef = useRef<any>();
    const [hasListing, setHasListings] = useState(false);
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused()

    useEffect(() => {
        const getBankAccount = async () => {
            setLoading(true)
            user.stripe_account_id && await getBankAccounts();
            let listings = await getUserListings(user.id);
            setHasListings(listings.length > 0);
            setLoading(false)
        }
        getBankAccount();
    }, [isFocused]);

    const getBankAccounts = async () => {
        try {
            // for bank account /customer-list-bank-accounts
            const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-default-external-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    connectedAccountId: user.stripe_account_id
                }),
            });

            const data = await response.json();
            console.log(data, 'all available payment methods')
            if (data?.error) {
                // errorToast(data.error);
                return;
            }
            if (data) {
                setBankAccount(data?.defaultExternalAccount);
            }
            return data
        }
        catch (error) {
            console.log(error)
        }
    }


    const handleAddListing = () => {
        navigation.navigate("Add")
    }

    const handleAddAccount = async () => {
        try {
            setLoading(true)
            if (user.stripe_account_id) {
                const requirements = await checkRequirements(user.stripe_account_id);

                if (requirements?.errors?.some((error: { requirement: string }) => error.requirement === "individual.verification.document")) {
                    navigation.navigate("AddListing", {
                        screen: "UploadIdentityDocument"
                    })
                    setLoading(false)
                }
                else if (requirements?.eventually_due && requirements?.eventually_due.includes("individual.verification.proof_of_liveness")) {
                    navigation.navigate("AddListing", {
                        screen: "UploadAdditionalDocument"
                    })
                    setLoading(false)
                } else if (requirements) {
                    navigation.navigate("AddListing", {
                        screen: "BankAccounts"
                    })
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            } else {
                navigation.navigate("AddListing", {
                    screen: "CreateConnect"
                })
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleTotalEarning = () => {
        if (bankAccount) {
            navigation.navigate('TotalEarning');
        } else {
            errorToast(keywords.noLinkedAccountMessage)
        }
    }

    const handleFuturePayout = () => {
        if (bankAccount) {
            navigation.navigate('FuturePayout');
        } else {
            errorToast(keywords.noLinkedAccountMessage)
        }
    }

    const handleAvailablePayout = () => {
        if (bankAccount) {
            navigation.navigate('AvailablePayout');
        } else {
            errorToast(keywords.noLinkedAccountMessage)
        }
    }

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const earnings = ((item?.purchase_price || item?.borrow_price) * 0.8).toFixed(2);
        // const earnings = (((item?.purchase_price || item?.borrow_price) * 0.8) - (item?.cost_shipping >= 50 ? (item.cost_shipping / 2) : 0)).toFixed(2);

        return (
            <PendingItem
                key={index}
                itemData={{ id: item?.id, name: item.listing_name, borrower: item.borrower_name || item?.buyer_name, price: earnings, imageUrl: item?.listing_image_url, type: item?.type }}
                selectedDates={[item?.start_date || item?.localpickup_date, item?.end_date || item?.shipping_date]}
                purchaser={item?.type !== keywords.borrow.toLowerCase()}
            />
        )
    }

    return (
        <View style={{
            flex: 1,
        }}>{loading ? <Loader /> :
            <>
                {!hasListing ?
                    <View style={SPA.emptyViewContainer}>
                        <Image source={require('../../components/assets/payout.png')} style={SPA.image} />
                        <Text style={SPA.addlistingMessage}>{keywords.noPayoutMessage}</Text>
                        <View style={SPA.addListingButton}>
                            <Button text={keywords.addlisting} onPress={handleAddListing} variant='main' />
                        </View>
                    </View>
                    :
                    <ScrollView contentContainerStyle={SPA.mainContainer} showsVerticalScrollIndicator={false}>
                        {!bankAccount &&
                            <View style={SPA.headerContainer}>
                                <Text style={SPA.noBankAccountText}>
                                    {keywords.noBackAccountMessage}
                                </Text>
                                <View style={SPA.buttonContainer}>
                                    <Button text={keywords.addAccount} onPress={handleAddAccount} variant='main' loading={loading} />
                                </View>
                            </View>
                        }
                        <View style={SPA.availablePayoutContainer}>
                            <H1 text={keywords.availablePayout} style={SPA.availablePayoutText} />
                            <H2 text={`CA $${availableBal}`} />
                            <Button text={keywords.getPaidOut} onPress={handleAvailablePayout} variant='main' style={[SPA.getPaidButton, { backgroundColor: bankAccount ? palette.darkBlue : 'rgba(176, 176, 176, 1)', }]} />
                        </View>

                        <View style={SPA.bankAccountContainer}>
                            <TouchableOpacity style={SPA.row} onPress={handleAddAccount}>
                                <H2 text={keywords.backAccount} />
                                <FontAwesomeIcon icon={bankAccount ? faChevronRight : faPlus} size={20} />
                            </TouchableOpacity>
                            <Text style={SPA.amountText}>{bankAccount ? `${bankAccount?.bank_name} (xxxx-${bankAccount?.last4})` : keywords.noBankAccount}</Text>
                        </View>

                        <TouchableOpacity style={SPA.totalEarningContainer} onPress={handleTotalEarning}>
                            <H2 text={keywords.totalEarning} />
                            <View style={SPA.amountRow}>
                                <Text style={SPA.amountText}>{'CA $'}{totalEarning}</Text>
                                <FontAwesomeIcon icon={faChevronRight} size={20} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={SPA.totalEarningContainer} onPress={handleAvailablePayout}>
                            <H2 text={keywords.availablePayout} />
                            <View style={SPA.amountRow}>
                                <Text style={SPA.amountText}>{'CA $'}{availableBal}</Text>
                                <FontAwesomeIcon icon={faChevronRight} size={20} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={SPA.totalEarningContainer} onPress={handleFuturePayout}>
                            <View style={SPA.infoIconContainer}>
                                <H2 text={keywords.futurePayout} />
                                <TouchableOpacity style={SPA.icon} onPress={() => setSnapPoint('45%')}>
                                    <FontAwesomeIcon icon={faInfoCircle} size={18} color={palette.darkGrey} />
                                </TouchableOpacity>
                            </View>
                            <View style={SPA.amountRow}>
                                <Text style={SPA.amountText}>{'CA $'}{futureBal}</Text>
                                <FontAwesomeIcon icon={faChevronRight} size={20} />
                            </View>
                        </TouchableOpacity>

                        <View style={SPA.pendingPayoutContainer}>
                            <H2 text={keywords.pendingPayout} />
                            <Text style={SPA.pendingMessage}>{keywords.pendingLayoutMessage}</Text>
                        </View>

                        <FlatList
                            data={ordersData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />

                    </ScrollView>
                }

                <BottomSheets bottomSheetRef={bottomSheetRef} handleSheetChanges={(index: number) => {
                    if (index > 0) {
                        setSnapPoint(index);
                    } else {
                        setSnapPoint(1);
                    }
                }}
                    snapPoint={snapPoint}
                    setSnapPoint={setSnapPoint}>
                    <View style={SPA.bottomContainer}>
                        <H1 text={keywords.futurePayout} style={SPA.futurePayout} />
                        <Text style={SPA.futurePayoutText}>{keywords.pendingLayoutMessage}</Text>
                        <View style={SPA.gotItButton}>
                            <Button text={keywords.gotIt} onPress={() => setSnapPoint(1)} variant='main' />
                        </View>
                    </View>
                </BottomSheets >
            </>
            }
            <Toast config={toastConfig} />
        </View >
    )
}

export default PayoutAccount