import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute from "../../../models/client/Institute";
import University from "../../../models/client/University";

interface DtoUniversity {
  name?: string;
  acronym?: string;
  active?: boolean;
  university?: string;
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { name, acronym, active, university } = req.body as DtoUniversity;

  const haveUniversity = await new University(conn)
    .model()
    .findById(university);

  if (!haveUniversity) {
    return res.notFound("University not found");
  }

  const institute = new Institute(conn).model();
  const updatedUniversity = await institute.findByIdAndUpdate(
    id,
    { name, acronym, active, university: haveUniversity.toObject() },
    { new: true }
  );

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
    options: {
      methods: ["PUT"],
      route: "institute/{id}",
    },
  });
