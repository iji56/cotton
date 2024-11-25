import { View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SNM from './NotificationModals.styles'
import SellerModel from '../../components/Modals/SellerModel'
import BuyerModal from '../../components/Modals/BuyerModal'
import LenderModal from '../../components/Modals/LenderModal'
import BorrowerModal from '../../components/Modals/BorrowerModal'
import { NotificationContext } from '@/features/Listeners/listeners'
import { fetchAllNotifications } from '@/features/Listeners/api'
import { reduxSelect } from '@/types/reduxHooks'

const NoficationModals = ({ route }: any) => {
  const { setNotifications } = useContext(NotificationContext)
  const userId = reduxSelect(state => state.usermeta.id);

  useEffect(() => {

    const fetchNotifications = async () => {
      let response = await fetchAllNotifications(userId!);
      if (response?.length > 0) {
        setNotifications(response)
      } else {
        setNotifications([])
      }
      console.log("all notification response : ", response, response?.length);
    }

    fetchNotifications();

  }, []);
  const [showModal, setShowModal] = useState({
    buyerInfo: route.params.modal === 'buyer',
    sellerInfo: route.params.modal === 'seller',
    borrowerInfo: route.params.modal === 'borrower',
    lenderInfo: route.params.modal === 'lender'
  })
  console.log("notification route : ", route, showModal)
  const toggle = () => {
    setShowModal({
      buyerInfo: false,
      sellerInfo: false,
      borrowerInfo: false,
      lenderInfo: false
    })
  }

  return (
    <View style={SNM.container}>
      <SellerModel visible={showModal.sellerInfo} toggle={toggle} purchaserId={route.params.purchaserId} />
      <BuyerModal visible={showModal.buyerInfo} toggle={toggle} purchaserId={route.params.purchaserId} />
      <LenderModal visible={showModal.lenderInfo} toggle={toggle} purchaserId={route.params.purchaserId} />
      <BorrowerModal visible={showModal.borrowerInfo} toggle={toggle} purchaserId={route.params.purchaserId} />
    </View>
  )
}

export default NoficationModals