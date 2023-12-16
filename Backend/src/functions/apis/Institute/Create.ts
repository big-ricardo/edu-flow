import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute, { IInstitute } from "../../../models/Institute";

const handler: HttpHandler = async (conn, req) => {
  const { name, acronym } = req.body as IInstitute;

  const institute: IInstitute = await Institute.create({
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
    options: {
      methods: ["POST"],
      route: "institute",
    },
  });
