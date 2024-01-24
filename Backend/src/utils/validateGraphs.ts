import { IStep } from "../models/Workflow";

export default function validateGraph(steps: IStep[]) {
  const ids = new Set<string>();

  for (const step of steps) {
    if (ids.has(step.id)) {
      const err = {
        status: 400,
        message: `Duplicate step id ${step.id}`,
      };

      throw err;
    }

    ids.add(step.id);
  }

  for (const step of steps) {
    if (step.next_step_id && !ids.has(step.next_step_id)) {
      const err = {
        status: 400,
        message: `O Step ${step.id} possui um proximo step inválido`, 
      };

      throw err;
    }
  }

  const start = steps.find((step) => step.id === "start");

  if (!start) {
    const err = {
      status: 400,
      message: `Sem step inicial`,
    };

    throw err;
  }

  const visited = new Set<string>();

  const dfs = (step: IStep) => {
    if (visited.has(step.id)) {
      return;
    }

    visited.add(step.id);

    if (step.next_step_id) {
      const nextStep = steps.find((s) => s.id === step.next_step_id);

      if (nextStep) {
        dfs(nextStep);
      }
    }
  };
}
