import { imageBaseUrl, listingVideoBaseUrl } from './createStorageURL';
export const getImageSrc = (listingName: string, image: string) => {
  if (
    listingName === 'Suede jacket' ||
    listingName === 'Cute doggy' ||
    listingName === 'Kendell' ||
    listingName === 'Computer'
  ) {
    if (image?.endsWith('.mp4')) {
      return `${listingVideoBaseUrl}${image}`;
    }
    if (image?.endsWith('thumbnail.jpeg')) {
      return `${listingVideoBaseUrl}${image}`;
    }
    return `${imageBaseUrl}${image}`;
  }
  return `https://kjdytgdazauuitxnguho.supabase.co/storage/v1/object/public/listings/${image}`;
};

export const findImageUrl = images => {
  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.tiff',
    '.webp',
  ];

  return images.find(image =>
    imageExtensions.some(extension =>
      image.image_url.toLowerCase().endsWith(extension),
    ),
  );
};
