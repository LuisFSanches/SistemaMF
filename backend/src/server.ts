import express from 'express';
import http from 'http';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';

import { getCertificatesForWebhook } from './utils/getCertificates';

dotenv.config();

import { router } from './routes';
import { errorMiddleware } from './middlewares/errors';

const app = express();
const httpsOptions = getCertificatesForWebhook() as any;

app.use(express.json());
app.use(cors());
app.use(router);

app.use(errorMiddleware);

const PORT = 3333;
http.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});