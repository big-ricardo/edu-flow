import {
  app,
  InvocationContext,
  ServiceBusQueueFunctionOptions,
} from "@azure/functions";
import { Connection, ObjectId } from "mongoose";
import mongo from "../services/mongo";
import * as yup from "yup";
import Activity, { IActivityStepStatus } from "../models/Activity";

export interface GenericMessage {
  activity_id: string;
  activity_step_id: string;
}

type AzureFunctionHandler<TMessage extends GenericMessage> = (
  message: TMessage,
  context: InvocationContext
) => Promise<void>;

type callbackSchema = (schema: typeof yup) => {
  message?: yup.ObjectSchema<yup.AnyObject>;
};

export type QueueWrapperHandler<TMessage extends GenericMessage> = (
  conn: Connection,
  ...args: Parameters<AzureFunctionHandler<TMessage & GenericMessage>>
) => Promise<void>;

export default class QueueWrapper<TMessage> {
  private handler: QueueWrapperHandler<TMessage & GenericMessage>;
  private schemaValidator = yup.object().shape({
    message: yup.object().shape({ activity_step_id: yup.string().required() }),
  });

  constructor(handler: typeof QueueWrapper.prototype.handler) {
    this.handler = handler;
  }

  public setSchemaValidator = (callback: callbackSchema): this => {
    const { message } = callback(yup);

    this.schemaValidator = yup.object().shape({
      message:
        message ??
        yup.object().shape({ activity_step_id: yup.string().required() }),
    });

    return this;
  };

  private run: AzureFunctionHandler<TMessage & GenericMessage> = async (
    message,
    context
  ) => {
    let conn: Connection;

    try {
      conn = mongo.connect("db");
      await new Activity(conn)
        .model()
        .findById(message.activity_id)
        .then((activity) => {
          const activityWorkflow = activity.workflows.find(
            (workflow) => !workflow.finished
          );
          activityWorkflow.steps.find(
            (step) => step._id.toString() === message.activity_step_id
          ).status = IActivityStepStatus.inProgress;
          return activity.save();
        });

      await this.schemaValidator
        .validate({
          message,
        })
        .catch((error) => {
          const err = {
            status: 400,
            message: error.message,
          };
          throw err;
        });

      await this.handler(conn, message, context).catch((error) => {
        throw error;
      });

      await new Activity(conn)
        .model()
        .findById(message.activity_id)
        .then((activity) => {
          const activityWorkflow = activity.workflows.find(
            (workflow) => !workflow.finished
          );
          activityWorkflow.steps.find(
            (step) => step._id.toString() === message.activity_step_id
          ).status = IActivityStepStatus.finished;
          return activity.save();
        });

      return Promise.resolve();
    } catch (error) {
      if (conn) {
        await new Activity(conn)
          .model()
          .findById(message.activity_id)
          .then((activity) => {
            const activityWorkflow = activity.workflows.find(
              (workflow) => !workflow.finished
            );
            activityWorkflow.steps.find(
              (step) => step._id.toString() === message.activity_step_id
            ).status = IActivityStepStatus.error;
            return activity.save();
          });
      }

      return Promise.reject(error);
    }
  };

  public configure = (configs: {
    name: string;
    options: Omit<ServiceBusQueueFunctionOptions, "connection" | "handler">;
  }): this => {
    const { name, options } = configs;
    // app.serviceBusQueue(name, {
    //   ...options,
    //   connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
    //   handler: this.run,
    //   extraOutputs: sbusOutputs,
    // });
    return this;
  };
}
