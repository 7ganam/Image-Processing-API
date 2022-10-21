import express from 'express';
import imageControllers from './controllers/image';
const app = express();
app.use(express.static(`${__dirname}/../public`));

const port = 3000;

app.get('/api/image', imageControllers.getImage);
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

export default app;
