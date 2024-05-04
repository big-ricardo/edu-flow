import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import UniversityRepository from "../../../repositories/University";
import InstituteRepository from "../../../repositories/Institute";

interface DtoUniversity {
  name?: string;
  acronym?: string;
  active?: boolean;
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { name, acronym, active } = req.body as DtoUniversity;

  const universityRepository = new UniversityRepository(conn);
  const instituteRepository = new InstituteRepository(conn);

  const updatedUniversity = await universityRepository.findByIdAndUpdate({
    id,
    data: { name, acronym, active },
  });

  if (!updatedUniversity) {
    return res.notFound("University not found");
  }

  await instituteRepository.updateMany({
    where: { "university._id": id },
    data: { "university.name": name, "university.acronym": acronym },
  });

  return res.success(updatedUniversity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().optional().min(3).max(255),
      acronym: schema.string().optional().min(3).max(255),
      active: schema.boolean().optional(),
    }),
    params: schema.object().shape({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "UniversityUpdate",
    options: {
      methods: ["PUT"],
      route: "university/{id}",
    },
  });
