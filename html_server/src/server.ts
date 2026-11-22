import Express from 'express';
import CORS from 'cors';
import { urlencoded, json } from 'body-parser';

const app = Express();

app.use(CORS());
app.use(urlencoded({ extended: true }));
app.use(json());

export default app;
