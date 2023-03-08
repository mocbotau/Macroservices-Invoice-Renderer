import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import v1Router from "./routes/v1";
import { errorHandler } from "@src/errorHandler";
import morgan from "morgan";
import logger from "@src/logger";

const stream = {
  write: (message: string) =>
    logger.http(message.substring(0, message.lastIndexOf("\n"))),
};

const app = express();

app.use(bodyParser.json());
app.use(
  morgan("dev", {
    stream: stream,
    skip: (req: Request, res: Response) => {
      return process.env.NODE_ENV !== "development" && res.statusCode !== 500;
    },
  })
);

app.use("/v1", v1Router);
app.use(errorHandler);

export default app;
