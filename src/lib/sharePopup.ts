import { Share } from "react-native";

export const sharePopup = async (message: null | string) => {
  try {
    const result = await Share.share({
      message: message ?? ''
    })

  } catch (error) {
    console.log((error as Error).message);
  }
}