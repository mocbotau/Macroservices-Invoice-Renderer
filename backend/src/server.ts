import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import logger from "@src/logger";
import YAML from "yamljs";
import { SwaggerTheme } from "swagger-themes";
import swaggerUi from "swagger-ui-express";

const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || "localhost";
const theme = new SwaggerTheme("v3");

const swaggerOptions = {
  customCss: theme.getBuffer("dark"),
  customSiteTitle: "MACROSERVICES",
};

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load("docs/api.yml"), swaggerOptions)
);

app.listen(port, host, () => {
  logger.info(`Invoice Rendering API started on http://${host}:${port}`);
});
