import type { NextApiRequest, NextApiResponse } from "next";
import NodeMailer from "nodemailer";
import * as fs from "fs";
import mime from "mime-types";
import multer from "multer";
import { Api } from "@src/Api";
import { InvoiceSendExtOptions, InvoiceSendOptions } from "@src/interfaces";

async function sendEmail(
  toEmail: string,
  file: { buffer: Buffer },
  filename: string
) {
  // Send doc over SMTP
  if (process.env.NODE_ENV !== "test") {
    const transporter = NodeMailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    transporter.sendMail(
      {
        from: `Macroservices <${process.env.MAIL_USER}>`,
        to: toEmail,
        subject: "Macroservices Invoice Rendering",
        html: fs
          .readFileSync("public/emailTemplate.html", {
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
  }
  return { success: true, error: null };
}

function runMiddleware(
  req: NextApiRequest & { file?: { buffer: Buffer } },
  res: NextApiResponse,
  // eslint-disable-next-line
  fn: (...args: any[]) => void
  // eslint-disable-next-line
): Promise<any> {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
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
  await runMiddleware(req, res, multerUpload.single("file"));
  const sendResult = await handleSending(
    req.body?.contact,
    req.body?.type,
    req.body?.ext,
    req.file
  );
  res
    .status(sendResult.status)
    .json(sendResult.error ? { error: sendResult.error } : {});
};

export async function handleSending(
  contact: string,
  type: InvoiceSendOptions,
  ext: InvoiceSendExtOptions,
  file?: { buffer: Buffer }
): Promise<{ status: number; error?: string }> {
  if (!type || !contact || !ext || !file) {
    return {
      status: 400,
      error:
        "Invalid input. Must have type, contact, file and file (ext)ension",
    };
  }

  switch (type) {
    case "sms": {
      const externRes = await Api.sendInvoiceExternal(
        contact,
        "sms",
        file.buffer.toString()
      );
      return {
        status: externRes.status === 200 ? 200 : 502,
      };
    }
    case "email":
      if (ext === "xml") {
        // Send using external API
        const externRes = await Api.sendInvoiceExternal(
          contact,
          "email",
          file.buffer.toString()
        );
        return {
          status: externRes.status === 200 ? 200 : 502,
        };
      } else {
        const sendEmailReq = await sendEmail(contact, file, `export.${ext}`);
        return sendEmailReq.success
          ? {
              status: 200,
            }
          : {
              status: 502,
            };
      }
    default:
      return { status: 400, error: "Type is invalid." };
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
