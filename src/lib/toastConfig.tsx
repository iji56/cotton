import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: Record<string, any>) => (
    <BaseToast
      {...props}
      style={{
        borderWidth: 0,
        borderRadius: 5,
        borderLeftColor: '#00cc66',
        backgroundColor: '#e6fff2'
      }}
      text1Style={{
        fontSize: 14,
        color: '#00cc66'
      }}
      text1NumberOfLines={1}
      text2Style={{
        fontSize: 12,
        color: '#00cc66'
      }}
      text2NumberOfLines={3}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: Record<string, any>) => (
    <ErrorToast
      {...props}
      style={{
        borderWidth: 0,
        borderRadius: 5,
        borderLeftColor: 'red',
        backgroundColor: '#ffe6e6'
      }}
      text1Style={{
        fontSize: 14,
        color: 'red'
      }}
      text1NumberOfLines={1}
      text2Style={{
        fontSize: 12,
        color: 'red'
      }}
      text2NumberOfLines={3}
    />
  )
};

// error notification
export const errorToast = (error: string) => {
Toast.show({
  type: 'error',
  text1: 'error',
  text2: error,
  topOffset: 100,
  visibilityTime: 3000,
});
}

export const successToast = (message: string) => {
  Toast.show({
    type: 'success',
    text1: 'success!',
    text2: message,
    topOffset: 100,
    visibilityTime: 3000,
  });
}