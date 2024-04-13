import { InvocationContext, output } from "@azure/functions";
import { Connection } from "mongoose";

export const extraOutputsSwapWorkflow = output.serviceBusQueue({
  queueName: "swap_workflow",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

const extraOutputsInteraction = output.serviceBusQueue({
  queueName: "interaction",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

const extraOutputsSendEmail = output.serviceBusQueue({
  queueName: "send_email",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

const extraOutputsEvaluated = output.serviceBusQueue({
  queueName: "evaluated",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

const extraOutputsChangeStatus = output.serviceBusQueue({
  queueName: "change_status",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

const extraOutputs = {
  swap_workflow: extraOutputsSwapWorkflow,
  send_email: extraOutputsSendEmail,
  interaction: extraOutputsInteraction,
  evaluated: extraOutputsEvaluated,
  change_status: extraOutputsChangeStatus,
};

const sbusOutputs = Object.values(extraOutputs);

export default sbusOutputs;

type SendToQueue = ({
  context,
  queueName,
  message,
  conn,
}: {
  context: InvocationContext;
  queueName: string;
  message: any;
  conn: Connection;
}) => void;

export const sendToQueue: SendToQueue = ({
  context,
  queueName,
  message,
  conn,
}) => {
  context.extraOutputs.set(extraOutputs[queueName], message);

  context.info(`Sent to queue ${queueName}`);
};
