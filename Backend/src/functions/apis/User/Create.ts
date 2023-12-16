import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import User, { IUser } from "../../../models/User";

type DtoUser = IUser & { institute_id: string };

const handler: HttpHandler = async (conn, req, context) => {
  const { name, cpf, password, email, matriculation, role, institute_id } = req.body as DtoUser;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: IUser = await User.create({
    name,
    cpf,
    password: hashedPassword,
    email,
    matriculation,
    role,
    institute: institute_id,
  })

  return res.created({
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    matriculation: user.matriculation,
    role: user.role,
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      cpf: schema
        .string()
        .required()
        .matches(/^\d{11}$/),
      password: schema.string().required().min(6).max(255),
      email: schema.string().required().email(),
      matriculation: schema.string().required().min(3).max(255),
      role: schema.mixed().oneOf(["admin", "student", "teacher"]).required(),
    }),
  }))
  .configure({
    name: "UserCreate",
    options: {
      methods: ["POST"],
      route: "user",
    },
  });
