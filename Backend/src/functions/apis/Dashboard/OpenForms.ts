import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form, { IForm } from "../../../models/Form";
import moment from "moment";
import User from "../../../models/User";
import Institute from "../../../models/Institute";
import FormDraft, { IFormDraft } from "../../../models/FormDraft";

const predefinedValues = {
  teachers: null,
  students: null,
  institution: null,
};

const handler: HttpHandler = async (conn, req) => {
  const forms = await new Form(conn)
    .model()
    .find({
      active: true,
      published: { $exists: true },
      $and: [
        {
          $or: [
            {
              "period.open": {
                $exists: false,
              },
            },
            {
              "period.open": {
                $lte: moment.utc().toDate(),
              },
            },
          ],
        },
        {
          "period.close": {
            $gte: moment.utc().toDate(),
          },
        },
      ],
    })

  if (!forms) {
    return res.notFound("Form not found");
  }

  return res.success(forms);
};

export default new Http(handler).configure({
  name: "DashboardOpenForms",
  options: {
    methods: ["GET"],
    route: "dashboard/open-forms",
  },
});
