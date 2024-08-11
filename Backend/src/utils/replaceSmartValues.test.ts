import { replaceVariables } from "./replaceSmartValues";

describe("replaceVariables", () => {
  it("should replace variables in the template with corresponding values from the data object", () => {
    const data = {
      name: "John",
      age: 30,
      hobbies: ["reading", "coding"],
      clothes: [
        {
          type: "shirt",
          color: "blue",
        },
        {
          type: "pants",
          color: "black",
        },
      ],
      address: {
        city: "New York",
        country: "USA",
      },
    };

    const template =
      "My name is ${{activity.name}} and I am ${{activity.age}} years old. My hobbies are ${{activity.#hobbies}}. I live in ${{activity.address.city}}, ${{activity.address.country}} and I am wearing a ${{activity.#clothes.color}} ${{activity.#clothes.type}}";

    const expectedOutput =
      "My name is John and I am 30 years old. My hobbies are reading, coding. I live in New York, USA and I am wearing a blue, black shirt, pants";

    const result = replaceVariables({ activity: data }, template);

    expect(result).toBe(expectedOutput);
  });

  it("should return the original template if a variable is not found in the data object", () => {
    const data = {
      name: "John",
      age: 30,
    };

    const template =
      "My name is ${{activity.name}} and I am ${{activity.age}} years old. I live in ${{activity.address.city}}, ${{activity.address.country}}.";

    const expectedOutput =
      "My name is John and I am 30 years old. I live in -, -.";

    const result = replaceVariables({ activity: data }, template);

    expect(result).toBe(expectedOutput);
  });

  it("should return array of emails of masterminds", () => {
    const data = {
      masterminds: [
        {
          user: {
            email: "email1@unifei.edu.br",
          },
        },
        {
          user: {
            email: "email2@unifei.edu.br",
          },
        },
      ],
    };

    const template = "Send email to ${{activity.#masterminds.user.email}} ok.";

    const expectedOutput =
      "Send email to email1@unifei.edu.br, email2@unifei.edu.br ok.";

    const result = replaceVariables({ activity: data }, template);

    expect(result).toBe(expectedOutput);
  });

  it("should return array of array", () => {
    const data = {
      masterminds: [
        {
          email: ["email1@unifei.edu.br", "email1@gmail.com"],
        },
        {
          email: ["email2@unifei.edu.br", "email1@gmail.com"],
        },
      ],
    };

    const template = "${{activity.#masterminds.#email}}";

    const expectedOutput =
      "email1@unifei.edu.br, email1@gmail.com, email2@unifei.edu.br, email1@gmail.com";

    const result = replaceVariables({ activity: data }, template);

    expect(result).toBe(expectedOutput);
  });

  it("should return array of emails of users", () => {
    const data = {
      users: [
        {
          _id: {
            $oid: "6617d3bbbf168b47ecb6c04f",
          },
          isExternal: false,
          name: "Luis Ricardo",
          email: "email@unifei.edu.br",
          matriculation: "2021031844",
          university_degree: null,
          institute: {
            _id: {
              $oid: "6617d0d9b3a6fbb432f0374f",
            },
            name: "Instituto de Matemática e Computação",
            acronym: "IMC",
            active: true,
            university: {
              _id: {
                $oid: "65a327cb3ce32bf8c57f716a",
              },
              name: "Universidade Federal de Itajubá",
              acronym: "UNIFEI",
              active: true,
              updatedAt: {
                $date: "2024-01-14T00:28:34.646Z",
              },
            },
            createdAt: {
              $date: "2024-04-11T12:00:25.331Z",
            },
            updatedAt: {
              $date: "2024-04-11T12:00:25.331Z",
            },
            __v: 0,
          },
        },
      ],
    };

    const template = "${{activity.#users.email}}";

    const expectedOutput = "email@unifei.edu.br";

    const result = replaceVariables({ activity: data }, template);

    expect(result).toBe(expectedOutput);
  });
});
