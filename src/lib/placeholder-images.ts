import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// This is now empty, as data will be fetched from Firestore.
// You can remove this or keep it for other potential placeholder images.
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
