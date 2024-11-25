import { Alert, PermissionsAndroid, Platform } from 'react-native'
import { PERMISSIONS, request, check, openSettings, requestMultiple } from 'react-native-permissions'
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

export const requestAllRequiredPermission = async () => {
  let requiredPermissions = Platform.OS === 'ios' ?
    [PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.PHOTO_LIBRARY]
    :
    [PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

  await requestMultiple(requiredPermissions)

}

export const requestPermission = async () => {
  // const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  try {
    let response;
    if (Platform.OS === 'android') {
      response = await PermissionsAndroid.request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
      response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    if (response === 'never_ask_again' || response === 'denied' || response === 'blocked') {
      try {
        await directToSetting();
        return false
      } catch (error) {
        console.log("Errror  :", error)
        return false
      }
    } else {
      return true
    }
    // Platform.OS === 'android' && await promptForEnableLocationIfNeeded();
  } catch (e) {
    console.log("Error : ", e)
    return false
  }
}

export const checkLocationPermission = async () => {
  const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  return check(permission).then(res => {
    if (res === 'blocked' || res === 'denied') {
      return false
    } else if (res === 'unavailable') {
      console.log("Location not available")
      return null
    } else if (res === 'granted') {
      console.log("Location permissio granted")
      return true
    }
    return true
  }).catch(error => {
    console.log("Error getting user location permission : ", error)
    return null
  })
}

export const requestLocationPermission = async () => {
  const hasPermission = await checkLocationPermission();
  if (!hasPermission) {
    return requestPermission()
  } else {
    try {
      Platform.OS === 'android' && await promptForEnableLocationIfNeeded().then((res) => {
        console.log("resposne  : ", res)
        return res
      });
      return true
    } catch (e) {
      console.log("Error : ", e)
      return false
    }

  }
}

const openSetting = async () => {
  await openSettings()
}

export const directToSetting = async () => {
  Alert.alert("Permission Request",
    "rax requires your location to show items near to you.",
    [
      { text: "Not now", },
      { text: "Open settings", onPress: openSetting }
    ])
}


export const grantCameraPermission = async () => {
  return Platform.OS === 'android' ?
    await request(PERMISSIONS.ANDROID.CAMERA, {
      title: 'Camera Permission',
      message: 'App needs access to your camera',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }).then((result) => {
      if (result === 'granted') {
        return true;
      } else {
        return false;
      }
    })
      .catch((error) => {
        return false
      })
    :
    await request(PERMISSIONS.IOS.CAMERA)
      .then((result) => {
        if (result === 'granted') {
          return true
        } else {
          return false
        }
      })
      .catch((error) => {
        return false
      });
}

export const grantGallaryPermission = async () => {
  return Platform.OS === 'android' ?
    await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, {
      title: 'Gallary Permission',
      message: 'App needs access to your Gallary',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }).then((result) => {
      if (result === 'granted') {
        return true;
      } else {
        return false;
      }
    })
      .catch((error) => {
        return false
      })
    :
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then((result) => {
        if (result === 'granted') {
          return true
        } else {
          return false
        }
      })
      .catch((error) => {
        return false
      });
}
