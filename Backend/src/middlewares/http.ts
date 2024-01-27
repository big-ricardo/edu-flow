import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  HttpRequestParams,
  HttpFunctionOptions,
} from "@azure/functions";
import * as yup from "yup";
import res from "../utils/apiResponse";
import jwt from "../services/jwt";
import mongo from "../services/mongo";
import { Connection } from "mongoose";

const hasBody = ["POST", "PUT", "PATCH"];

interface THttpRequest {
  body: Object;
  query: Object;
  params: HttpRequestParams;
  headers: Object;
  method: string;
  url: string;
  user: User | null;
  bodyUsed: boolean;
}

interface User {
  id: string;
  name: string;
  matriculation: string;
  email: string;
  role: "student" | "admin" | "teacher" | "coordinator";
}

export type HttpHandler = (
  conn: Connection,
  request: THttpRequest,
  context: InvocationContext,
) => Promise<HttpResponseInit>;

type AzureFunctionHandler = (
  request: HttpRequest,
  context: InvocationContext,
) => Promise<HttpResponseInit>;

type callbackSchema = (schema: typeof yup) => {
  body?: yup.ObjectSchema<yup.AnyObject>;
  query?: yup.ObjectSchema<yup.AnyObject>;
  headers?: yup.ObjectSchema<yup.AnyObject>;
  params?: yup.ObjectSchema<yup.AnyObject>;
};

export default class Http {
  private handler: HttpHandler;
  private isPublic: boolean = false;
  private schemaValidator = yup.object().shape({
    body: yup.object().shape({}).nullable(),
    query: yup.object().shape({}).nullable(),
    params: yup.object().shape({}).nullable(),
    headers: yup.object().shape({}).nullable(),
  });
  private name: string;
  private conn: Connection | null = null;

  constructor(handler: typeof Http.prototype.handler) {
    this.handler = handler;
  }
  private run: AzureFunctionHandler = async (request, context) => {
    try {
      const body = hasBody.includes(request.method) ? await request.json() : {};
      const query = Object.fromEntries(request.query.entries());
      const headers = Object.fromEntries(request.headers.entries());
      const params = request.params;
      let user: User = null;

      if (!this.isPublic) {
        user = jwt.verify(headers);
      }

      await this.schemaValidator
        .validate({
          body,
          query,
          headers,
          params,
        })
        .catch((error) => {
          const err = {
            status: 400,
            message: error.message,
          };
          throw err;
        });

      this.conn = await mongo.connect("db");

      return await this.handler(
        this.conn,
        {
          ...request,
          body,
          query,
          params,
          headers,
          user,
        },
        context,
      );
    } catch (error) {
      context.error(error);

      if (error.name === "TokenExpiredError") {
        return res.unauthorized("Token expired in " + error.expiredAt);
      }

      if (error.status) {
        return res.error(error.status, null, error.message);
      }

      return res.internalServerError();
    } finally {
      // await mongo.disconnect(this.conn);
    }
  };

  public configure = (configs: {
    name: string;
    options: Omit<HttpFunctionOptions, "handler">;
  }): this => {
    const { name, options } = configs;
    this.name = name;

    app.http(name, {
      ...options,
      route: options.route ?? name.toLowerCase().replace(/\s/g, "-"),
      handler: this.run,
      authLevel: "anonymous",
    });
    return this;
  };

  public setPublic = (): this => {
    this.isPublic = true;
    return this;
  };

  public setSchemaValidator = (callback: callbackSchema): this => {
    const { body, params, headers } = callback(yup);

    this.schemaValidator = yup.object().shape({
      body: body ?? yup.object().shape({}),
      params: params ?? yup.object().shape({}),
      headers: headers ?? yup.object().shape({}),
      query: yup.object().shape({}),
    });

    return this;
  };
}
