import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import * as bcrypt from "bcrypt";
import { connect, connectAdmin } from "../../../services/mongo";
import AdminClient from "../../../models/admin/Client";
import UserRepository from "../../../repositories/User";
import { IUserRoles } from "../../../models/client/User";
import UniversityRepository from "../../../repositories/University";
import InstituteRepository from "../../../repositories/Institute";

interface Body {
  name: string;
  acronym: string;
}
export const handler: HttpHandler = async (_, req, context) => {
  const { name, acronym } = req.body as Body;

  const adminConn = await connectAdmin();

  const client = await new AdminClient(adminConn).model().findOne({
    acronym,
  });

  if (client) {
    return res.notFound("Instance already exists");
  }

  const instance = await new AdminClient(adminConn).model().create({
    acronym,
    name,
  });

  const conn = connect(instance.acronym);

  const universityRepository = new UniversityRepository(conn);
  const instituteRepository = new InstituteRepository(conn);
  const userRepository = new UserRepository(conn);
  const password = await bcrypt.hash("admin", 10);

  const university = await universityRepository.create({
    name: "Universidade Federal de Itajubá",
    acronym: "UNIFEI",
    active: true,
  });

  const institute = await instituteRepository.create({
    name: "Instituto de Matemática e Computação",
    acronym: "IMC",
    active: true,
    university,
  });

  const user = await userRepository.create({
    name: "Admin",
    email: "admin@eduflow.tech",
    password,
    roles: [IUserRoles.admin],
    institute: institute,
  });

  await instance.save();
  await user.save();

  return res.success({
    instance,
    user,
  });
};

export default new Http(handler)
  .setPublic()
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required(),
      acronym: schema
        .string()
        .matches(/^[a-z]+$/)
        .required(),
    }),
  }))
  .configure({
    name: "InstanceCreate",
    options: {
      methods: ["POST"],
      route: "instance",
    },
  });
