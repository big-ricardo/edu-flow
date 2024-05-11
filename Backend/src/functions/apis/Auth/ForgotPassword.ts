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
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <a href="${process.env.FRONTEND_URL}/auth/alter-password/${token}">Reset Password</a>
  `;

  const css = `
    a {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
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
