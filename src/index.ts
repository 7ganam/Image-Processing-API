import express from 'express';
import imageControllers from './controllers/image';
const app = express();
app.use(express.static(`${__dirname}/../public`));

const port = 3000;

app.get('/api/image', imageControllers.getImage);
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    console.error(err?.message ?? 'can not find image');
    res.status(500).send(err?.message ?? 'can not find image');
  }
);

export default app;
