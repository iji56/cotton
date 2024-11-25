import { VideoCompressor } from '@/features/orders/utils/imageCompressor';
import { supabase } from '@/lib/supabase';
import { createThumbnail } from 'react-native-create-thumbnail';
var fs = require('react-native-fs');
global.Buffer = require('buffer').Buffer;

export const uploadListingVideo = async (
  videoPath: string,
  uid: string,
): Promise<{ thumbnailPath: string; videoPath: string }> => {
  try {
    const compressedFilePath = await VideoCompressor(videoPath);
    let base64Video = await fs.readFile(compressedFilePath, 'base64');
    const arrayBuffer = Buffer.from(base64Video, 'base64');

    const uniquePath = `${uid}${new Date().toISOString()}_video.mp4`;
    console.log('video path', uniquePath);
    const { data, error } = await supabase.storage
      .from('listing_videos')
      .upload(uniquePath, arrayBuffer, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting the file
        contentType: 'video/mp4', // Set the content type to image/jpeg
      });
    console.log('after listing_videos');
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const { path } = await generateThumbnail(videoPath);

    // Step 4: Upload the thumbnail
    let base64Thumbnail = await fs.readFile(path, 'base64');
    const thumbnailArrayBuffer = Buffer.from(base64Thumbnail, 'base64');

    const thumbnailUniquePath = `${uid}${new Date().toISOString()}_thumbnail.jpeg`;
    console.log('thumbnailUniquePath', thumbnailUniquePath);
    const { error: thumbnailError } = await supabase.storage
      .from('listing_videos')
      .upload(thumbnailUniquePath, thumbnailArrayBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (thumbnailError) {
      console.log('thumbnailError', thumbnailError);
      throw new Error(thumbnailError.message);
    }

    return { videoPath: uniquePath, thumbnailPath: thumbnailUniquePath };
  } catch (e) {
    console.log('error in catch uploadListingVideo: ', e);
    return { videoPath: '', thumbnailPath: '' };
  }
};

const generateThumbnail = async (videoPath: string) => {
  const thumbnail = await createThumbnail({ url: videoPath, timeStamp: 500 });
  console.log('thumbnail', thumbnail);
  return thumbnail;
};
