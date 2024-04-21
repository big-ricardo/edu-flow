import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute from "../../../models/client/Institute";
import University from "../../../models/client/University";

interface DtoInstitute {
  name: string;
  acronym: string;
  university: string;
}

const handler: HttpHandler = async (conn, req) => {
  const { name, acronym, university } = req.body as DtoInstitute;

  const universityData = await new University(conn)
    .model()
    .findById(university);

  const institute = await new Institute(conn).model().create({
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
    options: {
      methods: ["POST"],
      route: "institute",
    },
  });
