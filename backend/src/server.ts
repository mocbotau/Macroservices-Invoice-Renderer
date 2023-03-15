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

const v1JSON = YAML.load("docs/v1.yml");
const v2JSON = YAML.load("docs/v2.yml");

const v1HTML = swaggerUi.generateHTML(v1JSON, swaggerOptions);
const v2HTML = swaggerUi.generateHTML(v2JSON, swaggerOptions);

// v1 docs
app.use("/docs/v1", swaggerUi.serveFiles(v1JSON, swaggerOptions));
app.get("/docs/v1", (req, res) => {
  res.send(v1HTML);
});

// v2 docs
app.use("/docs/v2", swaggerUi.serveFiles(v2JSON, swaggerOptions));
app.get("/docs/v2", (req, res) => {
  res.send(v2HTML);
});

// Redirect /docs to latest
app.get("/docs", (req, res) => {
  res.redirect("/docs/v2");
});

app.listen(port, host, () => {
  logger.info(`Invoice Rendering API started on http://${host}:${port}`);
});
