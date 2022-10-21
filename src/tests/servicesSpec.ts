import imgService from '../services/image';
import fileUtils from '../utilities/fs';
import config from '../config';

const resizeAndSaveImage = imgService.resizeAndSaveImage;
const getOrCreateImage = imgService.getOrCreateImage;

import fs from 'fs';

describe('Image services tests', () => {
  it('should succeed in resizing existing image', async () => {
    const targetWidth = 300;
    const targetHeight = 200;

    const outputPath = `${config.PROJECT_DIR}/../public/images/thumbs/encenadaport-${targetWidth}-${targetHeight}.jpg`;

    // If the file existed before delete it. if not take note to delete it at the end of test
    const fileExisted = await fileUtils.checkFileExists(outputPath);
    if (fileExisted) {
      fs.unlink(outputPath, () => {
        console.log('removed file');
      });
    }

    //create a file and save it
    const result = await resizeAndSaveImage(
      `${config.PROJECT_DIR}/../public/images/encenadaport.jpg`,
      'encenadaport',
      {
        width: targetWidth,
        height: targetHeight
      }
    );

    //test if file exists
    const fileExists = await fileUtils.checkFileExists(outputPath);

    expect(result.success).toEqual(true);
    expect(fileExists).toEqual(true);

    //remove the file if it didn't exist before
    if (!fileExisted) {
      fs.unlink(outputPath, () => {
        console.log('removed file');
      });
    }
  });

  it('should create new thumbnail image if image does not exist', async () => {
    const targetWidth = 200;
    const targetHeight = 200;

    const outputPath = `${config.PROJECT_DIR}/../public/images/thumbs/encenadaport-${targetWidth}-${targetHeight}.jpg`;

    // If the file existed before delete it. if not take note to delete it at the end of test
    const fileExisted = await fileUtils.checkFileExists(outputPath);
    if (fileExisted) {
      fs.unlink(outputPath, () => {
        console.log('removed file');
      });
    }

    //create a file
    const result = await getOrCreateImage(
      resizeAndSaveImage,
      `${config.PROJECT_DIR}/../public/images/encenadaport.jpg`,
      'encenadaport',
      {
        width: targetWidth,
        height: targetHeight
      }
    );

    //test if file exists
    const fileExists = await fileUtils.checkFileExists(outputPath);

    expect(result.success).toEqual(true);
    expect(fileExists).toEqual(true);

    //remove the file if it didn't exist before
    if (!fileExisted) {
      fs.unlink(outputPath, () => {
        console.log('removed file');
      });
    }
  });

  it('should not create new thumbnail image if image exists', async () => {
    const targetWidth = 200;
    const targetHeight = 200;

    const outputPath = `${config.PROJECT_DIR}/../public/images/thumbs/encenadaport-${targetWidth}-${targetHeight}.jpg`;

    // If file didn't exist create it
    const fileExisted = await fileUtils.checkFileExists(outputPath);
    if (!fileExisted) {
      //create a file and save it
      await resizeAndSaveImage(
        `${config.PROJECT_DIR}/../public/images/encenadaport.jpg`,
        'encenadaport',
        {
          width: targetWidth,
          height: targetHeight
        }
      );
    }

    //run the function and test if it didn't recreate file
    spyOn(imgService, 'resizeAndSaveImage');
    const result = await getOrCreateImage(
      imgService.resizeAndSaveImage,
      `${config.PROJECT_DIR}/../public/images/encenadaport.jpg`,
      'encenadaport',
      {
        width: targetWidth,
        height: targetHeight
      }
    );

    //test if file exists file creation function was called
    expect(result.success).toEqual(true);
    expect(imgService.resizeAndSaveImage).not.toHaveBeenCalled();

    //remove the file if it didn't exist before
    if (!fileExisted) {
      fs.unlink(outputPath, () => {
        console.log('removed file');
      });
    }
  });
});
