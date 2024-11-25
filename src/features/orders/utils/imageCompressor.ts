import { Image, Video } from 'react-native-compressor';

export const ImageCompressor = async (imageFile: string) => {
  return new Promise(async (resolve, reject) => {
    const result = await Image.compress(imageFile, {
      quality: 0.8,
    });
    resolve(result);
  });
}

export const VideoCompressor = async (videoFile: string) => {
  return new Promise(async (resolve, reject) => {
    const result = await Video.compress(videoFile, {
      compressionMethod: 'auto',
    });
    resolve(result);
  });
}