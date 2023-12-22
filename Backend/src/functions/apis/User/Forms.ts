import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute from "../../../models/Institute";

const handler: HttpHandler = async (conn) => {
  const institutes = await new Institute(conn).model().aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $lookup: {
        from: "universities",
        localField: "university",
        foreignField: "_id",
        as: "university",
      },
    },
    {
      $unwind: "$university",
    },
    {
      $group: {
        _id: "$university._id",
        label: { $first: "$university.acronym" },
        options: {
          $push: {
            value: "$_id",
            label: "$acronym",
          },
        },
      },
    },
  ]);

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Docente", value: "teacher" },
    { label: "Discente", value: "student" }, 
  ];

  return res.success({
    institutes,
    roles,
  });
};

export default new Http(handler).configure({
  name: "UserForms",
  options: {
    methods: ["GET"],
    route: "user/forms",
  },
});
