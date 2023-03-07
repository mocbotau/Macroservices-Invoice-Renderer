import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import logger from "@src/logger";

const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  logger.info(`Invoice Rendering API started on http://${host}:${port}`);
});
