import type { NextApiRequest, NextApiResponse } from "next";
import NodeMailer from "nodemailer";
import * as fs from "fs";
import mime from "mime-types";
import multer from "multer";
import { Api } from "@src/Api";

async function sendEmail(toEmail: string, file: any, filename: string) {
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
      to: toEmail,
      subject: "Macroservices Invoice Rendering",
      html: fs
        .readFileSync("src/emailTemplate.html", {
          flag: "r",
          encoding: "utf-8",
        })
        .replace("${fileName}", filename),
      attachments: [
        {
          filename: filename,
          content: file.buffer,
          contentType: mime.lookup(filename) as string,
        },
      ],
    },
    (err, info) => {
      return { success: false, error: info.response };
    }
  );
  return { success: true, error: null };
}

function runMiddleware(
  req: NextApiRequest & { file?: { buffer: Buffer } },
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
  req: NextApiRequest & { file?: { buffer: Buffer } },
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });
  const multerStorage = multer.memoryStorage();
  const multerUpload = multer({ storage: multerStorage });

  console.log("called");
  console.log(req.body, req.file);

  await runMiddleware(req, res, multerUpload.single("file"));
  console.log("called 2");
  const file = req.file;
  const contact = req.body?.contact;
  const type = req.body?.type;
  const ext = req.body?.ext;

  console.log(req.body, req.file);
  console.log(file, contact, type, ext);

  // for (const data of req.body.entries()) {
  //   console.log(data);
  // }
  if (!type || !contact || !ext || !file) {
    return res.status(400).json({
      error:
        "Invalid input. Must have type, contact, file and file (ext)ension",
    });
  }

  switch (type) {
    case "sms":
      // Send over external API
      // const externRes = await fetch(`${process.env.SENDING_API_URL}/send-sms`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     phone: contact,
      //     xml: file.buffer.toString(),
      //     format: "pdf",
      //   }),
      // });
      return res.status(externRes.status === 200 ? 200 : 502).json({});
    case "email":
      if (ext === "xml") {
        // Send using external API
        console.log("here");

        const externRes = await Api.sendInvoiceExternal(
          contact,
          "email",
          file.buffer.toString()
        );
        return res.status(externRes.status === 200 ? 200 : 502).json({});
      } else {
        const sendEmailReq = await sendEmail(contact, file, `export.${ext}`);
        sendEmailReq.success
          ? res.status(200).json({})
          : res.status(502).json({ error: sendEmailReq.error });
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
