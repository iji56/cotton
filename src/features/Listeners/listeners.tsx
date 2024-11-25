// NotificationContext.js
import { supabase } from '@/lib/supabase'
import { reduxSelect } from '@/types/reduxHooks'
import React, { createContext, useState, useEffect } from 'react'
import { fetchAllNotifications } from './api'

export const NotificationContext = createContext({
  notifications: [],
  setNotifications: (value: any) => { },
  currentRoute: null,
  setCurrentRoute: (value: any) => { },
  modalVisible: false,
  setModalVisible: (value: any) => { },
  filePath: '',
  setFilePath: (value: any) => { },
})

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<any>([])
  const [currentRoute, setCurrentRoute] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filePath, setFilePath] = useState("");
  const userId = reduxSelect(state => state.usermeta.id);

  useEffect(() => {
    console.log("I am being called, listener started with user id : ", userId)
    if (userId) {
      fetchNotifications().then(() => {
        startListener()
      }).catch(error => {
        console.log("Error fetching notificaitons : ", error);
      })

      return () => {
        supabase.channel('notifications').unsubscribe();
        console.log("I am being called, listener unscribed")
      }
    }
  }, [userId])

  const startListener = () => {
    // Set up a real-time subscription to the notifications table
    console.log("Listener function get called.....")
    supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        console.log("listener called  : ", payload)
        if (payload?.new?.status == 0) {
          setNotifications((prevNotifications: any) => [...prevNotifications, payload.new])
        }
      })
      .subscribe()
  }

  const fetchNotifications = async () => {
    let response = await fetchAllNotifications(userId!);
    if (response?.length > 0) {
      setNotifications(response)
    }
    console.log("all notification response : ", response);
  }

  return (
    <NotificationContext.Provider value={{
      notifications, setNotifications, currentRoute, setCurrentRoute, modalVisible, filePath, setModalVisible, setFilePath,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}