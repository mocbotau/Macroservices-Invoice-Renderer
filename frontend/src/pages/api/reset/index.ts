import { NextApiRequest, NextApiResponse } from "next/types";
import NodeMailer from "nodemailer";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { DBGet, DBRun } from "@src/utils/DBHandler";

const MAIL_PASS = fs.readFileSync(process.env.MAIL_PASS, "utf8").trim();

/**
 *  This function sends the password reset email to the given email
 * @param {string} toEmail - the email to send the password request email to
 * @param {string} url - the password reset link
 * @returns {object} - the status and error (if applicable)
 */
async function sendResetEmail(toEmail: string, url: string) {
  if (process.env.NODE_ENV !== "test") {
    const transporter = NodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: MAIL_PASS,
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

/**
 * This route will send a password request email if that email is a valid user.
 * This route returns:
 * 405 - When the method is anything other than POST
 * 400 - When an email is not provided
 * 202 - In every other case
 * @param {NextApiRequest} req - The request object
 * @param {NextApiResponse} res  -The response object
 * @returns {void}
 */
export default async function reset_password_handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "POST": {
      if (!req.body?.email) {
        return res.status(400).json({ error: "Email must be provided" });
      }
      if (
        !(await DBGet("SELECT Identifier FROM Users WHERE Identifier = ?", [
          req.body.email,
        ]))
      ) {
        return res.status(202).json({});
      }
      const code = uuidv4();
      await sendResetEmail(
        req.body.email,
        `${process.env.FRONTEND_URL}/reset/${code}`
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
