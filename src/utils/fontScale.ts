import { PixelRatio } from 'react-native';


export const fontScale = (size: number) => {

    const fontScale = PixelRatio.getFontScale();
    return Math.round(size * fontScale);

    // const scale = PixelRatio.get();
    // return Math.round(size * scale);
};
