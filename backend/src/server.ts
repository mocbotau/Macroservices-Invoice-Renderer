import app from './app';
import config from './config/config.json';

app.listen(config.PORT, config.HOST, () => {
  console.log(`Invoice Rendering API started on ${config.HOST}:${config.PORT}`);
});
