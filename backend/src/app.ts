import express from 'express';

import exampleRoute from './routes/example';

const app = express();

app.get('/example', exampleRoute);

export default app;
