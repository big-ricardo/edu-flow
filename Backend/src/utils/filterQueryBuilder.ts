export enum WhereType {
  EQUAL = "equal",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATE = "date",
  ARRAY = "array",
  ILIKE = "ilike",
}

export default class FilterQueryBuilder {
  private types: Record<string, WhereType>;

  constructor(types: Record<string, WhereType>) {
    this.types = types;
  }

  public build(
    filters: Record<string, string | boolean | number>
  ): Record<string, any> {
    const where: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        where[key] = this.buildFilter(key, value);
      }
    });

    return where;
  }

  private buildFilter(key: string, value: any): any {
    if (this.types[key] === WhereType.ARRAY) {
      return {
        $in: value.split(","),
      };
    }

    if (this.types[key] === WhereType.ILIKE) {
      return { $regex: value, $options: "i" };
    }

    return value;
  }
}
