import type { NextApiRequest, NextApiResponse } from "next";
import NodeMailer from "nodemailer";
import * as fs from "fs";
import mime from "mime-types";
import multer from "multer";

function runMiddleware(
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse,
  fn: (...args: any[]) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const handler = async (
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });
  const multerStorage = multer.memoryStorage();
  const multerUpload = multer({ storage: multerStorage });

  await runMiddleware(req, res, multerUpload.single("file"));
  const file = req.file;
  const contact = req.body?.contact;
  const type = req.body?.type;
  const ext = req.body?.ext;

  if (!type || !contact || !ext) {
    return res.status(400).json({
      error: "Invalid input. Must have type, contact and file (ext)ension",
    });
  }
  switch (type) {
    case "sms":
      // Send over external API
      const externRes = await fetch(`${process.env.SENDING_API_URL}/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: contact,
          xml: file.buffer.toString(),
          format: "pdf",
        }),
      });
      return res.status(externRes.status === 200 ? 200 : 502).json({});
    case "email":
      if (ext === "xml") {
        // Send using external API
        const externRes = await fetch(
          `${process.env.SENDING_API_URL}/send-xml`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: contact,
              xml: file.buffer.toString(),
              format: "pdf",
            }),
          }
        );
        return res.status(externRes.status === 200 ? 200 : 502).json({});
      } else {
        // Send doc over SMTP
        let transporter = NodeMailer.createTransport({
          service: "hotmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        let info = await transporter.sendMail(
          {
            from: `Macroservices <${process.env.MAIL_USER}>`,
            to: contact,
            subject: "Macroservices Invoice Rendering",
            html: fs
              .readFileSync("src/emailTemplate.html", {
                flag: "r",
                encoding: "utf-8",
              })
              .replace("${fileName}", `export.${ext}`),
            attachments: [
              {
                filename: `export.${ext as string}`,
                content: file.buffer,
                contentType: mime.lookup(ext as string) as string,
              },
            ],
          },
          (err, info) => {
            return res.status(502).json({ error: info.response });
          }
        );
        return res.status(200).json({});
      }
    default:
      return res.status(400).json({ error: "Type is invalid." });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
