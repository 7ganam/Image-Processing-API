import sharp from 'sharp';
import fileUtils from '../utilities/fs';
import config from '../config';

// ** TYPES
type TargetSize = {
  width?: number;
  height?: number;
};

type ResizeAndSaveImage = (
  imagePath: string,
  imageName: string,
  targetSize: TargetSize
) => Promise<{ success: boolean; outputPath: string }>;

// ** SERVICES
const resizeAndSaveImage: ResizeAndSaveImage = async (
  imagePath,
  imageName,
  targetSize
) => {
  const result = await sharp(imagePath)
    .resize(targetSize.width, targetSize.height)
    .toFormat('jpeg')
    .toFile(
      `public/images/thumbs/${imageName}-${targetSize.width ?? ''}-${
        targetSize.height ?? ''
      }.jpg`
    )
    .then(function () {
      return {
        success: true,
        outputPath: `images/thumbs/${imageName}-${targetSize.width ?? ''}-${
          targetSize.height ?? ''
        }.jpg`
      };
    });
  return result;
};

const getOrCreateImage = async (
  resizeAndSaveImage: ResizeAndSaveImage,
  imagePath: string,
  imageName: string,
  targetSize: TargetSize
): Promise<{ success: boolean; outputPath?: string }> => {
  //check if we have image with the same name in our stock
  const fileExists = await fileUtils.checkFileExists(imagePath);

  if (!fileExists) {
    return { success: false };
  }

  //check if we have a thumbnail image as the requested one
  const outputPath = `${
    config.PROJECT_DIR
  }/../public/images/thumbs/${imageName}-${targetSize.width ?? ''}-${
    targetSize.height ?? ''
  }.jpg`;
  const thumbnailExisted = await fileUtils.checkFileExists(outputPath);

  //if we have return it
  if (thumbnailExisted) {
    return { success: true, outputPath: outputPath };
  }

  //if not create a new one and return it
  const result = await resizeAndSaveImage(imagePath, imageName, targetSize);

  return result;
};

export = {
  resizeAndSaveImage,
  getOrCreateImage
};
