import Image from "../assets/Image.svg";

export const formatImageUrl = (image?: string): string => {
  if (!image) {
    return Image;
  }

  return image?.includes("http") ? image : `https://cloud.quickshop.com.ng${image}`;
};
