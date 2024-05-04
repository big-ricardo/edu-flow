import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import UniversityRepository from "../../../repositories/University";

interface DtoUniversity {
  name: string;
  acronym: string;
}

const handler: HttpHandler = async (conn, req) => {
  const { name, acronym } = req.body as DtoUniversity;
  const universityRepository = new UniversityRepository(conn);

  const university = await universityRepository.create({
    name,
    acronym,
  });

  university.save();

  return res.created(university);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      acronym: schema.string().required().min(3).max(255),
    }),
  }))
  .configure({
    name: "UniversityCreate",
    options: {
      methods: ["POST"],
      route: "university",
    },
  });
