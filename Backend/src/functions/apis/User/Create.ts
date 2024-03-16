import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import { IUserRoles, User } from "../../../models/User";
import { Institute } from "../../../models/Institute";
import { ObjectId } from "typeorm";

interface TRequestBody {
  name: string;
  cpf: string;
  password: string;
  email: string;
  matriculation: string;
  roles: IUserRoles[];
  university_degree?: "mastermind" | "doctor";
  institute: ObjectId;
}

const handler: HttpHandler = async (conn, req, context) => {
  const {
    name,
    cpf,
    password,
    email,
    matriculation,
    roles,
    institute,
    university_degree = null,
  } = req.body as TRequestBody;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();

  user.name = name;
  user.cpf = cpf;
  user.password = hashedPassword;
  user.email = email;
  user.matriculation = matriculation;
  user.roles = roles;
  user.institute = await conn.getRepository(Institute).findOne({
    where: { id: institute },
  });
  user.university_degree = university_degree;

  await conn.getRepository(User).save(user);

  return res.created({
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    matriculation: user.matriculation,
    roles: user.roles,
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
      university_degree: schema
        .mixed()
        .oneOf(["mastermind", "doctor"])
        .when("role", ([role], schema) =>
          role === "teacher"
            ? schema.required()
            : schema.notRequired().nullable()
        ),
    }),
  }))
  .configure({
    name: "UserCreate",
    options: {
      methods: ["POST"],
      route: "user",
    },
  });
