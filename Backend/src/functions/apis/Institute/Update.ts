import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import InstituteRepository from "../../../repositories/Institute";
import UniversityRepository from "../../../repositories/University";
import UserRepository from "../../../repositories/User";

interface DtoUniversity {
  name?: string;
  acronym?: string;
  active?: boolean;
  university?: string;
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { name, acronym, active, university } = req.body as DtoUniversity;

  const instituteRepository = new InstituteRepository(conn);
  const universityRepository = new UniversityRepository(conn);
  const userRepo = new UserRepository(conn);

  const haveUniversity = await universityRepository.findById({
    id: university,
  });

  if (!haveUniversity) {
    return res.notFound("University not found");
  }
  const updatedUniversity = await instituteRepository.findByIdAndUpdate({
    id,
    data: { name, acronym, active, university: haveUniversity.toObject() },
  });

  if (!updatedUniversity) {
    return res.notFound("Institute not found");
  }
  
  return res.success(updatedUniversity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().optional().min(3).max(255),
      acronym: schema.string().optional().min(3).max(255),
      active: schema.boolean().optional(),
      university: schema.string().optional(),
    }),
    params: schema.object().shape({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "InstituteUpdate",
    permission: "institute.update",
    options: {
      methods: ["PUT"],
      route: "institute/{id}",
    },
  });
