import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import University from "../../../models/client/University";

const handler: HttpHandler = async (conn) => {
  const universities = (
    await new University(conn)
      .model()
      .find()
      .where({
        active: true,
      })
      .select({
        _id: 1,
        acronym: 1,
      })
      .sort({
        acronym: 1,
      })
  ).map((university) => ({ label: university.acronym, value: university._id }));

  return res.success({
    universities,
  });
};

export default new Http(handler).configure({
  name: "InstituteForms",
  options: {
    methods: ["GET"],
    route: "institute/forms",
  },
});
