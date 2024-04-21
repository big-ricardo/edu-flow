import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import User, { IUser, IUserRoles } from "../../../models/client/User";
import Institute from "../../../models/client/Institute";

const handler: HttpHandler = async (conn, req, context) => {
  const { id } = req.params;
  const data = req.body as IUser;

  const user = new User(conn).model();
  const existingUser = await user.findById(id);

  if (!existingUser) {
    return res.notFound("User not found");
  }

  const hasInstitute = data.institute
    ? (
        await new Institute(conn).model().findOne({
          _id: data.institute,
        })
      ).toObject()
    : existingUser.institute;

  if (!hasInstitute) {
    return res.badRequest("Institute not found");
  }

  const hashedPassword = data.password
    ? await bcrypt.hash(data.password, 10)
    : existingUser.password;

  const updatedUser = await user.findByIdAndUpdate(
    id,
    {
      ...existingUser.toObject(),
      ...data,
      password: data.password ? hashedPassword : existingUser.password,
      institute: data.institute ? hasInstitute : existingUser.institute,
    },
    { new: true }
  );

  return res.success({
    name: updatedUser.name,
    email: updatedUser.email,
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
      password: schema
        .string()
        .optional()
        .test({
          name: "password",
          message: "Password must have at least 6 characters",
          test: (value) => !value || value.length >= 6,
        }),
      matriculation: schema.string().optional(),
      roles: schema
        .array(schema.mixed().oneOf(["admin", "student", "teacher"]))
        .required(),
      institute: schema.string().optional(),
      isExternal: schema.boolean().optional(),
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
