import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import InstituteRepository from "../../../repositories/Institute";

interface DtoInstitute {
  name: string;
  acronym: string;
}

const handler: HttpHandler = async (conn, req) => {
  const { name, acronym } = req.body as DtoInstitute;

  const instituteRepository = new InstituteRepository(conn);

  const institute = await instituteRepository.create({
    name,
    acronym,
  });

  return res.created(institute);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      acronym: schema.string().required().min(3).max(255),
    }),
  }))
  .configure({
    name: "InstituteCreate",
    permission: "institute.create",
    options: {
      methods: ["POST"],
      route: "institute",
    },
  });
