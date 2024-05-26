import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import jwt from "../../../services/jwt";
import { connect, connectAdmin } from "../../../services/mongo";
import AdminClient from "../../../models/admin/Client";
import UserRepository from "../../../repositories/User";
import { sendEmail } from "../../../services/email";

interface Body {
  email: string;
  acronym: string;
}
export const handler: HttpHandler = async (_, req, context) => {
  const { email, acronym } = req.body as Body;

  const adminConn = await connectAdmin();

  const client = await new AdminClient(adminConn).model().findOne({
    acronym,
  });

  if (!client) {
    return res.notFound("User or password not found");
  }

  const conn = connect(client.acronym);
  const userRepository = new UserRepository(conn);

  const user = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.notFound("User or password not found");
  }

  user.password = null;

  const token = await jwt.signResetPassword({
    id: user._id,
    client: conn.name,
  });

  const html = `
      <div class="email-container">
          <div class="header">
              <h1>Edu Flow</h1>
          </div>
          <div class="content">
              <p>Olá, ${user.name}!</p>
              <p>Recebemos uma solicitação para restaurar sua senha de acesso em nosso site.</p>
              <p>Ela ocorreu em ${new Date().toLocaleString()}.</p>
              <p>Se você reconhece essa ação, clique no botão abaixo para prosseguir:</p>
              <div class="button-container">
                  <a href="${process.env.FRONTEND_URL}/auth/alter-password/${token}" class="button">REDEFINIR SENHA</a>
              </div>
              <p>Atenciosamente,</p>
              <p>Equipe Edu Flow</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 Edu Flow. Todos os direitos reservados.</p>
          </div>
      </div>
  `;

  const css = `
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
  }
  img {
      max-width: 100px;
  }
  .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .header {
      text-align: center;
      padding-bottom: 20px;
  }
  .header h1 {
      margin: 0;
      color: #333;
  }
  .content {
      line-height: 1.6;
  }
  .content p {
      margin: 10px 0;
  }
  .button-container {
      text-align: center;
      margin: 20px 0;
  }
  .button-container a {
    text-align: center;
    text-decoration: none;
    color: #383838;
  }
  .button {
      background-color: #00c0c9;
      color: white;
      padding: 15px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
  }
  .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #999;
  }
  `;

  await sendEmail(email, "Reset Password", html, css);

  return res.success({
    success: true,
  });
};

export default new Http(handler)
  .setPublic()
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      email: schema.string().email().required(),
      acronym: schema.string().required(),
    }),
  }))
  .configure({
    name: "AuthForgotPassword",
    options: {
      methods: ["POST"],
      route: "auth/forgot-password",
    },
  });
