import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import InstituteRepository from "../../../repositories/Institute";

interface DtoInstitute {
  name?: string;
  acronym?: string;
  active?: boolean;
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { name, acronym, active } = req.body as DtoInstitute;

  const instituteRepository = new InstituteRepository(conn);

  const updatedInstitute = await instituteRepository.findByIdAndUpdate({
    id,
    data: { name, acronym, active },
  });

  if (!updatedInstitute) {
    return res.notFound("Institute not found");
  }

  return res.success(updatedInstitute);
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
    name: "InstituteUpdate",
    permission: "institute.update",
    options: {
      methods: ["PUT"],
      route: "institute/{id}",
    },
  });
