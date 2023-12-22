import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import User, { IUser } from "../../../models/User";
import Institute from "../../../models/Institute";

const handler: HttpHandler = async (conn, req, context) => {
  const { id } = req.params;
  const {
    name,
    cpf,
    password,
    email,
    matriculation,
    role,
    institute,
    university_degree = null,
  } = req.body as IUser;

  const user = new User(conn).model();
  const existingUser = await user.findById(id);

  if (!existingUser) {
    return res.notFound("User not found");
  }

  if (institute) {
    const hasInstitute = await new Institute(conn).model().exists({
      _id: institute,
      active: true,
    });

    if (!hasInstitute) {
      return res.badRequest("Institute not found");
    }
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : existingUser.password;

  const updatedUser = await user.findByIdAndUpdate(
    id,
    {
      name: name ?? existingUser.name,
      cpf: cpf ?? existingUser.cpf,
      password: hashedPassword,
      email: email ?? existingUser.email,
      matriculation: matriculation ?? existingUser.matriculation,
      role: role ?? existingUser.role,
      institute: institute ?? existingUser?.institute,
      university_degree:
        role === "teacher"
          ? university_degree ?? existingUser.university_degree
          : null,
    },
    { new: true }
  );

  return res.success({
    name: updatedUser.name,
    email: updatedUser.email,
    cpf: updatedUser.cpf,
    matriculation: updatedUser.matriculation,
    role: updatedUser.role,
    university_degree: updatedUser.university_degree,
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().optional().min(3).max(255),
      email: schema.string().optional().email(),
      cpf: schema.string().optional(),
      password: schema
        .string()
        .optional()
        .test({
          name: "password",
          message: "Password must have at least 6 characters",
          test: (value) => !value || value.length >= 6,
        }),
      matriculation: schema.string().optional(),
      role: schema.string().optional().oneOf(["admin", "student", "teacher"]),
      institute: schema.string().optional(),
      university_degree: schema
        .string()
        .optional()
        .oneOf(["mastermind", "doctor"])
        .when("role", ([role], schema) =>
          role === "teacher"
            ? schema.required()
            : schema.notRequired().nullable()
        ),
    }),
    params: schema.object().shape({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "UserUpdate",
    options: {
      methods: ["PUT"],
      route: "user/{id}",
    },
  });
