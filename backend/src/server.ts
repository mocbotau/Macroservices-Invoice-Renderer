import express from "express";
import config from "./config.json";

const app = express();

app.listen(config.PORT, config.HOST, () => {
    console.log(`Invoice Rendering API started on ${config.HOST}:${config.PORT}`);
});