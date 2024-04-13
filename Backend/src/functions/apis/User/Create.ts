import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import User, { IUser } from "../../../models/User";
import Institute from "../../../models/Institute";

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
  } = req.body as IUser;

  const hasInstitute = await new Institute(conn).model().exists({
    _id: institute,
    active: true,
  });

  if (!hasInstitute) {
    return res.badRequest("Institute not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: IUser = await new User(conn).model().create({
    name,
    cpf,
    password: hashedPassword,
    email,
    matriculation,
    university_degree,
    roles: [...new Set(roles)],
    institute,
  });

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
      roles: schema
        .array(schema.mixed().oneOf(["admin", "student", "teacher"]))
        .required(),
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
