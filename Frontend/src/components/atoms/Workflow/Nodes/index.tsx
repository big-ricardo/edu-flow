import ChangeStatus from "./ChangeStatus";
import CircleNode from "./Circle";
import Interaction from "./Interaction";
import SendEmail from "./SendEmail";
import SwapWorkflow from "./SwapWorkflow";
import Conditional from "./Conditional";
import WebRequest from "./WebRequest";

export default {
  circle: CircleNode,
  send_email: SendEmail,
  change_status: ChangeStatus,
  swap_workflow: SwapWorkflow,
  interaction: Interaction,
  conditional: Conditional,
  web_request: WebRequest,
};
