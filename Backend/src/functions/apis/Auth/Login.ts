import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import jwt from "../../../services/jwt";
import { connect, connectAdmin } from "../../../services/mongo";
import AdminClient from "../../../models/admin/Client";

interface Body {
  matriculation: string;
  password: string;
  acronym: string;
}
export const handler: HttpHandler = async (_, req, context) => {
  const { matriculation, password, acronym } = req.body as Body;

  const adminConn = await connectAdmin();

  const client = await new AdminClient(adminConn).model().findOne({
    acronym,
  });

  if (!client) {
    return res.notFound("User or password not found");
  }

  const conn = await connect(client.acronym);

  const user = await conn.model("User").findOne({
    matriculation,
  });

  if (!user) {
    return res.notFound("User or password not found");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.unauthorized("User or password not found");
  }

  const token = await jwt.sign({
    id: user._id,
    name: user.name,
    matriculation: user.matriculation,
    email: user.email,
    roles: user.roles,
    institute: user.institute,
    slug: acronym,
    client: client.toObject(),
  });

  return res.success({
    token,
  });
};

export default new Http(handler)
  .setPublic()
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      password: schema.string().required(),
      matriculation: schema.string().required(),
      acronym: schema.string().required(),
    }),
  }))
  .configure({
    name: "Login",
    options: {
      methods: ["POST"],
      route: "auth/login",
    },
  });
