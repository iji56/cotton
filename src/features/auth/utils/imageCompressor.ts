import { Image } from 'react-native-compressor';

export const ImageCompressor = async (imageFile: string) => {
    return new Promise(async (resolve, reject) => {
      const result = await Image.compress(imageFile, {
        quality: 0.8,
      });
      resolve(result);
    });
  }