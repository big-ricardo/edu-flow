import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import UniversityRepository from "../../../repositories/University";
import InstituteRepository from "../../../repositories/Institute";

interface DtoInstitute {
  name: string;
  acronym: string;
  university: string;
}

const handler: HttpHandler = async (conn, req) => {
  const { name, acronym, university } = req.body as DtoInstitute;

  const universityRepository = new UniversityRepository(conn);
  const instituteRepository = new InstituteRepository(conn);

  const universityData = await universityRepository.findById({
    id: university,
  });

  const institute = await instituteRepository.create({
    name,
    acronym,
    university: universityData.toObject(),
  });

  return res.created(institute);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      acronym: schema.string().required().min(3).max(255),
      university: schema.string().required(),
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
