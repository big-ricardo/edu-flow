import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute from "../../../models/client/Institute";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const institute = await new Institute(conn).model().findById(id);

  if (!institute) {
    return res.notFound("Institute not found");
  }

  return res.success(institute);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "InstituteShow",
    options: {
      methods: ["GET"],
      route: "institute/{id}",
    },
  });
