import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute, { IInstitute } from "../../../models/Institute";

const handler: HttpHandler = async (conn, req, context) => {
  const institutes: IInstitute[] = await Institute.find();

  return res.success(institutes);
};

export default new Http(handler).configure({
  name: "InstituteList",
  options: {
    methods: ["GET"],
    route: "institutes",
  },
});
