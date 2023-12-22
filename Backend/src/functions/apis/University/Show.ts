import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import University from "../../../models/University";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const university = await new University(conn).model().findById(id);

  if (!university) {
    return res.notFound("University not found");
  }

  return res.success(university);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "UniversityShow",
    options: {
      methods: ["GET"],
      route: "university/{id}",
    },
  });
