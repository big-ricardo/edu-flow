import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import jwt from "../../../services/jwt";

interface Body {
  cpf: string;
  password: string;
}
const handler: HttpHandler = async (conn, req, context) => {
  const { cpf, password } = req.body as Body;

  const user = await conn.model("User").findOne({
    cpf,
  });

  if (!user) {
    return res.notFound("User or password not found");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.unauthorized("User or password not found");
  }

  const token = await jwt.sign({
    id: user.id,
    name: user.name,
    matriculation: user.matriculation,
    email: user.email,
    role: user.role,
  });

  return res.success({
    token,
  });
};

export default new Http(handler)
  .setPublic()
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      cpf: schema
        .string()
        .matches(/^\d{11}$/)
        .required(),
      password: schema.string().required(),
    }),
  }))
  .configure({
    name: "Login",
    options: {
      methods: ["POST"],
      route: "auth/login",
    },
  });
