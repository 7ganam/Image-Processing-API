import express from 'express';
import imgServices from '../services/image';
import config from '../config';

const getImage = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const widthString = req.query?.width;
  const heightString = req.query?.height;

  const width = Number(widthString);
  const height = Number(heightString);

  if (Number.isNaN(width) || Number.isNaN(height)) {
    res.status(400);
    res.send('width and height must be numbers');
    return;
  }

  const imageFileName = req.query?.filename as string;
  if (!width || !height || !imageFileName) {
    res.status(400);
    res.send('missing parameter');
    return;
  }
  if (!imageFileName.match(/.jpg/)) {
    res.status(400);
    res.send('wrong file extension');
  }

  const imageName = imageFileName.replace('.jpg', '');
  const imagePath = `${config.PROJECT_DIR}/../public/images/${imageFileName}`;

  const result = await imgServices.getOrCreateImage(
    imgServices.resizeAndSaveImage,
    imagePath,
    imageName,
    {
      width,
      height
    }
  );

  if (result.success && result.outputPath) {
    res.status(200);
    res.send(`<img src="/images/thumbs/${imageName}-${width}-${height}.jpg">`); //<-- edited this line
  } else {
    res.status(400);
    res.send('image not found');
    return;
  }
};

export = { getImage };
