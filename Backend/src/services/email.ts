import * as nodemailer from "nodemailer";
import * as cheerio from "cheerio";

const userAccount = process.env.EMAIL_ACCOUNT;
const userPassword = process.env.EMAIL_PASSWORD;

if (!userAccount || !userPassword) {
  throw new Error("Email account or password not found");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userAccount,
    pass: userPassword,
  },
});

export const sendEmail = async (
  to: string | Array<string>,
  subject: string,
  html: string,
  css: string
) => {
  const { html: htmlWithCid, attachments } = convertBase64ToCid(html, css);

  await transporter
    .sendMail({
      from: process.env.EMAIL_ACCOUNT,
      to,
      subject,
      html: htmlWithCid,
      attachments,
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

function convertBase64ToCid(html, css) {
  const $ = cheerio.load(html);
  const attachments = [];

  $("img").each(function () {
    const src = $(this).attr("src");

    // Verificar se o src contém uma imagem base64
    if (src && src.startsWith("data:")) {
      const cid = crypto.randomUUID(); // Gerar um CID único
      $(this).attr("src", `cid:${cid}`); // Substituir o src por cid

      const mimeType = src.substring(5, src.indexOf(";")); // Extrair o tipo MIME
      const base64Data = src.substring(src.indexOf(",") + 1); // Extrair dados em base64

      attachments.push({
        filename: `${cid}.${mimeType.split("/")[1]}`, // Nome de arquivo baseado no CID e tipo MIME
        content: Buffer.from(base64Data, "base64"), // Conteúdo da imagem como Buffer
        cid: cid, // Content-ID para referência no e-mail
        contentType: mimeType, // Tipo MIME do arquivo
        encoding: "base64",
      });
    }
  });

  // add css inline
  const style = $("<style></style>").text(css);
  $("head").append(style);

  return {
    html: $.html(),
    attachments: attachments,
  };
}
