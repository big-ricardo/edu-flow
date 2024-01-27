import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import University from "../../../models/University";

interface DtoUniversity {
  name?: string;
  acronym?: string;
  active?: boolean;
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { name, acronym, active } = req.body as DtoUniversity;

  const university = new University(conn).model();
  const updatedUniversity = await university.findByIdAndUpdate(
    id,
    { name, acronym, active },
    { new: true },
  );

  if (!updatedUniversity) {
    return res.notFound("University not found");
  }

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
