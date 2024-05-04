import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormRepository from "../../../repositories/Form";
import { IFormType } from "../../../models/client/Form";

const predefinedValues = {
  teachers: null,
  students: null,
  institution: null,
};

const handler: HttpHandler = async (conn, req) => {
  const formRepository = new FormRepository(conn);

  const forms = await formRepository.findOpenForms({
    where: {
      type: IFormType.Created,
      $and: [
        {
          $or: [
            {
              institute: {
                $eq: req.user.institute._id,
              },
            },
            {
              institute: {
                $eq: null,
              },
            },
          ],
        },
      ],
    },
    select: {
      name: 1,
      slug: 1,
      description: 1,
      period: 1,
      published: 1,
      institute: 1,
    },
  });

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
