import ImageResizer from "react-native-image-resizer";
export const ResizeAndCompressImage = async (
  uri,
  width,
  height,
  format,
  quality
) => {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      width, // new width
      height, // new height
      format, // compress format
      quality // quality (0 to 100)
    );
    return resizedImage.uri;
  } catch (err) {
    console.error("Failed to resize image:", err);
    return uri;
  }
};
