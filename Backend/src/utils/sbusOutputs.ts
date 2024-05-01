import { InvocationContext, output } from "@azure/functions";
import { Connection } from "mongoose";
import { GenericMessage } from "../middlewares/queue";

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

export const extraOutputsInteractionProcess = output.serviceBusQueue({
  queueName: "interaction_process",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

export const extraOutputsEvaluationProcess = output.serviceBusQueue({
  queueName: "evaluation_process",
  connection: "AZURE_SERVICE_BUS_CONNECTION_STRING",
});

const extraOutputs = {
  swap_workflow: extraOutputsSwapWorkflow,
  send_email: extraOutputsSendEmail,
  interaction: extraOutputsInteraction,
  evaluated: extraOutputsEvaluated,
  change_status: extraOutputsChangeStatus,
  interaction_process: extraOutputsInteractionProcess,
  evaluation_process: extraOutputsEvaluationProcess,
};

const sbusOutputs = Object.values(extraOutputs);

export default sbusOutputs;

type SendToQueue = ({
  context,
  queueName,
  message,
}: {
  context: InvocationContext;
  queueName: string;
  message: Object & GenericMessage;
}) => void;

export const sendToQueue: SendToQueue = ({ context, queueName, message }) => {
  console.log("sendToQueue", queueName, message);
  context.extraOutputs.set(extraOutputs[queueName], message);

  context.info(`Sent to queue ${queueName}`);
};
