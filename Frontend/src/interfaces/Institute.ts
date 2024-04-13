import IUniversity from "./University";

export default interface IInstitute {
  _id: string;
  name: string;
  acronym: string;
  active: boolean;
  university: IUniversity;
}
