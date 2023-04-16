import { withIronSessionApiRoute } from "iron-session/next";
import { IronOptions } from "@src/../iron_session.config";
import { NextApiRequest, NextApiResponse } from "next/types";
import NodeMailer from "nodemailer";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { DBGet, DBRun } from "@src/utils/DBHandler";

export default withIronSessionApiRoute(reset_password_handler, IronOptions);

async function sendResetEmail(toEmail: string, url: string) {
  if (process.env.NODE_ENV !== "test") {
    const transporter = NodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    transporter.sendMail(
      {
        from: `Macroservices <${process.env.MAIL_USER}>`,
        to: toEmail,
        subject: "Macroservices Password Reset",
        html: fs
          .readFileSync("public/password_reset_email.html", {
            flag: "r",
            encoding: "utf-8",
          })
          .replace("${resetCode}", url),
      },
      (err) => {
        return { success: false, error: err.message };
      }
    );
  }
  return { success: true, error: null };
}

export async function reset_password_handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      if (!req.body?.email) {
        return res.status(400).json({ error: "Email must be provided" });
      }
      req.session.destroy();
      if (
        !(await DBGet("SELECT Email FROM Users WHERE Email = ?", [
          req.body.email,
        ]))
      ) {
        return res.status(202).json({});
      }
      const code = uuidv4();
      await sendResetEmail(
        req.body.email,
        `http://${req.headers.host}/reset/${code}`
      );
      await DBRun("INSERT INTO ResetCodes (Email, Code) VALUES (?, ?)", [
        req.body.email,
        code,
      ]);
      return res.status(202).json({});
    }
    default:
      return res.status(405).json({ error: "This method is not allowed" });
  }
}
