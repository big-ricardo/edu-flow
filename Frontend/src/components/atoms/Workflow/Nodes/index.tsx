import ChangeStatus from "./ChangeStatus";
import CircleNode from "./Circle";
import Interaction from "./Interaction";
import SendEmail from "./SendEmail";
import SwapWorkflow from "./SwapWorkflow";
import Evaluated from "./Evaluated";
import WebRequest from "./WebRequest";

export default {
  circle: CircleNode,
  send_email: SendEmail,
  change_status: ChangeStatus,
  swap_workflow: SwapWorkflow,
  interaction: Interaction,
  evaluated: Evaluated,
  web_request: WebRequest,
};
