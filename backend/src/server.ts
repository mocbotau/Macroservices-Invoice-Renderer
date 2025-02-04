import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import app from "./app";
import logger from "@src/logger";
import YAML from "yamljs";
import { SwaggerTheme } from "swagger-themes";
import swaggerUi from "swagger-ui-express";
import path from "path";
import express from "express";

const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || "localhost";
const theme = new SwaggerTheme("v3");

app.use("/public", express.static("public"));

const swaggerOptions = {
  customCss: theme.getBuffer("dark"),
  customSiteTitle: "API Docs | Macroservices",
  customfavIcon: "/public/favicon.ico",
};

const v1JSON = YAML.load("docs/v1.yaml");
const v2JSON = YAML.load("docs/v2.yaml");
const v3JSON = YAML.load("docs/v3.yaml");

const v1HTML = swaggerUi.generateHTML(v1JSON, swaggerOptions);
const v2HTML = swaggerUi.generateHTML(v2JSON, swaggerOptions);
const v3HTML = swaggerUi.generateHTML(v3JSON, swaggerOptions);

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

// v3 docs
app.use("/docs/v3", swaggerUi.serveFiles(v3JSON, swaggerOptions));
app.get("/docs/v3", (req, res) => {
  res.send(v3HTML);
});

// Redirect /docs to latest
app.get("/docs", (req, res) => {
  res.redirect("/docs/v3");
});

app.get("/docs/getting-started", (req, res) => {
  res.sendFile(path.join(__dirname, "/gettingStarted.html"));
});

app.listen(port, host, () => {
  logger.info(`Invoice Rendering API started on http://${host}:${port}`);
});
