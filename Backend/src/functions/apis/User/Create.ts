import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import User, { IUser } from "../../../models/client/User";
import InstituteRepository from "../../../repositories/Institute";

const handler: HttpHandler = async (conn, req, context) => {
  const data = req.body as IUser;

  const instituteRepository = new InstituteRepository(conn);

  const hasInstitute = await instituteRepository.findOne({
    where: {
      _id: data.institute,
      active: true,
    },
  });

  if (!hasInstitute) {
    return res.badRequest("Institute not found");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user: IUser = await new User(conn).model().create({
    ...data,
    password: hashedPassword,
    institute: hasInstitute,
  });

  return res.created({
    name: user.name,
    email: user.email,
    matriculation: user.matriculation,
    roles: user.roles,
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      password: schema.string().required().min(6).max(255),
      email: schema.string().required().email(),
      isExternal: schema.boolean().default(false),
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
    permission: "user.create",
    options: {
      methods: ["POST"],
      route: "user",
    },
  });
