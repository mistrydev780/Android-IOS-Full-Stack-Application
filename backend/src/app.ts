import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import routes from './routes';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());

// Native apps send no Origin header and are always allowed. Web origins are
// open in development and restricted to CORS_ORIGINS in production.
app.use(
  cors({
    origin: env.isProduction ? env.corsOrigins : true,
  }),
);

app.use(express.json({ limit: '10kb' }));

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Dev E-Commerce API', docs: '/api/v1/health' });
});

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);
